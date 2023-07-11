import { formatDate } from "../utils";
import { apptApi } from "../constants";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { getColor } from "../types/Appointment";
import type { Appointment } from "../types/Appointment";

import DownloadModal from "../components/DownloadModal";
import CreateApptModal from "../components/Appt/CreateApptModal";
import UpdateApptModal from "../components/Appt/UpdateApptModal";
import DeleteApptModal from "../components/Appt/DeleteApptModal";
import Table, { createFn, deleteFn, updateFn } from "../components/Table";

export default function ApptPage() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const appointments = await getAppointments(0, 5, null, "", null);
        setAppointments(appointments);
      } catch (error) {
        console.log(`Request Failed: ${error}`);
      }
      setTimeout(() => setLoading(false), 1000);
    })();
  }, []);

  const getAppointments = async (
    page: number,
    size: number,
    sortBy: string | null,
    searchTerm: string,
    ascending: boolean | null
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      searchTerm: searchTerm,
    });
    sortBy && params.append("sortBy", sortBy);
    ascending !== null && params.append("asc", `${ascending}`);

    const response = await fetch(
      `${apptApi}/api/v1/appointment/list?${params.toString()}`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      }
    );

    return (await response.json()) as Appointment[];
  };

  return (
    <Layout>
      <div className="text-3xl text-neutral-800 mb-1">
        {"Appointment Management"}
      </div>
      <Table
        data={appointments}
        loading={loading}
        getId={(appt: Appointment) => appt.id}
        dataName="Appointment"
        sort={{ name: "Sort by Start Time" }}
        search={{ name: "Search Appointments" }}
        downloadModal={(data: Appointment[]) => (
          <DownloadModal
            columns={7}
            filename="appointments.csv"
            data={data.map((d) => ({
              "User Name": d.userName,
              "Appointment Name": d.apptName,
              "Appointment Type": d.apptType,
              Description: d.description,
              "Start Time": d.startTime.split("T").join(" ").slice(0, 16),
              "End Time": d.endTime.split("T").join(" ").slice(0, 16),
              Metadata: d.metadata,
            }))}
          />
        )}
        createModal={(createFn: createFn<Appointment>) => (
          <CreateApptModal createFn={createFn} />
        )}
        updateModal={(
          appointment: Appointment,
          index: number,
          updateFn: updateFn<Appointment>
        ) => (
          <UpdateApptModal
            data={appointment}
            index={index}
            updateFn={updateFn}
          />
        )}
        deleteModal={(
          appointment: Appointment,
          index: number,
          deleteFn: deleteFn<Appointment>
        ) => (
          <DeleteApptModal
            data={appointment}
            index={index}
            deleteFn={deleteFn}
          />
        )}
        updateDataFn={async (
          ascending: boolean | null,
          searchTerm: string,
          pageNumber: number,
          resultsPerPage: number,
          _,
          setData: (data: Appointment[]) => void
        ) => {
          setLoading(true);
          let newAppointments = await getAppointments(
            pageNumber,
            resultsPerPage,
            ascending !== null ? "startTime" : null,
            searchTerm,
            ascending
          );
          setData(newAppointments);
          setLoading(false);
        }}
        columns={[
          {
            name: "User Name",
            extractor: (appointment: Appointment) => appointment.userName,
          },
          {
            name: "Appointment Name",
            extractor: (appointment: Appointment) => appointment.apptName,
          },
          {
            name: "Appointment Type",
            extractor: (appointment: Appointment) => (
              <div
                className={`w-fit px-2 py-0.5 font-medium text-sm rounded-full mx-auto ${getColor(
                  appointment.apptType
                ).join(" ")}`}
              >
                {appointment.apptType}
              </div>
            ),
          },
          {
            name: "Start Time • Duration",
            extractor: (appointment: Appointment) =>
              formatDate(appointment.endTime, appointment.startTime),
          },
        ]}
        details={[
          {
            name: "Description",
            extractor: (appointment: Appointment) => appointment.description,
          },
          {
            name: "Metadata",
            extractor: (appointment: Appointment) => appointment.metadata,
          },
        ]}
      />
    </Layout>
  );
}
