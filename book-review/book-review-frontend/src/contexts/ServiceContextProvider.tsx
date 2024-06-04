// contexts/ServiceContextProvider.tsx

"use client";

import { createClient, newSignatureProvider, encryption } from "postchain-client";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

type ServiceContextType = {
  client: any;
  privKey: Buffer;
  bookKeeperSignatureProvider: any;
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function useServiceContext() {
  return useContext(ServiceContext);
}

export function ServiceContextProvider({ children }: { children: ReactNode }) {
  const [contextValue, setContextValue] = useState<ServiceContextType | undefined>(undefined);

  useEffect(() => {
    const initClient = async () => {
      const privKey = Buffer.from("2BB56EA28F38FA9373693C00B7BC3C33AC74E89CAE7F662C8B125CEA765DA94E", "hex");
      const bookKeeperKeyPair = encryption.makeKeyPair(privKey);
      const bookKeeperSignatureProvider = newSignatureProvider(bookKeeperKeyPair);

      const client = await createClient({
        nodeUrlPool: "http://localhost:7740",
        blockchainRid: "CE292B232DB9DB6FF397C6A83905C5D198E42EC9D5028AB8317F17CBD571A810",
      });

      setContextValue({
        client,
        privKey,
        bookKeeperSignatureProvider,
      });
    };

    initClient().catch(console.error);
  }, []);

  return <ServiceContext.Provider value={contextValue}>{children}</ServiceContext.Provider>;
}
