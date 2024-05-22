import { formatter } from "postchain-client";
import { claimTestChrOperation } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { useState } from "react";
import { useContext } from "react";
import { AssetContext } from "./ContextProvider.tsx";
import { ChromiaSessionContext } from "./ContextProvider.tsx";
import { createAmountFromBalance } from "@chromia/ft4";
import { BalanceContext } from "./Queries.tsx";
import { ReloadContext } from "./Queries.tsx";
import PurchaseLease from "./PurchaseLease.tsx";
import { callOperation } from "./common.ts";

export default function MyBalance() {
  const asset = useContext(AssetContext)!!;
  const session = useContext(ChromiaSessionContext)!!;
  const reload = useContext(ReloadContext)!!;
  const balance = useContext(BalanceContext);

  const [showPurchase, setShowPurchase] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  function formatBalance(balance: bigint): string {
    return createAmountFromBalance(balance, asset.decimals).toString();
  }

  function claimTestChr() {
    setShowPurchase(false);

    return callOperation(session, claimTestChrOperation(), () => {
    }, () => {
    }, () => {
    })
      .then(() => setSuccessMessage("Test CHR added to account"))
      .catch(e => setErrorMessage(e.message))
  }

  function purchaseContainer() {
    setShowPurchase(true);
  }

  function purchaseSuccess(containerName: string) {
    setShowPurchase(false);
    setSuccessMessage(`Container ${containerName} created`);
    return reload();
  }

  function purchaseError(errorMessage: string) {
    setShowPurchase(false);
    setErrorMessage(errorMessage);
    return Promise.resolve();
  }

  return (
    <div className="card mt-1">
      <div className="card-body">
        <h4 className="card-title">My Balance</h4>

        <div className={"toast mt-1 position-absolute" + (successMessage ? " show" : "")} role="alert"
             aria-live="assertive"
             aria-atomic="true">
          <div className="toast-header">
            <strong className="me-auto">Success</strong>
            <button type="button" className="btn-close" onClick={() => setSuccessMessage(undefined)}
                    aria-label="Close"></button>
          </div>
          <div className="toast-body">
            {successMessage}
          </div>
        </div>

        {errorMessage &&
          <div className="alert alert-danger alert-dismissible mt-2 overflow-x-auto" role="alert">
            <div>{errorMessage}</div>
            <button type="button" className="btn-close" onClick={() => setErrorMessage(undefined)}
                    aria-label="Close"></button>
          </div>}

        <h5>Address</h5>
        <p>0x{formatter.toString(session.account.id)}</p>

        <div className="row">
          <div className="col-3">
            <h5>Test CHR balance</h5>
            <p>{(balance !== undefined) &&
              <>{formatBalance(balance)} <img src={asset.iconUrl} alt={asset.symbol}/></>
            }</p>
          </div>

          <div className="col">
            {(balance !== undefined) &&
              <>{(balance < (Math.pow(10, asset.decimals) * 1000)) &&
                <button type="button" className="btn btn-primary m-2" onClick={() => claimTestChr()}>Claim Test
                  CHR</button>}
                {(balance > 0) &&
                  <button type="button" className="btn btn-primary" onClick={() => purchaseContainer()}>Purchase
                    Container
                    Lease
                  </button>
                }</>
            }
          </div>
        </div>

        <PurchaseLease show={showPurchase} onSuccess={purchaseSuccess} onError={purchaseError}/>
      </div>
    </div>
  );
}
