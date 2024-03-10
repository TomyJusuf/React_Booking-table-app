import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar.tsx";
import { Link } from "react-router-dom";

type Desk = {
  column: number;
  equipment: [];
  label: string;
  isUserFavourite: boolean;
  nextBooking: string | null;
  row: number;
  updatedAt: string;
  id: string;
  createdAt: string;
  office: {
    name: string;
    id: string;
  };
  type: string;
  fixdesk: {
    id: string;
  } | null;
};

export default function AlleTische() {
  const [desks, setDesks] = useState<Desk[]>([]);
  const [officeName, setOfficeName] = useState<string>("");
  const [selectedOfficeId, setSelectedOfficeId] = useState<string | null>(null);
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null);

  useEffect(() => {
    const jwToken = localStorage.getItem("jwtToken");
    const initialSelectedOfficeId = localStorage.getItem("selectedOfficeId");
    setSelectedOfficeId(initialSelectedOfficeId);
    const initialSelectedDeskId = localStorage.getItem("selectedDeskId");
    setSelectedDeskId(initialSelectedDeskId);

    const fetchDesksInOffice = async () => {
      try {
        const response = await axios.get(
          "https://deskbooking.dev.webundsoehne.com/api/desks",
          {
            headers: {
              Authorization: `Bearer ${jwToken}`,
            },
          }
        );

        const desksInOffice = response.data.filter(
          (desk: any) => desk.office.id === selectedOfficeId
        );
        setDesks(desksInOffice);
        if (desksInOffice.length > 0) {
          setOfficeName(desksInOffice[0].office.name);
        }
      } catch (error) {
        alert("Error fetching desks in office");
      }
    };
    fetchDesksInOffice();
  }, [selectedOfficeId]);

  useEffect(() => {}, [desks]);

  const reserveDesk = (deskId: string) => {
    setSelectedDeskId(deskId);
    localStorage.setItem("selectedDeskId", deskId);
  };

  return (
    <div className="flex flex-col items-center w-screen h-full min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />
      <div className="bg-white rounded-xl w-[80%] h-[85vh] mb-14 overflow-y-auto pb-12">
        <div className="w-[100%] flex flex-col items-center justify-center text-center mb-14">
          <h1 className="pt-24 text-3xl">Desks in Office: {officeName}</h1>
          <p className="max-sm:w-[70%] mb-14 mt-4">
            klicken Sie auf den gewünschten Tisch um Details zu betrachten
          </p>
          <div className="w-[90%] grid grid-cols-4 gap-4 max-[1000px]:grid-cols-2 max-sm:grid-cols-1">
            {desks.map((desk: Desk) => {
              const { fixdesk, id, label, nextBooking } = desk;

              let deskClass = "bg-green-400";
              if (nextBooking === null) {
                deskClass = "bg-green-400";
              } else if (nextBooking && fixdesk) {
                deskClass = "bg-red-400";
              } else {
                deskClass = "bg-yellow-400";
              }

              const isSelected = selectedDeskId === id;

              return (
                <Link to="/deskdetails" key={id}>
                  <div
                    className={`w-[100%] h-[100%] flex flex-col justify-center items-center py-2 px-4 border max-sm:w-[100%] text-xs ${deskClass} ${isSelected}`}
                    onClick={() => reserveDesk(id)}
                  >
                    <p>{label}</p>
                    <p>{fixdesk ? "Fix Desk" : "Flex Desk"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
