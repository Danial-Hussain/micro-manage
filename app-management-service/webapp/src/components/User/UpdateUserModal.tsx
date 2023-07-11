import Input from "../Input";
import Button from "../Button";
import MultiSelect from "../MultiSelect";

import type { User } from "../../types/User";

import { useState, Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { userApi } from "../../constants";

export default function UpdateUserModal({
  data,
  index,
  updateFn,
}: {
  data: User;
  index: number;
  updateFn: (recordIdx: number, updatedData: User) => void;
}) {
  const [error, setError] = useState("");
  const [user, setUser] = useState(data);
  const [isOpen, setIsOpen] = useState(false);

  const updateUser = async (user: User) => {
    return await fetch(`${userApi}/api/v1/user/${user.id}`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-neutral-100"
      >
        <PencilSquareIcon className="w-5 h-5 stroke-neutral-800" />
      </button>
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
                  <div className="font-medium text-lg">
                    {"Update the User's Information"}
                  </div>
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
                    label="Phone Numbers"
                    values={user.phoneNumbers}
                    updateValues={(values: string[]) =>
                      setUser((user) => ({ ...user, phoneNumbers: values }))
                    }
                  />
                  <MultiSelect
                    label="Email Addresses"
                    values={user.emailAddresses}
                    updateValues={(values: string[]) =>
                      setUser((user) => ({ ...user, emailAddresses: values }))
                    }
                  />
                  <div className="w-full flex justify-center">
                    <Button
                      label="Update User"
                      onClick={async () => {
                        let response: Response = await updateUser(user);
                        if (response.status >= 200 && response.status < 300) {
                          updateFn(index, user);
                          setIsOpen(false);
                        } else {
                          setError("Failed to update user");
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
