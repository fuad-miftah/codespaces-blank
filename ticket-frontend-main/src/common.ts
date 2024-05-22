import { Session } from "@chromia/ft4";
import { Operation } from "postchain-client";
import { TransactionReceipt } from "postchain-client";
import { ResponseStatus } from "postchain-client";
import { TxRejectedError } from "postchain-client";

export function callOperation(
  session: Session,
  operation: Operation,
  setTxRid: (txRid: Buffer | undefined) => void,
  setProgress: (progress: number) => void,
  setMessage: (message: string | undefined) => void): Promise<void> {

  let progressValue = 0;
  setTxRid(undefined);
  setProgress(progressValue);
  setMessage("sending...");
  return session.call(operation)
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
          throw new Error("unknown outcome");

        case ResponseStatus.Rejected:
          setTxRid(undefined);
          progressValue = 0;
          setProgress(progressValue);
          setMessage(undefined);
          throw new Error(`rejected with status code ${receipt.statusCode}`);

        case ResponseStatus.Confirmed:
          setTxRid(receipt.transactionRid);
          progressValue = 100;
          setProgress(progressValue);
          setMessage("confirmed");
          break;
      }
    })
    .catch(e => {
      setTxRid(undefined);
      progressValue = 0;
      setProgress(progressValue);
      setMessage(undefined);
      if (e instanceof TxRejectedError) {
        throw new Error((e as TxRejectedError).fullReason);
      } else {
        throw e;
      }
    });
}
