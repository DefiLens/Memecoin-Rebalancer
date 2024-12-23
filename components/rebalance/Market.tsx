import React, { useMemo, useState } from "react";
import { MemeCoinGridProps } from "./types";
import { useGlobalStore } from "../../context/global.store";
import Loader from "../shared/Loader";
import TokenList from "../Token/TokenList";
import TokenGrid from "../Token/TokenGrid";
import { SortKey, SortOrder } from "./Sell";
import TabBar from "../shared/TabBar";
import { DataState } from "../../context/dataProvider";
import ViewToggle from "../shared/ViewToggle";
import { SearchInput } from "../shared/Search";
import OneTokenSkeleton from "../skeleton/OneTokenSkeleton";
import OneGridTokenSkeleton from "../skeleton/OneGridTokenSkeleton";

const Market: React.FC<MemeCoinGridProps> = () => {
  const { allCoins } = useGlobalStore();
  const [searchTerm, setSearchTerm] = useState("");
  const { viewMode } = DataState();
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey;
    order: SortOrder;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const currentTokens = useMemo(() => {
    setIsLoading(true);
    // First, filter the tokens based on the search term
    let result = allCoins.filter(
      (token: any) =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then, sort the filtered tokens if a sort configuration is set
    if (sortConfig !== null) {
      result.sort((a: any, b: any) => {
        const key = sortConfig.key;
        const order = sortConfig.order;
        if (a[key] < b[key]) {
          return order === "asc" ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return order === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    setIsLoading(false);

    return result;
  }, [allCoins, searchTerm, sortConfig]);

  // Paginate the sorted tokens
  const requestSort = (key: SortKey) => {
    let order: SortOrder = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.order === "asc") {
      order = "desc";
    }
    setSortConfig({ key, order });
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="bg-zinc-950 px-4 flex flex-col-reverse sm:flex-row sm:justify-between sm:items-end h-fit sm:h-14 border-y border-zinc-800">
        <div className="h-full flex items-center text-lg font-semibold">Market</div>
        <div className="flex items-center justify-end p-2 gap-3">
          <SearchInput value={searchTerm} onChange={setSearchTerm} />
          <ViewToggle />
        </div>
      </div>
      <main className="flex-grow overflow-hidden relative">
        <div className={`h-full overflow-auto`}>
          {isLoading && (
            <div className="w-full flex items-center justify-center h-full">
              {viewMode === "list" ? <OneTokenSkeleton /> : <OneGridTokenSkeleton />}
            </div>
          )}
          {error && <p className="text-center text-red-500">{error}</p>}

          {!isLoading && !error && (
            <>
              {viewMode === "list" ? (
                <TokenList tokens={currentTokens} sortConfig={sortConfig} requestSort={requestSort} action="buy" />
              ) : (
                <TokenGrid tokens={currentTokens} sortConfig={sortConfig} requestSort={requestSort} action="buy" />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Market;
