import { Link, useLocation } from "react-router-dom";
import {
  CalendarDaysIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Navigation() {
  const location = useLocation();

  return (
    <div className="px-4 flex flex-row items-center justify-between border-b border-neutral-100 bg-neutral-50">
      <div className="flex flex-row items-center justify-between w-full max-w-6xl mx-auto">
        <Link to={"/"}>
          <div className="flex-row items-center w-32 hidden md:flex">
            <CalendarDaysIcon className="w-5 h-5 stroke-neutral-800 mr-1" />
            <div className="font-semibold text-neutral-800">
              {"ApptManager"}
            </div>
          </div>
        </Link>
        <div className="w-full flex flex-row items-center justify-center">
          <Link to={"/"}>
            <div
              className={`w-28 text-center -mb-0.5 ${
                location.pathname === "/"
                  ? "text-stone-800 border-b-2 border-blue-500 p-3"
                  : "text-stone-600"
              }`}
            >
              {"Home Page"}
            </div>
          </Link>
          <Link to={"/users"}>
            <div
              className={`w-28 text-center -mb-0.5 ${
                location.pathname === "/users"
                  ? "text-stone-800 border-b-2 border-blue-500 p-3"
                  : "text-stone-600"
              }`}
            >
              {"User Page"}
            </div>
          </Link>
          <Link to={"/appointments"}>
            <div
              className={`w-28 text-center -mb-0.5 ${
                location.pathname === "/appointments"
                  ? "text-stone-800 border-b-2 border-blue-500 p-3"
                  : "text-stone-600"
              }`}
            >
              {"Appt Page"}
            </div>
          </Link>
        </div>
        <div className="w-32 justify-end hidden md:flex">
          <a
            href={"/logout"}
            className="shrink-0 text-center px-2 py-1 bg-black text-sm text-white font-medium rounded-full border border-black hover:bg-white hover:text-black transition-all duration-300 ease-in-out"
          >
            <ArrowLeftOnRectangleIcon className="inline w-4 h-4 mb-0.5 mr-1" />
            {"Sign Out"}
          </a>
        </div>
      </div>
    </div>
  );
}
