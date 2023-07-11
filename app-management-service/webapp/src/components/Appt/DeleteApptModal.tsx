import Button from "../Button";
import { apptApi } from "../../constants";
import { useState, Fragment } from "react";
import { Appointment } from "../../types/Appointment";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Transition, Dialog } from "@headlessui/react";

export default function DeleteApptModal({
  data,
  index,
  deleteFn,
}: {
  data: Appointment;
  index: number;
  deleteFn: (recordIdx: number, appointment: Appointment) => void;
}) {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const deleteAppointment = async (apppointment: Appointment) => {
    return await fetch(`${apptApi}/api/v1/appointment/${apppointment.id}`, {
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
                    {"Are you sure you want to delete this appointment?"}
                  </div>
                  <Button
                    label="Confirm Delete"
                    type="alert"
                    onClick={async () => {
                      let response: Response = await deleteAppointment(data);
                      if (response.status >= 200 && response.status < 300) {
                        deleteFn(index, data);
                        setIsOpen(false);
                      } else {
                        setError("Failed to delete appointment");
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
