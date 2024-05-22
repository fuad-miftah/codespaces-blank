import { ReactNode } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useQuery } from "./hooks.ts";
import { getBalanceQueryObject } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { LeaseData } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { getLeasesByAccountQueryObject } from "./client_stubs/ticket_chain/ticket_chain.ts";
import { ChromiaSessionContext } from "./ContextProvider.tsx";
import { TicketClientContext } from "./ContextProvider.tsx";

export const BalanceContext = createContext<bigint | undefined>(undefined);
export const LeasesContext = createContext<LeaseData[] | undefined>(undefined);
export const ReloadContext = createContext<(() => Promise<void>) | undefined>(undefined);

export default function Queries({ children }: { children: ReactNode }) {
  const ticketClient = useContext(TicketClientContext)!!;
  const session = useContext(ChromiaSessionContext)!!;

  const { result: balance, reload: reloadBalance } = useQuery(ticketClient, getBalanceQueryObject(session.account.id));
  const { result: leases, reload: reloadLeases } = useQuery(ticketClient, getLeasesByAccountQueryObject(session.account.id));

  function reload(): Promise<void> {
    return Promise.all([reloadBalance(), reloadLeases()]).then(undefined);
  }

  return (<>
    <BalanceContext.Provider value={balance}>
      <LeasesContext.Provider value={leases}>
        <ReloadContext.Provider value={reload}>
          {children}
        </ReloadContext.Provider>
      </LeasesContext.Provider>
    </BalanceContext.Provider>
  </>);
}
