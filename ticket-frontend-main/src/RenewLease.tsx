import { SubmitHandler, useForm } from "react-hook-form";
import { formatter } from "postchain-client";
import { useState } from "react";
import { useContext } from "react";
import { ChromiaSessionContext } from "./ContextProvider.tsx";
import { renewContainerOperation } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { callOperation } from "./common.ts";

type Inputs = {
  durationWeeks: string,
};

export default function RenewLease({ containerName, onSuccess, onError }:
                                     {
                                       containerName: string | undefined,
                                       onSuccess: (containerName: string) => Promise<void>,
                                       onError: (errorMessage: string) => Promise<void>
                                     }) {
  const session = useContext(ChromiaSessionContext)!!;
  const { register, watch, handleSubmit } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(`renewLease: ${JSON.stringify(data)}`);
    return renewLease(parseInt(data.durationWeeks));
  };
  const [txRid, setTxRid] = useState<Buffer | undefined>();
  const [progress, setProgress] = useState<number>(0);
  const [message, setMessage] = useState<string | undefined>();

  const watchDurationWeeks = watch("durationWeeks", "1");

  function renewLease(durationWeeks: number): Promise<void> {
    return callOperation(session, renewContainerOperation(containerName!!, durationWeeks), setTxRid, setProgress, setMessage)
      .then(() => onSuccess(containerName!!))
      .catch(e => onError(e.message))
  }

  return containerName ? (
    <>
      <h4>Renew Container Lease</h4>
      <p>Container name: {containerName}</p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label" htmlFor="durationweeks">Duration (weeks)</label>
          <div className="range">
            <input type="range" className="form-range" id="durationweeks"
                   min={1} max={8} defaultValue={1} {...register("durationWeeks", { required: true })} />
          </div>
          <div>{watchDurationWeeks} weeks</div>
        </div>
        <button type="submit" className="btn btn-primary">Renew</button>
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
