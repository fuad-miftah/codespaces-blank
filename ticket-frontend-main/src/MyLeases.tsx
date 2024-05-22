import { useState } from "react";
import { useContext } from "react";
import { LeasesContext } from "./Queries.tsx";
import { ReloadContext } from "./Queries.tsx";
import RenewLease from "./RenewLease.tsx";
import { ChromiaSessionContext } from "./ContextProvider.tsx";
import { autoRenewContainerOperation } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { cancelRenewContainerOperation } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { callOperation } from "./common.ts";

export default function MyLeases() {
  const session = useContext(ChromiaSessionContext)!!;
  const reload = useContext(ReloadContext)!!;
  const leases = useContext(LeasesContext);

  const [renewContainerName, setRenewContainerName] = useState<string | undefined>();
  const [successMessage, setSuccessMessage] = useState<string | undefined>();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  function renewLease(containerName: string) {
    setRenewContainerName(containerName);
  }

  function enableAutoRenew(containerName: string) {
    return callOperation(session, autoRenewContainerOperation(containerName), () => {
    }, () => {
    }, () => {
    })
      .then(() => {
        setSuccessMessage(`Enabled auto-renewal for container ${containerName}`);
        return reload();
      })
      .catch(e => setErrorMessage(e.message))
  }

  function disableAutoRenew(containerName: string) {
    return callOperation(session, cancelRenewContainerOperation(containerName), () => {
    }, () => {
    }, () => {
    })
      .then(() => {
        setSuccessMessage(`Disabled auto-renewal for container ${containerName}`);
        return reload();
      })
      .catch(e => setErrorMessage(e.message))
  }

  function renewSuccess(containerName: string) {
    setRenewContainerName(undefined);
    setSuccessMessage(`Container ${containerName} prolonged`);
    return reload();
  }

  function renewError(errorMessage: string) {
    setRenewContainerName(undefined);
    setErrorMessage(errorMessage);
    return Promise.resolve();
  }

  return (
    <div className="card mt-1">
      <div className="card-body">
        <h4 className="card-title">My leases</h4>

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

        {leases &&
          <table className="table">
            <thead>
            <tr>
              <th scope="col">Container name</th>
              <th scope="col">SCUs</th>
              <th scope="col">Extra storage</th>
              <th scope="col">Expiry</th>
              <th scope="col">Auto-renewal</th>
              <th scope="col">Renew</th>
            </tr>
            </thead>
            <tbody>
            {leases.map((lease) => (
              <tr key={lease.container_name}>
                <td>{lease.container_name}</td>
                <td>{lease.container_units}</td>
                <td>{lease.extra_storage_gib} GiB</td>
                <td>{lease.expired ? "expired" : new Date(lease.expire_time_millis).toISOString()}</td>
                <td><input type="checkbox" className="form-check-input" value="" checked={lease.auto_renew} readOnly={true}
                           onClick={() => {
                             if (lease.auto_renew)
                               return disableAutoRenew(lease.container_name);
                             else
                               return enableAutoRenew(lease.container_name);
                           }}/></td>
                <td>
                  <button type="button" className="btn btn-secondary"
                          onClick={() => renewLease(lease.container_name)}>Renew lease
                  </button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        }

        <RenewLease containerName={renewContainerName} onSuccess={renewSuccess} onError={renewError}/>
      </div>
    </div>
  );
}
