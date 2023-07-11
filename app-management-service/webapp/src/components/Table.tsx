import Input from "./Input";
import Loader from "./Loader";

import { toast } from "sonner";
import { useState, useEffect } from "react";

import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";

type Search<T> = { name: string };
type Sort<T> = { name: string };

type Column<T> = {
  name: string;
  extractor: (data: T) => any;
};

export type getId<T> = (data: T) => string;
export type createFn<T> = (createdData: T) => void;
export type deleteFn<T> = (recordIdx: number, deletedData: T) => void;
export type updateFn<T> = (recordIdx: number, updatedData: T) => void;

export type updateDataFn<T> = (
  ascending: boolean | null,
  searchTerm: string,
  pageNumber: number,
  resultsPerPage: number,
  data: T[],
  setData: (data: T[]) => void
) => void;

export type downloadModal<T> = (data: T[]) => React.ReactElement;
export type createModal<T> = (createFn: createFn<T>) => React.ReactElement;

export type updateModal<T> = (
  data: T,
  index: number,
  updateFn: updateFn<T>
) => React.ReactElement;

export type deleteModal<T> = (
  data: T,
  index: number,
  deleteFn: deleteFn<T>
) => React.ReactElement;

interface TableProps<T> {
  data: T[];
  getId: getId<T>;
  loading?: boolean;
  dataName: string;
  sort?: Sort<T>;
  search?: Search<T>;
  columns: Column<T>[];
  details?: Column<T>[];
  deleteFn?: (data: T) => void;
  updateFn?: (data: T) => void;
  updateModal?: updateModal<T>;
  deleteModal?: deleteModal<T>;
  createModal?: createModal<T>;
  downloadModal?: downloadModal<T>;
  updateDataFn: updateDataFn<T>;
}

interface TableRowProps<T> {
  data: T;
  index: number;
  columns: Column<T>[];
  details?: Column<T>[];
  deleteFn: deleteFn<T>;
  updateFn: updateFn<T>;
  updateModal?: updateModal<T>;
  deleteModal?: deleteModal<T>;
}

function TableRow<T extends object>({
  data,
  index,
  columns,
  details,
  deleteFn,
  updateFn,
  updateModal,
  deleteModal,
}: TableRowProps<T>) {
  const [open, setOpen] = useState(false);
  const hasDetails = details !== undefined;
  const hasOptionsColumn = updateModal || deleteModal;

  return (
    <>
      <tr className="cursor-pointer border-b border-b-neutral-100">
        {columns.map((column, i) => (
          <td
            key={i}
            onClick={() => setOpen(!open)}
            className={`px-4 py-2 ${i === 0 ? "text-left" : "text-center"}`}
          >
            {i === 0 && hasDetails ? (
              <div className="flex items-center">
                <ChevronDownIcon
                  className={`w-3 h-3 mt-1 mr-2 stroke-neutral-500 stroke-2 transition-all ease-in-out duration-200 ${
                    open && "-rotate-180"
                  }`}
                />
                {column.extractor(data)}
              </div>
            ) : (
              column.extractor(data)
            )}
          </td>
        ))}
        {hasOptionsColumn && (
          <td className="px-2 py-2 mt-0.5 flex flex-row items-center justify-center">
            {updateFn && updateModal && updateModal(data, index, updateFn)}
            {deleteFn && deleteModal && deleteModal(data, index, deleteFn)}
          </td>
        )}
      </tr>
      {open && hasDetails && (
        <td
          className="bg-neutral-50"
          colSpan={columns.length + (hasOptionsColumn ? 1 : 0)}
        >
          {details?.map((detail, i) => (
            <div key={i} className="px-4 flex flex-col my-1.5">
              <div className="font-medium text-sm">{detail.name}</div>
              <div className="text-sm">{detail.extractor(data)}</div>
            </div>
          ))}
        </td>
      )}
    </>
  );
}

export default function Table<T extends object>({
  data,
  getId,
  dataName,
  sort,
  search,
  columns,
  details,
  updateModal,
  deleteModal,
  createModal,
  downloadModal,
  updateDataFn,
  loading = false,
}: TableProps<T>) {
  // Filters
  const [pageNumber, setPageNumber] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const [ascending, setAscending] = useState<null | boolean>(null);

  // Data
  const [tableData, setTableData] = useState<T[]>([...data]);
  const [filteredData, setFilteredData] = useState<T[]>(tableData);

  const hasOptionsColumn = updateModal || deleteModal;

  useEffect(() => {
    setTableData([...data]);
    updateData(ascending, "", resultsPerPage, 0);
  }, [data]);

  useEffect(() => {
    updateData(ascending, "", resultsPerPage, 0);
  }, [tableData]);

  const createRecord = async (newData: T) => {
    setTableData([...tableData, newData]);
    toast.success(`${dataName} Created`);
  };

  const deleteRecord = async (recordIdx: number, deletedData: T) => {
    let filteredDataRecord = filteredData[recordIdx];
    let tableDataRecordIdx = tableData.findIndex(
      (d) => getId(d) === getId(filteredDataRecord)
    );
    setTableData([
      ...tableData.slice(0, tableDataRecordIdx),
      ...tableData.slice(tableDataRecordIdx + 1),
    ]);
    toast.success(`${dataName} Deleted`);
  };

  const updateRecord = async (recordIdx: number, updatedData: T) => {
    let filteredDataRecord = filteredData[recordIdx];
    let tableDataRecordIdx = tableData.findIndex(
      (d) => getId(d) === getId(filteredDataRecord)
    );
    setTableData([
      ...tableData.slice(0, tableDataRecordIdx),
      updatedData,
      ...tableData.slice(tableDataRecordIdx + 1),
    ]);
    toast.success(`${dataName} Updated`);
  };

  const updateData = (
    ascending: boolean | null,
    searchTerm: string,
    resultsPerPage: number,
    pageNumber: number
  ) => {
    if (pageNumber >= 0) {
      setAscending(ascending);
      setSearchValue(searchTerm);
      setResultsPerPage(resultsPerPage);
      setPageNumber(pageNumber);

      updateDataFn(
        ascending,
        searchTerm,
        pageNumber,
        resultsPerPage,
        tableData,
        setFilteredData
      );
    }
  };

  return (
    <>
      <div className="flex flex-row items-end justify-between my-2">
        {search ? (
          <div className="flex flex-row items-end space-x-2 flex-1">
            <div className="flex-1 max-w-[350px]">
              <Input
                size="small"
                value={searchValue}
                placeHolder={search?.name}
                changeValue={(newValue) =>
                  updateData(ascending, newValue, resultsPerPage, 0)
                }
              />
            </div>
            {sort && (
              <div className="flex flex-col group">
                <div className="text-xs ml-1 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:mt-0">
                  {sort.name}
                </div>
                <div className="flex flex-row bg-neutral-50 rounded-xl divide-x border w-fit overflow-hidden">
                  <div
                    className={`${
                      ascending !== null && ascending && "bg-neutral-200"
                    } px-4 py-1.5 hover:bg-neutral-100 rounded-l-lg cursor-pointer transition duration-200 ease-in-out`}
                    onClick={() =>
                      updateData(
                        ascending !== null && ascending === true ? null : true,
                        searchValue,
                        resultsPerPage,
                        pageNumber
                      )
                    }
                  >
                    <BarsArrowUpIcon className="w-4 h-4 stroke-neutral-800 stroke-2" />
                  </div>
                  <div
                    className={`${
                      ascending !== null && !ascending && "bg-neutral-200"
                    } px-4 py-1.5 hover:bg-neutral-100 rounded-r-lg cursor-pointer transition duration-200 ease-in-out`}
                    onClick={() =>
                      updateData(
                        ascending !== null && ascending === false
                          ? null
                          : false,
                        searchValue,
                        resultsPerPage,
                        pageNumber
                      )
                    }
                  >
                    <BarsArrowDownIcon className="w-4 h-4 stroke-neutral-800 stroke-2" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1" />
        )}
        <div className="flex flex-row space-x-2 items-center">
          {createModal && createModal(createRecord)}
          {downloadModal && downloadModal(filteredData)}
        </div>
      </div>
      <table className="w-full border mt-3">
        <thead className="bg-neutral-100 border">
          <tr>
            {columns.map((column, i) => (
              <th
                key={i}
                className={`px-4 font-medium text-neutral-500 py-2 ${
                  i === 0 ? "text-left" : "text-center"
                }`}
              >
                {column.name}
              </th>
            ))}
            {(deleteModal || updateModal) && (
              <th className="px-4 font-medium text-neutral-500 py-2 text-center">
                {"Modify"}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 && (
            <tr className="border-b border-b-neutral-100 bg-neutral-50/10">
              <td colSpan={columns.length + (hasOptionsColumn ? 1 : 0)}>
                <div className="p-12 h-72 flex items-center justify-center">
                  {loading ? (
                    <Loader />
                  ) : (
                    <div className="text-xl text-center text-neutral-600">{`No ${dataName}s found`}</div>
                  )}
                </div>
              </td>
            </tr>
          )}
          {filteredData?.map((d, i) => (
            <TableRow
              key={getId(d)}
              data={d}
              index={i}
              columns={columns}
              details={details}
              deleteFn={deleteRecord}
              updateFn={updateRecord}
              updateModal={updateModal}
              deleteModal={deleteModal}
            />
          ))}
        </tbody>
      </table>
      <div className="flex flex-row items-end justify-between mt-2 mx-1">
        <div className="flex flex row items-center">
          <div className="text-sm mr-1">{"Results per page"}</div>
          <select
            value={resultsPerPage}
            onChange={(e) =>
              updateData(ascending, searchValue, parseInt(e.target.value), 0)
            }
            className="border border-neutral-400 bg-neutral-100"
          >
            <option value={2}>2</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="flex flex row items-center">
          <div className="text-sm mr-1">{"Page Number"}</div>
          <div className="flex flex-row items-center space-x-1">
            <div
              onClick={() =>
                updateData(
                  ascending,
                  searchValue,
                  resultsPerPage,
                  pageNumber - 1
                )
              }
              className="shrink-0 p-1.5 hover:bg-neutral-100 rounded-full transition-all duration-300 ease-in-out cursor-pointer"
            >
              <ChevronLeftIcon className="w-4 h-4 stroke-2 stroke-neutral-600" />
            </div>
            <div className="text-lg">{pageNumber}</div>
            {filteredData.length !== 0 && (
              <div
                onClick={() =>
                  updateData(
                    ascending,
                    searchValue,
                    resultsPerPage,
                    pageNumber + 1
                  )
                }
                className="shrink-0 p-1.5 hover:bg-neutral-100 rounded-full transition-all duration-300 ease-in-out cursor-pointer"
              >
                <ChevronRightIcon className="w-4 h-4 stroke-2 stroke-neutral-600" />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
