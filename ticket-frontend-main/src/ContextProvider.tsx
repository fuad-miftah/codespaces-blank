import { createContext, ReactNode, useEffect, useState } from "react";
import { createClient, formatter } from "postchain-client";
import { IClient } from "postchain-client";
import { getTicketChainRidQueryObject } from "./client_stubs/ticketing/ticketing.ts";
import { createKeyStoreInteractor, createWeb3ProviderEvmKeyStore, Session } from "@chromia/ft4";
import { Asset } from "@chromia/ft4";
import { createAssetObject } from "@chromia/ft4";
import urlJoin from "url-join";
import { getChrAssetQueryObject } from "./client_stubs/ticket_chain/ticket_chain.ts";

export const EvmContext = createContext<Buffer | undefined>(undefined);
export const DirectoryClientContext = createContext<IClient | undefined>(undefined);
export const TicketClientContext = createContext<IClient | undefined>(undefined);
export const AssetContext = createContext<Asset | undefined>(undefined);
export const ChromiaSessionContext = createContext<Session | undefined>(undefined);

// MetaMask integration
declare global {
  interface Window {
    ethereum: any
  }
}

const systemClusterNodes = JSON.parse(import.meta.env.VITE_SYSTEM_CLUSTER_NODES) as string[];
const authServerUrl = import.meta.env.VITE_AUTH_SERVER_FT4_URL;

export function ContextProvider({ children }: { children: ReactNode }) {
  const [evmAddress, setEvmAddress] = useState<Buffer | undefined>(undefined);
  const [directoryClient, setDirectoryClient] = useState<IClient | undefined>(undefined);
  const [ticketClient, setTicketClient] = useState<IClient | undefined>(undefined);
  const [asset, setAsset] = useState<Asset | undefined>(undefined);
  const [session, setSession] = useState<Session | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  useEffect(() => {
    const initSession = async () => {
      if (!window.ethereum) {
        throw new Error("Ethereum wallet not found. Please install MetaMask.");
      }

      console.log("Fetching EVM address...");
      const evmKeyStore = await createWeb3ProviderEvmKeyStore(window.ethereum);
      const evmAddress = evmKeyStore.address;
      console.log(`EVM address: ${formatter.toString(evmAddress)}`)
      setEvmAddress(evmAddress);

      console.log("Checking for enough stake...");
      if (!(await hasEnoughStake(evmAddress))) {
        throw new Error("Not enough stake. Please stake CHR first.");
      }

      console.log("Creating Chromia client...");
      const directoryClient = await createClient({
        nodeUrlPool: systemClusterNodes,
        blockchainIid: 0
      });
      setDirectoryClient(directoryClient);
      const ticketClient = await lookupTicketChainClient(directoryClient);
      setTicketClient(ticketClient);

      console.log("Fetching CHR asset...");
      const asset = createAssetObject(await ticketClient.query(getChrAssetQueryObject()));
      setAsset(asset);

      console.log("Fetching Chromia accounts...");
      const evmKeyStoreInteractor = createKeyStoreInteractor(ticketClient, evmKeyStore);
      const accounts = await evmKeyStoreInteractor.getAccounts();

      if (accounts.length > 0) {
        const account = accounts[0];
        console.log(`Chromia account found: ${formatter.toString(account.id)}`);
        setSession(await evmKeyStoreInteractor.getSession(account.id));
      } else {
        console.log("No Chromia account found");

        console.log("Fetching signing message...");
        const signingMessage = await fetchSigningMessage();

        console.log("Signing...");
        const rsv = await evmKeyStore.signMessage(signingMessage);
        const signature = `0x${formatter.toString(rsv.r)}${formatter.toString(rsv.s)}${rsv.v.toString(16)}`

        console.log("Creating Chromia account...");
        const error = await createChromiaAccount(signature);
        if (error) {
          throw new Error(`Unable to create Chromia account: ${error}`);
        }
        const account = (await evmKeyStoreInteractor.getAccounts())[0];
        console.log(`Chromia account created: ${formatter.toString(account.id)}`);
        setSession(await evmKeyStoreInteractor.getSession(account.id));
      }
      setLoading(false);
    };

    initSession().catch(err => {
      setErrorMessage(err.message);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading &&
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      }
      {errorMessage &&
        <div className="alert alert-danger alert-dismissible mt-2 overflow-x-auto" role="alert">
          <div>{errorMessage}</div>
          <button type="button" className="btn-close" onClick={() => setErrorMessage(undefined)}
                  aria-label="Close"></button>
        </div>
      }
      <EvmContext.Provider value={evmAddress}>
        <DirectoryClientContext.Provider value={directoryClient}>
          <TicketClientContext.Provider value={ticketClient}>
            <AssetContext.Provider value={asset}>
              {session &&
                <ChromiaSessionContext.Provider value={session}>
                  {children}
                </ChromiaSessionContext.Provider>
              }
            </AssetContext.Provider>
          </TicketClientContext.Provider>
        </DirectoryClientContext.Provider>
      </EvmContext.Provider>
    </>
  );
}

function lookupTicketChainClient(directoryClient: IClient): Promise<IClient> {
  return directoryClient.query(getTicketChainRidQueryObject())
    .then(ticketChainRid => {
      if (ticketChainRid == null) throw Error("Ticket chain not found");
      return createClient({
        nodeUrlPool: systemClusterNodes,
        blockchainRid: formatter.toString(ticketChainRid)
      });
    });
}

function hasEnoughStake(evmAddress: Buffer): Promise<boolean> {
  return fetch(urlJoin(authServerUrl, `/auth/stake/enough?address=${formatter.toString(evmAddress)}`), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((r) => {
    if (r.status === 200) {
      return r.json().then(body => {
        if (body.status === "SUCCESS") {
          return body.data.hasEnoughStake as boolean;
        } else {
          throw new Error(`GET /auth/stake/enough error ${JSON.stringify(body)}`);
        }
      })
    } else {
      throw new Error(`GET /auth/stake/enough error ${r.status}: ${r.statusText}`);
    }
  });
}

function fetchSigningMessage(): Promise<string> {
  return fetch(urlJoin(authServerUrl, "/auth/stake/signing-message"), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  }).then((r) => {
    if (r.status === 200) {
      return r.json().then(body => {
        if (body.status === "SUCCESS") {
          return body.data.message;
        } else {
          throw new Error(`GET /auth/stake/signing-message error ${JSON.stringify(body)}`);
        }
      })
    } else {
      throw new Error(`GET /auth/stake/signing-message error ${r.status}: ${r.statusText}`);
    }
  });
}

function createChromiaAccount(signature: string): Promise<string | undefined> {
  return fetch(urlJoin(authServerUrl, "/auth/stake/create"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      signature
    }),
  }).then((r) => {
    if (r.headers.get("Content-Type")?.startsWith("application/json")) {
      return r.json().then(body => {
        if (body.status === "SUCCESS") {
          return undefined;
        } else {
          return body.message;
        }
      })
    } else {
      throw new Error(`POST /auth/stake/create error ${r.status}: ${r.statusText}`);
    }
  });
}
