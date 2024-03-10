import Navbar from "./Navbar";
import { useFixdeskRequestGET } from "../hooks/useAdminFixdeskRequest";
import { useEffect, useState } from "react";
import { useFixdeskRequestPUT } from "../hooks/useAdminFixdeskRequest";

type Object = {
  desk: { label: string; office: { name: string } };
  user: {
    updatedAt: string;
    department: string;
    firstname: string;
    lastname: string;
  };
  id: string;
  status: string;
};
export default function FixDeskBestatigung() {
  const [fixDesk, useFixDesk] = useState<any>([]);

  const { mutate } = useFixdeskRequestPUT();

  const accept = (id: string) => {
    const status: string = "approved";
    mutate({ id, status });
  };

  const decline = (id: string) => {
    const status: string = "rejected";
    mutate({ id, status });
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await useFixdeskRequestGET();
      useFixDesk(response);
    };
    fetch();
  }, [accept, decline]);

  useEffect(() => {
    const fetch = async () => {
      const response = await useFixdeskRequestGET();
      useFixDesk(response);
    };
    fetch();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center w-screen h-full min-h-screen text-center bg-[#DCE8EB]">
        <Navbar />{" "}
        <div className="bg-white rounded-xl w-[80%] h-full mb-14 overflow-y-auto pb-12 flex flex-col justify-center items-center">
          <h1 className="mt-24 text-2xl font-bold text-center">
            Fix Desk Bestätigung
          </h1>
          <div className="flex items-center justify-center mt-10">
            <div className="flex flex-wrap items-center justify-center w-full ">
              {fixDesk.map((items: Object) => {
                const { id, desk, user, status } = items;
                const officeName: string = desk.office.name;

                // Set your desired maximum length (e.g., 10 characters)

                const formDate: () => string = () => {
                  const dateObject = new Date(user.updatedAt);
                  const day: string = ("0" + dateObject.getDate()).slice(-2);
                  const month: string = (
                    "0" +
                    (dateObject.getMonth() + 1)
                  ).slice(-2);
                  const year: number = dateObject.getFullYear();
                  const newDateObject: string | number | Date = new Date(
                    dateObject
                  );
                  newDateObject.setMonth(dateObject.getMonth() + 3);
                  const newMonth = ("0" + (newDateObject.getMonth() + 1)).slice(
                    -2
                  );
                  // Returning the formatted date as a string
                  return `${day}.${month}.${year}-${day}.${newMonth}.${year}`;
                };
                return (
                  <div
                    className="w-[80%] mt-7 h-96  flex flex-wrap  items-end justify-between border-b-black border-b-2  sm:w-full"
                    key={id}
                  >
                    <div className="flex justify-center w-full h-10 mt-1 ">
                      <em>
                        <h1 className="text-lg font-semibold uppercase ">
                          {officeName}
                        </h1>
                      </em>
                    </div>
                    <div className="title lg:w-[65%] flex md:w-[60%]   md:h-72 justify-between mb-5 sm:h-40 sm:w-full  ">
                      <div className="info lg:w-1/2  md:w-1/2 md:mr-2 flex text-center flex-wrap justify-center items-center h-full md:h-40 lg:mr-5 max-[639px]:mr-0 max-[639px]:h-36  max-[639px]:max-w-36 ">
                        <div className="label w-full md:w-[100%] h-1/2 flex items-center justify-center max-[639px]:bg-white">
                          <h1 className="text-lg font-bold">
                            Label: {desk.label}
                          </h1>
                        </div>
                        {status === "rejected" ? (
                          <div className="flex items-center justify-center min-w-full bg-green-300 fixdesk h-1/2">
                            <h1 className="text-xl font-bold">Flex desk</h1>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center min-w-full bg-red-300 fixdesk h-1/2">
                            <h1 className="text-xl font-bold">Fix desk</h1>
                          </div>
                        )}
                      </div>
                      <div className="info lg:w-[50%] md:w-[50%]  flex flex-col md:justify-between md:h-full sm:justify-start  sm:h-40 sm:w-1/2">
                        <div className="select w-full max-[639px]:ml-3">
                          <h1 className="my-0 text-lg font-normal uppercase">
                            {user.lastname}
                          </h1>
                          <h1 className="text-lg font-normal uppercase ">
                            {user.firstname}
                          </h1>
                          <h1 className="text-lg font-normal uppercase ">
                            {user.department}
                          </h1>
                        </div>
                        <h1 className="uppercase lg:text-lg md:text-sm max-[639px]:ml-3">
                          {formDate()}{" "}
                        </h1>
                      </div>
                    </div>
                    <div className="boarder_buttons xl:w-56 lg:w-48  md:w-48 sm:w-full flex justify-end flex-wrap mb-5 gap-y-2  max-[639px]:w-full ">
                      <button
                        className="w-full h-12 px-16 py-1 font-bold bg-green-300"
                        onClick={() => accept(id)}
                      >
                        Accept
                      </button>
                      <button
                        className="w-full h-12 px-16 py-1 font-bold bg-red-300"
                        onClick={() => decline(id)}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
