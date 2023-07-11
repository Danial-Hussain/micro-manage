import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface DropdownProps<T> {
  value: T;
  options: T[];
  label?: string;
  display: (value: T) => string;
  changeValue: (value: T) => void;
  filter: (value: T, query: string) => boolean;
}

export default function Dropdown<T>({
  value,
  label,
  options,
  display,
  filter,
  changeValue,
}: DropdownProps<T>) {
  const [selected, setSelected] = useState<T>(value);
  const [query, setQuery] = useState("");

  const filteredValues =
    query === "" ? options : options.filter((option) => filter(option, query));

  return (
    <div className="flex flex-col">
      <div className="text-sm text-neutral-500 text-left">{label}</div>
      <Combobox
        nullable
        value={selected}
        onChange={(newValue: T) => {
          setSelected(newValue);
          newValue !== null && changeValue(newValue);
        }}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-md bg-neutral-100 border border-neutral-200 text-left transition duration-300 ease-in-out focus-within:border-neutral-400">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 leading-5 text-neutral-500 focus:ring-none focus:outline-0"
              displayValue={(value: T) => display(value)}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leaveTo="opacity-0"
            leaveFrom="opacity-100"
            afterLeave={() => setQuery("")}
            leave="transition ease-in duration-100"
          >
            <Combobox.Options className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredValues.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                filteredValues.map((value) => (
                  <Combobox.Option
                    value={value}
                    key={JSON.stringify(value)}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-blue-600 text-white" : "text-gray-900"
                      }`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {display(value)}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-blue-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
