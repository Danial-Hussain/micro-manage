import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="mt-12 relative flex flex-col items-center justify-center h-full">
        <div className="text-6xl text-center max-w-2xl">
          {"User Appointment Management System"}
        </div>
        <p className="text-xl text-center mt-5 max-w-xl">
          The all-in-one management system for personal appointments. Get
          started by choosing an option below.
        </p>

        <img
          src="/arrow.png"
          className="absolute w-12 h-12 right-64 bottom-14 -rotate-[15deg] hidden lg:block"
        />
        <div className="flex flex-row space-x-4 mt-8">
          <Link to={"/users"}>
            <button className="px-3 py-2 bg-gradient-to-br from-blue-600 to-blue-500 border border-blue-600 text-lg text-white rounded-md transition-all duration-300 hover:brightness-110">
              {"Manage Users"}
            </button>
          </Link>
          <Link to={"/appointments"}>
            <button className="px-3 py-2 border border-blue-600 text-blue-600 text-lg rounded-md transition-all duration-300 hover:bg-blue-50">
              {"Manage Appts."}
            </button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
