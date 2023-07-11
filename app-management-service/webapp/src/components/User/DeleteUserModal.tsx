import type { User } from "../../types/User";
import { Fragment, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Transition, Dialog } from "@headlessui/react";
import Button from "../Button";
import { userApi } from "../../constants";

export default function DeleteUserModal({
  data,
  index,
  deleteFn,
}: {
  data: User;
  index: number;
  deleteFn: (recordIdx: number, user: User) => void;
}) {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const deleteUser = async (user: User) => {
    return await fetch(`${userApi}/api/v1/user/${user.id}`, {
      method: "DELETE",
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
        <TrashIcon className="w-5 h-5 stroke-red-800" />
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
                <Dialog.Panel className="w-full flex flex-col items-center max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-lg transition-all">
                  <div className="text-lg text-center mb-4">
                    {"Are you sure you want to delete this user?"}
                  </div>
                  <Button
                    label="Confirm Delete"
                    type="alert"
                    onClick={async () => {
                      let response: Response = await deleteUser(data);
                      if (response.status >= 200 && response.status < 300) {
                        deleteFn(index, data);
                        setIsOpen(false);
                      } else {
                        setError("Failed to delete user");
                        setTimeout(() => setError(""), 3000);
                      }
                    }}
                  />
                  <div className={`text-red-500 text-sm mt-1`}>{error}</div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
