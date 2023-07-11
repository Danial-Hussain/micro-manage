interface InputProps {
  value: any;
  type?: string;
  label?: string;
  placeHolder?: string;
  size?: "small" | "medium";
  changeValue: (newValue: any) => void;
}

export default function Input({
  label,
  value,
  changeValue,
  type = "text",
  size = "medium",
  placeHolder = "Enter Value",
}: InputProps) {
  return (
    <div className="flex flex-col">
      <div className="text-sm text-neutral-500 text-left">{label}</div>
      <div className="flex flex-col w-full">
        <div
          className={`bg neutral-100 mt-1 w-full rounded-md border border-neutral-200 transition duration-300 focus-within:border-neutral-400 ${
            size === "medium" ? "p-2" : "p-1 text-sm"
          }`}
        >
          <input
            type={type}
            value={value}
            placeholder={placeHolder}
            onChange={(e) => changeValue(e.target.value)}
            className="w-full text-neutral-500 border-transparent placeholder-neutral-300 focus:outline-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
