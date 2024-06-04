// pages/_app.tsx

import { AppProps } from "next/app";
import { ServiceContextProvider } from "../contexts/ServiceContextProvider";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ServiceContextProvider>
      <Component {...pageProps} />
    </ServiceContextProvider>
  );
}

export default MyApp;
