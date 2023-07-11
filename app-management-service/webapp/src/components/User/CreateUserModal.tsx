import Input from "../Input";
import Button from "../Button";
import MultiSelect from "../MultiSelect";

import { userApi } from "../../constants";
import type { User } from "../../types/User";

import { useState, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";

const defaultUser: User = {
  firstName: "",
  lastName: "",
  gender: "",
  phoneNumbers: [],
  emailAddresses: [],
  id: "",
  age: 0,
};

export default function CreateUserModal({
  createFn,
}: {
  createFn: (newData: User) => void;
}) {
  const [user, setUser] = useState<User>(defaultUser);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const createUser = async (user: User) => {
    return await fetch(`${userApi}/api/v1/user`, {
      method: "POST",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
  };

  return (
    <>
      <Button
        size="small"
        variant="3d"
        label="Create User"
        onClick={() => setIsOpen(true)}
      />

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
                <Dialog.Panel className="flex flex-col space-y-4 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-lg transition-all">
                  <div className="font-medium text-lg">{"Create a User"}</div>
                  <Input
                    label="First Name"
                    value={user.firstName}
                    changeValue={(value: string) =>
                      setUser((user) => ({ ...user, firstName: value }))
                    }
                  />
                  <Input
                    label="Last Name"
                    value={user.lastName}
                    changeValue={(value: string) =>
                      setUser((user) => ({ ...user, lastName: value }))
                    }
                  />
                  <Input
                    label="Age"
                    type="number"
                    value={user.age}
                    changeValue={(value: string) =>
                      setUser((user) => ({ ...user, age: parseInt(value) }))
                    }
                  />
                  <Input
                    label="Gender"
                    value={user.gender}
                    changeValue={(value: string) =>
                      setUser((user) => ({ ...user, gender: value }))
                    }
                  />
                  <MultiSelect
                    type="tel"
                    label="Phone Numbers"
                    values={user.phoneNumbers}
                    updateValues={(values: string[]) =>
                      setUser((user) => ({ ...user, phoneNumbers: values }))
                    }
                  />
                  <MultiSelect
                    type="email"
                    label="Email Addresses"
                    values={user.emailAddresses}
                    updateValues={(values: string[]) =>
                      setUser((user) => ({ ...user, emailAddresses: values }))
                    }
                  />
                  <div className="w-full flex flex-col items-center justify-center">
                    <Button
                      label="Create User"
                      onClick={async () => {
                        let response: Response = await createUser(user);
                        if (response.status >= 200 && response.status < 300) {
                          const id =
                            response.headers
                              .get("Location")
                              ?.split("/api/v1/")[1] ?? "";

                          createFn({ ...user, id: id });
                          setIsOpen(false);
                          setUser(defaultUser);
                        } else {
                          setError("Failed to create user");
                          setTimeout(() => setError(""), 3000);
                        }
                      }}
                    />
                    <div className={`text-red-500 text-sm mt-1`}>{error}</div>
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
