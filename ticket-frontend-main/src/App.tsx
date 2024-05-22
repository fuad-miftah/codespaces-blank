import { ContextProvider } from "./ContextProvider.tsx";
import MyBalance from "./MyBalance.tsx";
import MyLeases from "./MyLeases.tsx";
import Queries from "./Queries.tsx";

export default function App() {
  return (
    <div className="container">
      <ContextProvider>
        <Queries>
          <MyBalance/>
          <MyLeases/>
        </Queries>
      </ContextProvider>
    </div>
  )
}
