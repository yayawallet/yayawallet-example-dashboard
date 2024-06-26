import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import { TRANSACTION_INVOICE_URL } from '../../CONSTANTS';
import { Transaction } from '../../models';
import PageLoading from '../../components/ui/PageLoading';
import { useGetData, usePostData } from '../../hooks/useSWR';

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [copiedID, setCopiedID] = useState('');

  const { data: ownAccount } = useGetData('/user/profile');

  const { isLoading: isPendingTransactionData, data: transactionData } = useGetData(
    `/transaction/find-by-user?p=${currentPage}`
  );

  const { isLoading: isPendingSearch, data: searchResult } = usePostData(
    ['/transaction/search', searchQuery],
    {
      query: searchQuery,
    }
  );

  useEffect(() => {
    if (transactionData) {
      setTransactionList(transactionData.data);
      setIsPending(isPendingTransactionData);
      setPageCount(transactionData.lastPage);
    }
  }, [transactionData]);

  useEffect(() => {
    if (searchResult) {
      setTransactionList(searchResult.data);
      setIsPending(isPendingSearch);
    }
  }, [searchResult]);

  const copyTransactionID = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedID(id);

    setTimeout(() => setCopiedID(''), 1000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setIsPending(true);
  };

  const handleSearchTransaction = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="table-container">
      {transactionList.length <= 0 ? (
        <PageLoading />
      ) : (
        <>
          <div className="ml-8 mt-5">
            <SearchBar onSearch={(query) => handleSearchTransaction(query)} />
          </div>

          <div className="mt-2 mx-4 overflow-auto border border-slate-200 rounded-xl">
            <h3 className="px-5 py-4 font-medium">Transactions</h3>

            <table className="w-full">
              <thead>
                <tr className="text-gray-50 border">
                  <th className="text-left px-4 py-2 font-medium">ID</th>
                  <th className="text-left px-4 py-2 font-medium">Invoice</th>
                  <th className="text-left px-4 py-2 font-medium">Sender</th>
                  <th className="text-left px-4 py-2 font-medium">Amount</th>
                  <th className="text-left px-4 py-2 font-medium">Receiver</th>
                  <th className="text-left px-4 py-2 font-medium">Cause</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                </tr>
              </thead>

              <tbody>
                {transactionList.map((t) => (
                  <tr key={t?.id} className="hover:bg-gray-100 text-nowrap">
                    <td
                      title={t?.id}
                      className="relative border-b border-slate-200 p-3"
                      onClick={() => copyTransactionID(t?.id)}
                    >
                      {`${t?.id.slice(0, 4)}...${t?.id.slice(-2)}`}
                      <span
                        className={`${copiedID === t?.id ? '' : 'hidden'} absolute -top-2 left-4 w-40 text-center text-white bg-black opacity-70 text-sm px-3 py-1 rounded-lg`}
                      >
                        Transaction ID Copied
                      </span>
                    </td>
                    <td className="relative border-b border-slate-200 p-3">
                      <button
                        type="button"
                        className="pb-0.5 px-3 text-sm text-violet-900 focus:outline-none bg-white rounded-lg border border-violet-200 hover:bg-violet-100 hover:text-violet-700 focus:z-10 focus:ring-4 focus:ring-violet-100"
                      >
                        <a href={`${TRANSACTION_INVOICE_URL}/${t.id}`} target="_blank">
                          Print
                        </a>
                      </button>
                    </td>
                    <td className="border-b border-slate-200 p-3">
                      {t?.sender.name.split(' ').slice(0, 2).join(' ')}
                      <br />
                      <span className="text-gray-500 text-xs block" style={{ marginTop: '-3px' }}>
                        {'@' + t?.sender.account}
                      </span>
                    </td>
                    <td className="border-b border-slate-200 p-3">
                      {ownAccount === t?.receiver.account ? (
                        <span className="inline-block font-semibold text-green-600">
                          &#43;&nbsp;
                        </span>
                      ) : (
                        <span className="inline-block font-semibold text-red-600">
                          &#8722;&nbsp;
                        </span>
                      )}
                      {t?.amount_with_currency}
                    </td>
                    <td className="border-b border-slate-200 p-3">
                      {t?.receiver.name.split(' ').slice(0, 2).join(' ')}
                      <br />
                      <span className="text-gray-500 text-xs block" style={{ marginTop: '-3px' }}>
                        {'@' + t?.receiver.account}
                      </span>
                    </td>
                    <td className="border-b border-slate-200 p-3">
                      {`${t?.cause.slice(0, 16)}${t?.cause.charAt(17) ? '...' : ''}`}
                    </td>
                    <td className="border-b border-slate-200 p-3">
                      {`${new Date(Number(t?.created_at_time) * 1000).toLocaleString()}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <Pagination
              page={currentPage}
              pageCount={pageCount}
              isPending={isPending}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TransactionList;
