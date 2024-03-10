import React, { useState, useEffect } from "react";

import Navbar from "./Navbar";

interface UserData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  department: string;
}

const User: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    department: "",
  });
  const [editable, setEditable] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const jwtToken = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!jwtToken) throw new Error("JWT token not found in localStorage");

        const response = await fetch(
          "https://deskbooking.dev.webundsoehne.com/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (!response.ok)
          throw new Error(
            `Failed to fetch user data: ${response.status} ${response.statusText}`
          );

        const userData: UserData = await response.json();
        setUserData(userData);
      } catch (error) {
        alert("Error fetching user data");
      }
    };
    if (jwtToken) fetchUserProfile();
    else alert("JWT token not found in local storage");
  }, [jwtToken]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch(
          "https://deskbooking.dev.webundsoehne.com/api/departments"
        );
        if (response.ok) {
          const data = await response.json();
          if (data && typeof data === "object") {
            const departmentsArray = Object.values(data) as string[];
            setDepartments(departmentsArray);
          }
        }
      } catch (error) {
        alert("Error fetching departments:");
      }
    };

    fetchDepartments();
  }, []);

  const handleEditClick = () => {
    setEditable(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(
        `https://deskbooking.dev.webundsoehne.com/api/users/${userData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user data");
      }

      setEditable(false);
    } catch (error) {
      alert("Error saving user data:");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const department = e.target.value;
    setUserData({ ...userData, department });
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />
      <div className="bg-white rounded-xl w-[80%] h-screen mb-14 flex flex-col justify-center items-center max-sm:flex-col overflow-y-auto max-sm:gap-10">
        <div className="flex flex-col items-center justify-center w-3/5 h-3/5 gap-2 bg-[#DCE8EB] rounded-lg max-md:w-full max-md:h-full border border-gray-300 shadow-2xl max-sm:border-none">
          <h1 className="pb-5 text-2xl font-bold">
            {userData.firstname}'s Profildaten
          </h1>
          <div className="w-4/6 bg-white rounded-md h-[10%] max-lg:h-[7%] flex justify-center items-center max-md:w-[90%]">
            {editable ? (
              <input
                type="text"
                name="firstname"
                value={userData.firstname}
                onChange={handleChange}
                className="w-full h-full text-center"
              />
            ) : (
              userData.firstname
            )}
          </div>
          <div className="w-4/6 h-[10%] max-lg:h-[7%] flex justify-center items-center bg-white rounded-md max-md:w-[90%]">
            {editable ? (
              <input
                type="text"
                name="lastname"
                value={userData.lastname}
                onChange={handleChange}
                className="w-full h-full text-center"
              />
            ) : (
              userData.lastname
            )}
          </div>
          <div className="w-4/6 h-[10%] max-lg:h-[7%] flex justify-center items-center bg-white rounded-md max-md:w-[90%]">
            {editable ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="w-full h-full text-center"
              />
            ) : (
              userData.email
            )}
          </div>
          <div className="w-4/6 h-[10%] max-lg:h-[7%] flex justify-center items-center bg-white rounded-md max-md:w-[90%]">
            {editable ? (
              <select
                value={userData.department}
                onChange={handleDepartmentChange}
                className="w-full h-full pl-3 text-center bg-white"
              >
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            ) : (
              userData.department
            )}
          </div>
          {editable ? (
            <button
              onClick={handleSaveClick}
              className="w-4/6 h-[10%] max-lg:h-[7%] font-bold text-white bg-black max-md:w-[90%] hover:scale-105"
            >
              SPEICHERN
            </button>
          ) : (
            <button
              onClick={handleEditClick}
              className="w-4/6 h-[10%] max-lg:h-[7%] font-bold text-white bg-black max-md:w-[90%] hover:scale-105"
            >
              BEARBEITEN
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
