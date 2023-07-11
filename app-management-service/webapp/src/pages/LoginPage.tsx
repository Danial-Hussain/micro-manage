import Button from "../components/Button";
import Input from "../components/Input";
import Layout from "../components/Layout";

import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", username);
    data.append("password", password);

    const response = await fetch("/perform_login", {
      method: "POST",
      body: data,
    });

    console.log(response);
    console.log(response.redirected);
    console.log(response.headers.get("location"));
  };

  return (
    <Layout hideNav={true}>
      <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto">
        <div className="bg-white shadow-sm p-8 rounded-xl border w-full">
          <div className="text-3xl text-neutral-800 mb-4">{"Sign In"}</div>
          <div className="flex flex-col space-y-4">
            <Input
              label="Username"
              value={username}
              changeValue={(value) => setUsername(value)}
              placeHolder="Enter your username"
            />
            <Input
              label="Password"
              value={password}
              changeValue={(value) => setPassword(value)}
              placeHolder="Enter your password"
            />
            <Button label="Submit" onClick={handleSubmit} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
