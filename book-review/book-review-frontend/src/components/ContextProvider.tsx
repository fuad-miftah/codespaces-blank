"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { createClient, encryption, newSignatureProvider, IClient } from "postchain-client";

// Define a simple Session type
type Session = {
    accountId: string;
    // Add other properties that might be relevant to your session
};

// Create context for Chromia session
const ChromiaContext = createContext<Session | undefined>(undefined);

// Define hooks for accessing context
export function useSessionContext() {
    return useContext(ChromiaContext);
}

// Define a mock KeyStoreInteractor type
type KeyStoreInteractor = {
    getAccounts: () => Promise<{ id: string }[]>;
    getSession: (accountId: string) => Promise<Session>;
};

// Mock implementation of createKeyStoreInteractor
const createKeyStoreInteractor = (client: IClient, signatureProvider: any): KeyStoreInteractor => {
    return {
        getAccounts: async () => {
            // Mock implementation for getting accounts
            return [{ id: "mock_account_id" }];
        },
        getSession: async (accountId: string) => {
            // Mock implementation for getting session
            return { accountId };
        }
    };
};

export function ContextProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | undefined>(undefined);

    useEffect(() => {
        const initSession = async () => {
            console.log("Initializing Session");

            // 1. Initialize Client
            const client: IClient = await createClient({
                nodeUrlPool: ["http://localhost:7740"],
                blockchainRid: "CE292B232DB9DB6FF397C6A83905C5D198E42EC9D5028AB8317F17CBD571A810",
            });

            // 2. Manually pass user credentials (private key)
            const privKey = Buffer.from("2BB56EA28F38FA9373693C00B7BC3C33AC74E89CAE7F662C8B125CEA765DA94E", "hex");
            const keyPair = encryption.makeKeyPair(privKey);
            const signatureProvider = newSignatureProvider(keyPair);

            // 3. Initialize Key Store Interactor
            const keyStoreInteractor = createKeyStoreInteractor(client, signatureProvider);

            // 4. Get all accounts associated with the user key pair
            const accounts = await keyStoreInteractor.getAccounts();

            if (accounts.length > 0) {
                // 5. Start a new session
                const account = accounts[0];
                console.log(`Chromia account found: ${account.id}`);
                setSession({ accountId: account.id });
            } else {
                // 6. Create a new account
                console.log("Account not found, creating a new account");
                const accountName = "Alice"; // Replace with your logic to generate a unique account name
                await client.signAndSendUniqueTransaction(
                    {
                        name: "register_account",
                        args: [accountName],
                    },
                    signatureProvider
                );
                const account = (await keyStoreInteractor.getAccounts())[0];

                // 7. Get session connected to the session keypair
                setSession({ accountId: account.id });
            }

            console.log("Session initialized");
        };

        initSession().catch(console.error);
    }, []);

    return (
        <ChromiaContext.Provider value={session}>
            {children}
        </ChromiaContext.Provider>
    );
}
