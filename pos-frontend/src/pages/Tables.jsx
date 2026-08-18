import React, { useState } from "react";
import BottomNav from "../components/shared/BottomNav";
import BackButton from "../components/shared/BackButton";
import TableCard from "../components/tables/TableCard";
import { tables } from "../constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTables } from "../https";
import { enqueueSnackbar } from "notistack";

const Tables = () => {
  const [status, setStatus] = useState("all");

  const { data: resData, isError } = useQuery({
    queryKey: ["tables"],
    queryFn: async () => {
      return await getTables();
    },
    placeholderData: keepPreviousData,
  });

  if(isError) {
    enqueueSnackbar("Something went wrong", { variant: "error" })
  }

  console.log(resData);

  const filteredTables =
    status === "all"
      ? tables
      : tables.filter(
          (table) => table.status.toLowerCase() === status.toLowerCase()
        );

  return (
    <section className="bg-[#1f1f1f] h-screen flex flex-col pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 md:px-8 lg:px-10 py-5">
        <div className="flex items-center gap-4">
          <BackButton />

          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
            Tables
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setStatus("all")}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              status === "all"
                ? "bg-[#383838] text-white"
                : "text-[#ababab] hover:bg-[#2d2d2d]"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setStatus("booked")}
            className={`px-5 py-2 rounded-lg transition font-medium ${
              status === "booked"
                ? "bg-[#383838] text-white"
                : "text-[#ababab] hover:bg-[#2d2d2d]"
            }`}
          >
            Booked
          </button>
        </div>
      </div>

      {/* Scrollable Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-5 md:px-8 lg:px-10 pb-6">
        <div
          className="
            grid
            gap-6
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
            2xl:grid-cols-5
          "
        >
          {resData?.data.data.map((table) => (
            <TableCard
              id={table._id}
              name={table.tableNo}
              status={table.status}
              initials={table?.currentOrder?.customerDetails.name}
              seats={table.seats}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </section>
  );
};

export default Tables;