import { XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import Button from "./Button";

interface MultiSelectProps {
  type?: string;
  label: string;
  values: string[];
  placeholder?: string;
  updateValues: (newValues: string[]) => void;
}

export default function MultiSelect({
  label,
  values,
  type = "text",
  updateValues,
  placeholder = "Enter value here",
}: MultiSelectProps) {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col my-4">
      <div className="text-sm text-neutral-500 text-left">{label}</div>
      <div className="flex flex-col w-full border border-neutral-200 focus-within:border-neutral-400">
        <div className="flex flex-row bg neutral-100 mt-1 w-full px-2 py-2 border-b border-neutral-200 transition duration-300">
          <input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => setValue(e.target.value)}
            className="w-full text-neutral-500 border-transparent focus:outline-none bg-transparent placeholder-neutral-400"
          />
          <Button
            size="small"
            label="Add"
            onClick={() => {
              if (value !== "") {
                updateValues([...values, value]);
                setValue("");
              }
            }}
          />
        </div>
        <div className="flex flex-row flex-wrap p-2 bg-neutral-100">
          {values.length === 0 && (
            <div className="text-neutral-400 text-sm">{"No Values Yet"}</div>
          )}
          {values.map((value, i) => (
            <button
              key={i}
              onClick={() => {
                updateValues([...values.slice(0, i), ...values.slice(i + 1)]);
              }}
              className="m-1 group flex flex-row items-center justify-center text-xs bg-neutral-800 px-2 py-1 text-white transition-all duration-300 ease-in-out hover:bg-opacity-90"
            >
              {value}
              <XMarkIcon className="stroke-2 w-3 h-3 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
