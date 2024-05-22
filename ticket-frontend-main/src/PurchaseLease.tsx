import { SubmitHandler, useForm } from "react-hook-form";
import { createContainerOperation } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { getCreateContainerTicketByTransactionQueryObject } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { formatter, IClient, ResponseStatus, TransactionReceipt, TxRejectedError } from "postchain-client";
import { useState } from "react";
import { useContext } from "react";
import { ChromiaSessionContext } from "./ContextProvider.tsx";
import { DirectoryClientContext } from "./ContextProvider.tsx";
import { useQuery } from "./hooks.ts";
import { getOperationalDappClustersQueryObject } from "./client_stubs/common/queries/common_queries.ts";

type Inputs = {
  pubkey: string,
  containerUnits: string,
  extraStorageGib: string,
  durationWeeks: string,
  clusterName: string,
  autoRenew: boolean
};

export default function PurchaseLease({ show, onSuccess, onError }:
                                        {
                                          show: boolean,
                                          onSuccess: (containerName: string) => Promise<void>,
                                          onError: (errorMessage: string) => Promise<void>
                                        }) {
  const session = useContext(ChromiaSessionContext)!!;
  const directoryClient = useContext(DirectoryClientContext)!!;

  const { result: clusters } = useQuery(directoryClient, getOperationalDappClustersQueryObject());

  const { register, watch, handleSubmit, formState: { isSubmitted, errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(`createContainer: ${JSON.stringify(data)}`);
    createContainer(data.pubkey, parseInt(data.containerUnits), parseInt(data.durationWeeks), parseInt(data.extraStorageGib), data.clusterName, data.autoRenew);
  };
  const [txRid, setTxRid] = useState<Buffer | undefined>();
  let progressValue: number = 0;
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string | undefined>();

  const watchContainerUnits = watch("containerUnits", "1");
  const watchExtraStorageGib = watch("extraStorageGib", "0");
  const watchDurationWeeks = watch("durationWeeks", "1");

  function createContainer(
    providerPubkeyHex: string,
    containerUnits: number,
    durationWeeks: number,
    extraStorageGib: number,
    clusterName: string,
    autoRenew: boolean): void | Promise<void> {
    const providerPubkey = formatter.toBuffer(providerPubkeyHex);
    setTxRid(undefined);
    progressValue = 5;
    setProgress(progressValue);
    setMessage("sending...");
    return session.call(
      createContainerOperation(providerPubkey, containerUnits, "", durationWeeks, extraStorageGib, clusterName, autoRenew),
    )
      .then((receipt: TransactionReceipt) => {
        switch (receipt.status) {
          case ResponseStatus.Waiting:
            setTxRid(receipt.transactionRid);
            progressValue = Math.min(95, progressValue + 5)
            setProgress(progressValue);
            setMessage("still awaiting confirmation...");
            break;

          case ResponseStatus.Unknown:
            setTxRid(undefined);
            progressValue = 0;
            setProgress(progressValue);
            setMessage(undefined);
            break;

          case ResponseStatus.Rejected:
            setTxRid(undefined);
            progressValue = 0;
            setProgress(progressValue);
            setMessage(undefined);
            return onError(`rejected with status code ${receipt.statusCode}`);

          case ResponseStatus.Confirmed:
            setTxRid(receipt.transactionRid);
            progressValue = Math.max(20, Math.min(95, progressValue + 5));
            setProgress(progressValue);
            setMessage("confirmed, awaiting response...");
            return waitFinalization(session.client, receipt.transactionRid);
        }
      })
      .catch(e => {
        setTxRid(undefined);
        progressValue = 0;
        setProgress(progressValue);
        setMessage(undefined);
        if (e instanceof TxRejectedError) {
          return onError((e as TxRejectedError).fullReason);
        } else {
          return onError(e.message)
        }
      });
  }

  function waitFinalization(client: IClient, txRid: Buffer): Promise<void> {
    return client.query(getCreateContainerTicketByTransactionQueryObject(txRid)).then((maybeTicket) => {
      if (maybeTicket) {
        switch (maybeTicket.state as unknown as string) {
          case "PENDING":
            progressValue = Math.min(95, progressValue + 2);
            setProgress(progressValue);
            setTimeout(
              () => waitFinalization(client, txRid),
              client.config.pollingInterval
            );
            break;

          case "FAILURE":
            progressValue = 0;
            setProgress(progressValue);
            setMessage(undefined);
            return onError(`Unable to create container: ${maybeTicket.error_message}`);

          case "SUCCESS":
            progressValue = 100;
            setProgress(progressValue);
            return onSuccess(maybeTicket.container_name);
        }
      } else {
        progressValue = 0;
        setProgress(progressValue);
        setMessage(undefined);
        return onError("Unable to fetch ticket");
      }
    });
  }

  return show ? (
    <>
      <h4>Purchase Container Lease</h4>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label" htmlFor="pubkey">Public Key*</label>
          <input
            className={"form-control" + (isSubmitted ? ((errors as any)["pubkey"] ? " is-invalid" : " is-valid") : "")}
            id="pubkey"
            minLength={66} maxLength={66}
            placeholder="Paste your key here" {...register("pubkey", {
            required: true, pattern: /^[0-9A-Fa-f]+$/
          })} />
          <div className="invalid-feedback">Invalid public key</div>
          <div className="form-text"><a href="https://docs.chromia.com/testnet/deploy-dapp-cli">How do I get a public
            key?</a></div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="containerUnits">Number of SCUs</label>
          <div className="range">
            <input type="range" className="form-range" id="containerUnits"
                   min={1} max={12} defaultValue={1} {...register("containerUnits", { required: true })} />
          </div>
          <div>{watchContainerUnits} SCUs</div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="extraStorageGib">Additional storage space (GiB)</label>
          <div className="range">
            <input type="range" className="form-range" id="extraStorageGib"
                   min={0} max={256} defaultValue={0} {...register("extraStorageGib")} />
          </div>
          <div>{watchExtraStorageGib} GiB</div>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="durationweeks">Duration (weeks)</label>
          <div className="range">
            <input type="range" className="form-range" id="durationweeks"
                   min={1} max={8} defaultValue={1} {...register("durationWeeks", { required: true })} />
          </div>
          <div>{watchDurationWeeks} weeks</div>
        </div>
        <h5>Available clusters</h5>
        <div
          className={"input-group" + (isSubmitted ? ((errors as any)["clusterName"] ? " is-invalid" : " is-valid") : "")}>
          <table className="table">
            <thead>
            <tr>
              <th scope="col">Select</th>
              <th scope="col">Cluster name</th>
              <th scope="col">Cluster units</th>
              <th scope="col">Extra storage</th>
              <th scope="col">Node count</th>
            </tr>
            </thead>
            <tbody>
            {clusters &&
              clusters.map((cluster) => (
                <tr key={cluster.name}>
                  <td>
                    <div className="form-check">
                      <input type="radio"
                             className={"form-check-input" + (isSubmitted ? ((errors as any)["clusterName"] ? " is-invalid" : " is-valid") : "")}
                             id={cluster.name} value={cluster.name}
                             {...register("clusterName", { required: true })}/>
                    </div>
                  </td>
                  <td>{cluster.name}</td>
                  <td>{cluster.cluster_units}</td>
                  <td>{cluster.extra_storage}</td>
                  <td>{cluster.number_of_nodes}</td>
                </tr>))}
            </tbody>
          </table>
        </div>
        <div className="invalid-feedback mb-2">Please select a cluster</div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" value=""
                 id="autorenew" {...register("autoRenew")} />
          <label className="form-check-label" htmlFor="autorenew">Auto renew lease</label>
          <span className="m-1"
                title="Auto renew lease will if possible automatically pull Test CHR from your FT4 account when your lease is about to expire, only check this if you agree"><svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            className="bi bi-question-circle" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path
              d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/>
          </svg></span>
        </div>
        <button type="submit" className="btn btn-primary">Purchase</button>
      </form>

      <div className="progress mt-2" role="progressbar">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="mt-1">
        <>&nbsp;</>
        {txRid && <>Transaction {formatter.toString(txRid)}</>}
        {message && <> {message}</>}
      </div>
    </>
  ) : <></>;
}
