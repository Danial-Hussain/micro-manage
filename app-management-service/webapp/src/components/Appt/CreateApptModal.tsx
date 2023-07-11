import Input from "../Input";
import Button from "../Button";
import Dropdown from "../Dropdown";
import { User } from "../../types/User";
import { userApi, apptApi } from "../../constants";
import { Fragment, useState, useEffect } from "react";
import { Transition, Dialog } from "@headlessui/react";
import {
  Appointment,
  AppointmentType,
  appointmentTypes,
} from "../../types/Appointment";

const defaultAppt: Appointment = {
  apptName: "",
  apptType: appointmentTypes[0],
  description: "",
  startTime: "",
  endTime: "",
  id: "",
  userId: "",
  metadata: "",
  userName: "",
};

export default function CreateApptModal({
  createFn,
}: {
  createFn: (newData: Appointment) => void;
}) {
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [appointment, setAppointment] = useState<Appointment>(defaultAppt);

  const getUsers = async () => {
    const response = await fetch(`${userApi}/api/v1/user/list`, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });
    return (await response.json()) as User[];
  };

  const createAppointment = async (appointment: Appointment) => {
    return await fetch(`${apptApi}/api/v1/appointment`, {
      method: "POST",
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
        setAppointment({
          ...appointment,
          userId: users[0].id,
          userName: `${users[0].firstName} ${users[0].lastName}`,
        });
      } catch (error) {
        console.log("Request Failed");
      }
    })();
  }, []);

  return (
    <>
      <Button
        size="small"
        variant="3d"
        label="Create Appointment"
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
                  <div className="font-medium text-lg">
                    {"Create an Appointment"}
                  </div>
                  <Dropdown
                    options={users}
                    value={users[0]}
                    label="Select a User"
                    changeValue={(newValue: User) =>
                      setAppointment((appointment) => ({
                        ...appointment,
                        userId: newValue ? newValue.id : appointment.userId,
                        userName: newValue
                          ? `${newValue.firstName} ${newValue.lastName}`
                          : appointment.userName,
                      }))
                    }
                    display={(user: User) =>
                      user ? `${user.firstName} ${user.lastName}` : ""
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
                    changeValue={(value: string) => {
                      setAppointment((appt) => ({
                        ...appt,
                        startTime: value + ":00.000",
                      }));
                    }}
                  />
                  <Input
                    label="End Time"
                    type="datetime-local"
                    value={appointment.endTime}
                    changeValue={(value: string) =>
                      setAppointment((appt) => ({
                        ...appt,
                        endTime: value + ":00.000",
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
                      label="Create Appointment"
                      onClick={async () => {
                        let response: Response = await createAppointment({
                          ...appointment,
                          startTime: appointment.startTime + "Z",
                          endTime: appointment.endTime + "Z",
                        });
                        if (response.status >= 20 && response.status < 300) {
                          const id =
                            response.headers
                              .get("Location")
                              ?.split("/api/v1/")[1] ?? "";

                          createFn({ ...appointment, id: id });
                          setIsOpen(false);
                          setAppointment({
                            ...defaultAppt,
                            userId: users[0].id,
                            userName: `${users[0].firstName} ${users[0].lastName}`,
                          });
                        } else {
                          setError("Failed to create appointment");
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
