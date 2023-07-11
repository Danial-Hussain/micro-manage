import Input from "../Input";
import Button from "../Button";
import Dropdown from "../Dropdown";
import { User } from "../../types/User";

import {
  Appointment,
  AppointmentType,
  appointmentTypes,
} from "../../types/Appointment";

import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { apptApi, userApi } from "../../constants";

export default function UpdateApptModal({
  data,
  index,
  updateFn,
}: {
  data: Appointment;
  index: number;
  updateFn: (recordIdx: number, updateData: Appointment) => void;
}) {
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState(data);
  const [users, setUsers] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const getUsers = async () => {
    const response = await fetch(`${userApi}/api/v1/user/list`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    return (await response.json()) as User[];
  };

  const updateAppointment = async (appointment: Appointment) => {
    return await fetch(`${apptApi}/api/v1/appointment/${appointment.id}`, {
      method: "PUT",
      body: JSON.stringify(appointment),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error) {
        console.log("Request Failed");
      }
    })();
  }, []);

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
                    {"Update the Appointment's Information"}
                  </div>
                  <Dropdown
                    options={users}
                    label="Select a User"
                    value={
                      users.find((user) => user.id === appointment.userId) ??
                      users[0]
                    }
                    display={(user: User) =>
                      user ? `${user.firstName} ${user.lastName}` : ""
                    }
                    changeValue={(newValue: User) =>
                      setAppointment((appointment) => ({
                        ...appointment,
                        userId: newValue ? newValue.id : appointment.userId,
                        userName: newValue
                          ? `${newValue.firstName} ${newValue.lastName}`
                          : appointment.userName,
                      }))
                    }
                    filter={(user: User, query: string) =>
                      user.firstName
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      user.lastName
                        .toLowerCase()
                        .includes(query.toLowerCase()) ||
                      `${user.firstName} ${user.lastName}`
                        .toLowerCase()
                        .includes(query.toLowerCase())
                    }
                  />
                  <Input
                    label="Appointment Name"
                    value={appointment.apptName}
                    changeValue={(value: string) =>
                      setAppointment((appt) => ({ ...appt, apptName: value }))
                    }
                  />
                  <Dropdown
                    options={appointmentTypes}
                    value={appointment.apptType}
                    label="Select an Appointment Type"
                    changeValue={(newValue: AppointmentType) =>
                      setAppointment((appointment) => ({
                        ...appointment,
                        apptType: newValue,
                      }))
                    }
                    display={(apptType: AppointmentType) => apptType}
                    filter={(apptType: AppointmentType, query: string) =>
                      apptType.toLowerCase().includes(query.toLowerCase())
                    }
                  />
                  <Input
                    label="Appointment Description"
                    value={appointment.description}
                    changeValue={(value: string) =>
                      setAppointment((appt) => ({
                        ...appt,
                        description: value,
                      }))
                    }
                  />
                  <Input
                    label="Start Time"
                    type="datetime-local"
                    value={appointment.startTime}
                    changeValue={(value: string) =>
                      setAppointment((appt) => ({
                        ...appt,
                        startTime: value,
                      }))
                    }
                  />
                  <Input
                    label="End Time"
                    type="datetime-local"
                    value={appointment.endTime}
                    changeValue={(value: string) =>
                      setAppointment((appt) => ({
                        ...appt,
                        endTime: value,
                      }))
                    }
                  />
                  <Input
                    type="text"
                    label="Metadata"
                    value={appointment.metadata}
                    changeValue={(value: string) =>
                      setAppointment((appt) => ({
                        ...appt,
                        metadata: value,
                      }))
                    }
                  />
                  <div className="w-full flex flex-col items-center justify-center">
                    <Button
                      label="Update Appointment"
                      onClick={async () => {
                        let response: Response = await updateAppointment({
                          ...appointment,
                          startTime: appointment.startTime + "Z",
                          endTime: appointment.endTime + "Z",
                        });
                        if (response.status >= 200 && response.status < 300) {
                          updateFn(index, appointment);
                          setIsOpen(false);
                        } else {
                          setError("Failed to update appointment");
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
