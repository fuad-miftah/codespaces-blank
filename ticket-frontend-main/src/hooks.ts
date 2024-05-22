import { useCallback, useEffect, useState } from "react";
import { DictPair, QueryObject, RawGtv } from "postchain-client"
import { IClient } from "postchain-client";

export function useQuery<TReturn extends RawGtv, TArgs extends DictPair | undefined = DictPair>(client: IClient, query: QueryObject<TReturn, TArgs>) {
  const [serializedQuery, setSerializedQuery] = useState(JSON.stringify(query));
  const [data, setData] = useState<TReturn | undefined>();

  const sendQuery = useCallback(async () => {
    const data = await client.query(query);
    setSerializedQuery(JSON.stringify(query));
    setData(data);
  }, [client, query]);

  useEffect(() => {
    sendQuery().catch(console.error);
  }, [client, serializedQuery]);

  // Return query result and reload function
  return {
    result: data,
    reload: sendQuery
  };
}
