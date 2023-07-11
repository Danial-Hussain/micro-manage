import Button from "./Button";
import { toast } from "sonner";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";

import { useState, Fragment, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";

type Mapper = { [key: number]: boolean };

export default function DownloadModal<T extends Object>({
  data,
  columns,
  filename,
}: {
  data: T[];
  columns: number;
  filename: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [updatedData, setUpdatedData] = useState(data);
  const [includeRows, setIncludeRows] = useState<Mapper>({});
  const [includeCols, setIncludeCols] = useState<Mapper>({});

  useEffect(() => {
    if (data.length !== 0) {
      setIncludeRows(
        Array.from(Array(data.length).keys()).reduce(
          (o, key) => ({ ...o, [key]: true }),
          {}
        )
      );
      setIncludeCols(
        Array.from(Array(Object.keys(data[0]).length).keys()).reduce(
          (o, key) => ({ ...o, [key]: true }),
          {}
        )
      );
    }
    setUpdatedData(data);
  }, [data]);

  const downloadData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent +=
      Object.keys(updatedData[0])
        .filter((_, i) => includeCols[i])
        .join(",") + "\r\n";

    updatedData.forEach((d, row) => {
      if (includeRows[row]) {
        let rowData: string[] = [];
        Object.values(d).forEach((value, col) => {
          if (includeCols[col]) {
            rowData.push(value);
          }
        });
        if (rowData.length !== 0) {
          csvContent += rowData.join(",") + "\r\n";
        }
      }
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsOpen(false);
    toast.success(`Data Downloaded`);
  };

  return (
    <>
      <div className="relative flex items-center justify-center group">
        <div className="absolute -top-6 text-xs w-24 text-center bg-gradient-to-r from-blue-600 to-blue-900 border-b border-b-blue-200 border-t border-t-blue-300 text-white py-1 rounded-full opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:-top-8">
          {"Download Data"}
        </div>
        <Button
          size="small"
          variant="3d"
          label={
            <ArrowDownOnSquareIcon className="w-4 h-4 stroke-white stroke-2" />
          }
          onClick={() => setIsOpen(true)}
        />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex flex-col space-y-4 w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-lg transition-all">
                  <div className="font-medium text-lg">
                    {"Download Your Data"}
                  </div>

                  {updatedData.length !== 0 && (
                    <div>
                      <div className="flex item-center flex-row space-x-2 pb-3">
                        <Button
                          variant="normal"
                          size="small"
                          label={"Select All Rows"}
                          onClick={() =>
                            setIncludeRows(
                              Array.from(
                                Array(updatedData.length).keys()
                              ).reduce((o, key) => ({ ...o, [key]: true }), {})
                            )
                          }
                        />
                        <Button
                          variant="normal"
                          size="small"
                          label={"Deselect All Rows"}
                          onClick={() =>
                            setIncludeRows(
                              Array.from(
                                Array(updatedData.length).keys()
                              ).reduce((o, key) => ({ ...o, [key]: false }), {})
                            )
                          }
                        />
                      </div>

                      <div className="overflow-x-scroll overflow-y-auto max-h-72 pb-4">
                        <div
                          className={`border w-max`}
                          style={{
                            display: "grid",
                            gridTemplateColumns: `repeat(${
                              columns + 1
                            }, minmax(0, 1fr))`,
                          }}
                        >
                          {Array.from(Array(columns + 1).keys()).map((col) => (
                            <div
                              key={col}
                              className="bg-neutral-100 border w-full p-1 flex items-center justify-center h-full"
                            >
                              {col !== 0 && (
                                <input
                                  type="checkbox"
                                  className="accent-blue-600 w-4 h-4"
                                  checked={includeCols[col - 1]}
                                  onChange={() => {
                                    let includeColsCopy = { ...includeCols };
                                    includeColsCopy[col - 1] =
                                      !includeColsCopy[col - 1];
                                    setIncludeCols(includeColsCopy);
                                  }}
                                />
                              )}
                            </div>
                          ))}

                          {Object.keys({ "": "", ...updatedData[0] }).map(
                            (key, col) => (
                              <div
                                key={col}
                                className="bg-neutral-100 border w-full p-1 flex items-center justify-center h-full"
                              >
                                {col !== 0 && (
                                  <div
                                    key={key}
                                    className="text-sm bg-neutral-100 text-center py-1 font-medium text-neutral-700"
                                  >
                                    {key}
                                  </div>
                                )}
                              </div>
                            )
                          )}

                          {updatedData.map((record, row) => (
                            <>
                              <div
                                key={row}
                                className={
                                  "flex items-center justify-center w-full border"
                                }
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600 w-4 h-4"
                                  checked={includeRows[row]}
                                  onChange={(e) => {
                                    let includeRowsCopy = { ...includeRows };
                                    includeRowsCopy[row] =
                                      !includeRowsCopy[row];
                                    setIncludeRows(includeRowsCopy);
                                  }}
                                />
                              </div>

                              {Object.values(record).map((value, col) => (
                                <div
                                  key={col}
                                  className={`text-center text-sm p-1 border ${
                                    (!includeCols[col] || !includeRows[row]) &&
                                    "opacity-10"
                                  }`}
                                >
                                  {value}
                                </div>
                              ))}
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="w-full flex flex-col items-center justify-center">
                    <Button label="Download" onClick={downloadData} />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
