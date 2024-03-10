import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "./Navbar";

interface Office {
  id: string;
  name: string;
  address: string;
  totalDesks?: number;
}

interface Desk {
  office: {
    id: string;
  };
}

const Offices: React.FC = () => {
  const jwtToken = localStorage.getItem("jwtToken");
  const [userFirstName, setUserFirstName] = useState<string>("");
  const [offices, setOffices] = useState<Office[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          "https://deskbooking.dev.webundsoehne.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (response.ok) {
          const userData = await response.json();
          setUserFirstName(userData.firstname);
        } else {
          alert("Error fetching user profile");
        }
      } catch (error) {
        alert("Error fetching user profile");
      }
    };

    if (jwtToken) {
      fetchUserProfile();
    }
  }, [jwtToken]);

  useEffect(() => {
    const fetchOfficesAndCalculateTotalDesks = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const response = await fetch(
          "https://deskbooking.dev.webundsoehne.com/api/offices",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (response.ok) {
          const officesData: Office[] = await response.json();
          const fetchDesksCountByOffice = async () => {
            try {
              const desksResponse = await fetch(
                "https://deskbooking.dev.webundsoehne.com/api/desks",
                {
                  headers: {
                    Authorization: `Bearer ${jwtToken}`,
                  },
                }
              );
              if (desksResponse.ok) {
                const desksData = await desksResponse.json();
                const deskCountByOffice: { [key: string]: number } =
                  desksData.reduce(
                    (deskTotal: { [key: string]: number }, desk: Desk) => {
                      const officeId = desk.office.id;
                      if (!deskTotal[officeId]) {
                        deskTotal[officeId] = 1;
                      } else {
                        deskTotal[officeId]++;
                      }
                      return deskTotal;
                    },
                    {}
                  );

                const officesWithTotalDesks = officesData.map((office) => ({
                  ...office,
                  totalDesks: deskCountByOffice[office.id] || 0,
                }));
                setOffices(officesWithTotalDesks);
              } else {
                console.error(
                  "Error fetching desks data:",
                  desksResponse.statusText
                );
              }
            } catch (error) {
              console.error("Error fetching desks data:", error);
            }
          };

          fetchDesksCountByOffice();
        } else {
          console.error("Error fetching offices:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching offices:", error);
      }
    };

    fetchOfficesAndCalculateTotalDesks();
  }, []);

  const reserveOffice = (officeId: string) => {
    localStorage.setItem("selectedOfficeId", officeId);
  };

  return (
    <div className="flex flex-col items-center w-screen h-full min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />
      <div className="bg-white max-sm:bg-[#DCE8EB] rounded-xl w-[80%] h-[85vh] mb-14 overflow-y-auto pb-12">
        <div className="w-[100%] flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center mb-14 gap-5">
            <h1 className="pt-24 text-3xl font-bold">
              Willkommen {userFirstName},
            </h1>
            <div className="max-sm:w-[70%]">
              <h3>wähle den gewünschten Standort aus um fortzufahren</h3>
            </div>
          </div>
          <div className="grid max-sm:grid-cols-1 grid-cols-2 lg:grid-cols-4 gap-7 w-[95%] max-lg:w-[80%] place-items-center">
            {offices.map((office, index) => (
              <div
                key={index}
                className="border border-gray-300 max-sm:bg-white shadow-2xl pt-2 mx-4 max-sm:w-[90%] w-full font-bold text-xs"
              >
                <h2>{office.name}</h2>
                <h3>Tische: {office.totalDesks}</h3>
                <h3>{office.address}</h3>
                <Link to="/desks">
                  <button
                    className="hover:bg-[#DCE8EB] hover:text-black w-full py-2 mt-2 text-white transition-colors duration-400 bg-black font-semibold text-md"
                    onClick={() => reserveOffice(office.id)}
                  >
                    Reservieren
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offices;
