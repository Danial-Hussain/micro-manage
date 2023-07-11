import { userApi } from "../constants";
import type { User } from "../types/User";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import Table, { createFn, deleteFn, updateFn } from "../components/Table";

import DownloadModal from "../components/DownloadModal";
import DeleteUserModal from "../components/User/DeleteUserModal";
import CreateUserModal from "../components/User/CreateUserModal";
import UpdateUserModal from "../components/User/UpdateUserModal";

export default function UserPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        console.log(`Request Failed: ${error}`);
      }
      setTimeout(() => setLoading(false), 1000);
    })();
  }, []);

  const getUsers = async () => {
    const response = await fetch(`${userApi}/api/v1/user/list`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    return (await response.json()) as User[];
  };

  return (
    <Layout>
      <div className="text-3xl text-neutral-800 mb-1">{"User Management"}</div>
      <Table
        data={users}
        loading={loading}
        dataName="User"
        getId={(user: User) => user.id}
        createModal={(createFn: createFn<User>) => (
          <CreateUserModal createFn={createFn} />
        )}
        updateModal={(user: User, index: number, updateFn: updateFn<User>) => (
          <UpdateUserModal data={user} index={index} updateFn={updateFn} />
        )}
        deleteModal={(user: User, index: number, deleteFn: deleteFn<User>) => (
          <DeleteUserModal data={user} index={index} deleteFn={deleteFn} />
        )}
        downloadModal={(data: User[]) => (
          <DownloadModal
            columns={6}
            filename="users.csv"
            data={data.map((d) => ({
              "First Name": d.firstName,
              "Last Name": d.lastName,
              Age: d.age,
              Gender: d.gender,
              "Email Addresses": d.emailAddresses.join(","),
              "Phone Numbers": d.phoneNumbers.join(","),
            }))}
          />
        )}
        updateDataFn={(
          ascending: boolean | null,
          searchTerm: string,
          pageNumber: number,
          resultsPerPage: number,
          users: User[],
          setData: (data: User[]) => void
        ) => {
          setData(
            users
              .filter(
                (user) =>
                  user.firstName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  user.lastName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  `${user.firstName} ${user.lastName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )
              .slice(
                resultsPerPage * pageNumber,
                resultsPerPage * pageNumber + resultsPerPage
              )
          );
        }}
        search={{ name: "Search by Name" }}
        columns={[
          {
            name: "Name",
            extractor: (user: User) => `${user.firstName} ${user.lastName}`,
          },
          {
            name: "Age",
            extractor: (user: User) => user.age,
          },
          {
            name: "Gender",
            extractor: (user: User) => user.gender,
          },
        ]}
        details={[
          {
            name: "Phone Numbers",
            extractor: (user: User) => user.phoneNumbers.join(", "),
          },
          {
            name: "Email Addresses",
            extractor: (user: User) => user.emailAddresses.join(", "),
          },
        ]}
      />
    </Layout>
  );
}
