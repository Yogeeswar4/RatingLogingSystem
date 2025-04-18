import { useQuery } from "@tanstack/react-query";
import { fetcher } from "../utils/api";

interface Store {
  id: number;
  name: string;
  address: string;
}

export function useStores() {
  return useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: () => fetcher<Store[]>("/stores"),
  });
}
