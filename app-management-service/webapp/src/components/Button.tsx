interface ButtonProps {
  label: any;
  onClick: any;
  variant?: "3d" | "normal";
  type?: "neutral" | "alert";
  size?: "small" | "medium";
}

export default function Button({
  label,
  onClick,
  variant = "normal",
  type = "neutral",
  size = "medium",
}: ButtonProps) {
  return (
    <div className="relative">
      {variant === "normal" ? (
        <button
          onClick={onClick}
          className={`bg-white font-medium border 
            ${size === "medium" ? "py-2 px-4" : "py-1 px-2 text-sm"}
            ${
              type === "neutral"
                ? "text-gray-800 border-gray-400 hover:bg-gray-100"
                : "text-red-800 border-red-400 hover:bg-red-50"
            } rounded shadow`}
        >
          {label}
        </button>
      ) : (
        <button
          onClick={onClick}
          className={`py-2 px-4 bg-blue-500 rounded-lg active:translate-y-1  active:[box-shadow:0_0px_0_0_#1b6ff8,0_0px_0_0_#1b70f841] active:border-b-[0px] transition-all duration-150 [box-shadow:0_4px_0_0_#1b6ff8,0_0px] border-b-[1px] border-blue-400`}
        >
          <span
            className={`flex flex-col justify-center items-center h-full text-white font-bold ${
              size === "medium" ? "text-sm" : "text-xs"
            }`}
          >
            {label}
          </span>
        </button>
      )}
    </div>
  );
}
