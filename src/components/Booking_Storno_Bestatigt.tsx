import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { useBookingDelete, useBookingGetUser } from "../hooks/useBooking";
import { fixDeskRequestGetById } from "../hooks/useFixdestRequests";
import { useFixdeskRequestDelete } from "../hooks/useFixdestRequests";
import React from "react";
type Detail = {
  bookedAt: string;
  dateStart: string;
  dateEnd: string;
  desk: {
    label: string;
    type: string;
    equipment: string[];
  };
  user: {
    department: string;
    firstname: string;
    lastname: string;
  };
  id: string;
};

export default function Booking_Storno_Bestatigt() {
  // State to store User ID
  const [userData, setUserData] = useState<Detail[]>([]);
  const [userFixDeskData, setUserFixdeskData] = useState([]);

  const { mutate: bookingDelete } = useBookingDelete();
  const { mutate: fixdeskDelete } = useFixdeskRequestDelete();

  const handleClick = async (id: string) => {
    try {
      bookingDelete(id, {
        onSuccess: async () => {
          const updateData = await useBookingGetUser();
          setUserData(updateData);
        },
      });
    } catch (error) {}
  };

  const handleClickFixDeskDelete = async (id: string) => {
    try {
      await fixdeskDelete(id);
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await useBookingGetUser();
        const response2 = await fixDeskRequestGetById();
        if (response === undefined) {
          return false;
        } else {
          setUserData(response);
        }
        setUserFixdeskData(response2);
      } catch (error) {}
    };

    // Call the fetchData function
    fetchData();
  }, []);

  return (
    <>
      <Navbar />{" "}
      <div className="md:bg-slate-100  flex-row justify-start  flex-wrap xl:max-w-[70%] xl:min-w-[1200px] lg:w-[90%] md:w-[90%] mx-auto min-h-[90vh]  rounded-3xl   max-[639px]:rounded-none max-[639px]:mt-[-50px] sm:rounded-none md:rounded-3xl sm:mt-[-36px] max-[639px]:h-[100%]  sm:bg-slate-100  md:h-auto sm:h-auto sm:top-6 md:top-20 relative max-[639px]:top-36">
        {/* title */}
        <div className="w-[90%] mx-auto  h-20  sm:mt-16 md:mt-9 lg:mt-16 max-[639px]:pt-6 md:pt-6 sm:pt-8 ">
          <div className=" w-full text-center">
            <h2 className="lg:text-5xl md:text-3xl sm:text-2xl font-normal uppercase  max-[359px]:text-lg underline">
              Reservierung bestatigung
            </h2>
          </div>
        </div>
        <div className="flex mx-auto    gap-5 flex-wrap xl:w-[95%] lg:w-[95%] my-10  md:mb-0 sm:mb-44 ">
          {userData &&
            // Check if userData is not null or undefined
            userData.map((info) => {
              const { dateStart, dateEnd, desk, id } = info;
              const dateObject = new Date(dateStart);
              const dateObjectEnd = new Date(dateEnd);
              // Extracting year, month, and day - START
              const yearStart = dateObject.getFullYear().toString().slice(-2);
              // Get the last two digits of the yearStart
              const monthStart: string = (
                "0" +
                (dateObject.getMonth() + 1)
              ).slice(-2);
              // Months are zero-indexed
              const dayStart: string = ("0" + dateObject.getDate()).slice(-2);

              // Months are zero-indexed
              const dayEnd: string = ("0" + dateObjectEnd.getDate()).slice(-2);
              // Extracting year, month, and day - END
              const yearEnd: string = dateObjectEnd
                .getFullYear()
                .toString()
                .slice(-2); // Get the last two digits of the yearStart

              const monthEnd: string = (
                "0" +
                (dateObjectEnd.getMonth() + 1)
              ).slice(-2);

              return (
                <div
                  key={id}
                  className=" md:w-full md:flex  md:flex-wrap md:items-start my-5  lg:w-full sm:justify-between sm:h-auto  sm:w-full max-[639px]:w-full max-[639px]:mb-36"
                >
                  <div className="table_desk xl:w-80 lg:w-[30%] md:w-[30%] md:h-64 sm:w-full sm:h-36 max-[639px]:h-36  ">
                    <div className="w-full h-1/2 bg-gray-300 flex justify-center items-center text-2xl font-bold uppercase max-[639px]:text-lg">
                      <h1>{desk.label}</h1>
                    </div>

                    <div className="w-full h-1/2 bg-green-300 flex justify-center items-center text-2xl font-bold uppercase max-[639px]:text-lg">
                      <h1>{desk.type}</h1>
                    </div>
                  </div>
                  <div className="equipment_table md:flex-row md:h-full md:flex-wrap  md:w-[70%] sm:w-full sm:h-full  max-[639px]:h-full">
                    <div className="equipment w-auto ml-5  h-[78%] flex flex-wrap  items-start">
                      <h1 className="flex justify-between w-full text-2xl font-normal">
                        Equipment
                      </h1>
                      <ul className="list-disc capitalize w-full mt-[-36px]">
                        {desk.equipment.map((item, index) => {
                          return (
                            <li key={index} className="ml-5 text-xl">
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="infoTimeSection md:flex md:flex-nowrap md:justify-evenly md:w-auto md:ml-2  items-center sm:w-full sm:m-0 sm:flex sm:flex-wrap max-[639px]:w-full max-[639px]:flex max-[639px]:flex-wrap max-[639px]:m-0  max-[359px]:m-0">
                      <div className="w-1/3 text-sm sm:w-1/2 max-[639px]:w-1/2  ">
                        <h1 className="max-[639px]:ml-3 sm:ml-2">
                          Reservieren von:{" "}
                          <span className="font-bold">
                            <em>
                              {dayStart}/{monthStart}/{yearStart}
                            </em>
                          </span>
                        </h1>
                      </div>
                      <div className="w-[35%] text-sm flex sm:w-1/2 max-[639px]:w-1/2">
                        <h1>
                          Reservieren bis:{" "}
                          <span className="font-bold">
                            <em>
                              {" "}
                              {dayEnd}/{monthEnd}/{yearEnd}
                            </em>{" "}
                          </span>
                        </h1>
                      </div>
                      <div className="deleteBtn lg:w-96 md:w-64 bg-black text-center py-2 sm:w-full max-[639px]:w-full">
                        <button
                          className=" font-bold text-white"
                          onClick={() => handleClick(id)}
                        >
                          Stornierung
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-400 w-full h-1 mt-5"></div>
                </div>
              );
            })}
        </div>
        {/* USER FIX */}
        <div className="flex mx-auto   gap-5 flex-wrap xl:w-[95%] lg:w-[95%] my-10 sm:bg-slate-100  ">
          {userFixDeskData &&
            // Check if userData is not null or undefined
            userFixDeskData.map((info: string | object | any) => {
              const { desk, id, status, user } = info;
              const dateObject = new Date(user.updatedAt);

              const dayStart: string = ("0" + dateObject.getDate()).slice(-2);
              const yearStart = dateObject.getFullYear().toString().slice(-2);
              const monthStart: string = (
                "0" +
                (dateObject.getMonth() + 1)
              ).slice(-2);

              const formDate: () => string = () => {
                const dateObject = new Date(user.updatedAt);
                const day: string = ("0" + dateObject.getDate()).slice(-2);

                const year: number = dateObject.getFullYear();
                const newDateObject: string | number | Date = new Date(
                  dateObject
                );
                newDateObject.setMonth(dateObject.getMonth() + 3);
                const newMonth = ("0" + (newDateObject.getMonth() + 1)).slice(
                  -2
                );
                // Returning the formatted date as a string
                return `${day}/${newMonth}/${year}`;
              };
              return (
                <div
                  key={id}
                  className="md:w-full md:flex md:flex-wrap md:items-start lg:w-full sm:justify-between sm:h-auto md:bg-slate-100 sm:bg-slate-100 my-5"
                >
                  <div className="table_desk xl:w-80 lg:w-[30%] md:w-[30%] md:h-64 sm:w-full sm:h-36 max-[639px]:h-36">
                    <div className="h-1/2 flex items-center justify-center w-full text-2xl font-bold text-white uppercase bg-gray-500">
                      <h1>{desk.label}</h1>
                    </div>

                    <div className="h-1/2 flex items-center justify-center w-full text-2xl font-bold uppercase bg-red-300">
                      <h1>Desk Fix</h1>
                    </div>
                  </div>
                  <div className="equipment_table md:flex-row md:h-full md:flex-wrap  md:w-[70%] sm:w-full sm:h-full  max-[639px]:h-full sm:bg-slate-100">
                    <div className="equipment w-auto ml-5  h-[78%] flex flex-wrap  items-start">
                      <div className="flex justify-between w-full text-2xl font-normal">
                        <h1>Equipment</h1>
                        {status === "notreviewed" && (
                          <h1 className="px-2 text-lg uppercase bg-orange-400">
                            {status}
                          </h1>
                        )}{" "}
                        {status === "approved" && (
                          <h1 className="px-2 text-lg uppercase bg-green-400">
                            {status}
                          </h1>
                        )}
                        {status === "rejected" && (
                          <h1 className="px-2 text-lg uppercase bg-red-400">
                            {status}
                          </h1>
                        )}
                      </div>
                      <ul className="list-disc capitalize w-full mt-[-36px]">
                        {desk.equipment.map((item: string, index: number) => {
                          return (
                            <li className="ml-5 text-xl" key={index}>
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                      <h1 className="md:text-sm sm:text-xs ml-5 text-sm">
                        Sie erhalten eine separate Bestätigung auf Ihre Office
                        Email Adresse.
                      </h1>
                    </div>{" "}
                    <div className="infoTimeSection md:flex md:flex-nowrap md:justify-evenly md:w-auto md:ml-2  items-center sm:w-full sm:m-0 sm:flex sm:flex-wrap max-[639px]:w-full max-[639px]:flex max-[639px]:flex-wrap max-[639px]:m-0  max-[359px]:m-0">
                      <div className="w-1/3 text-sm sm:w-1/2 max-[639px]:w-1/2  ">
                        <h1 className="max-[639px]:ml-3 sm:ml-2">
                          Reservieren von:{" "}
                          <span className="font-bold">
                            <em>
                              {dayStart}/{monthStart}/{yearStart}
                            </em>
                          </span>
                        </h1>
                      </div>
                      <div className="w-[35%] text-sm flex sm:w-1/2 max-[639px]:w-1/2">
                        <h1>
                          Reservieren bis:{" "}
                          <span className="font-bold">
                            <em>{formDate()}</em>{" "}
                          </span>
                        </h1>
                      </div>
                      <div className="deleteBtn lg:w-96 md:w-64 bg-black text-center py-2 sm:w-full max-[639px]:w-full">
                        <button
                          className=" font-bold text-white"
                          onClick={() => handleClickFixDeskDelete(id)}
                        >
                          Stornierung
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-400 w-full h-1 mt-5"></div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}
