import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function AdminMenu() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
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

        const userData = await response.json();
        setIsAdmin(userData.isAdmin === true);
      } catch (error) {
        alert("Error fetching user data");
      }
    };

    fetchUserProfile();
  }, []);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col items-center w-screen h-full min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />
      {isAdmin ? (
        <div className="bg-white max-sm:bg-[#DCE8EB] rounded-xl w-[80%] h-[85vh] mb-14 overflow-y-auto pb-12 flex flex-col justify-center items-center">
          <div className="bg-[#DCE8EB] w-3/5 max-[800px]:w-4/5 mx-auto mt-20 rounded-lg max-sm:shadow-none shadow-2xl border border-gray-300 max-sm:border-none">
            <h1 className="pt-2 text-2xl font-bold text-center mt-7">
              Administration
            </h1>
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <Link className="w-full font-semibold" to="/fixdeskbestätigung">
                <button className="w-4/6 py-2 text-white bg-black hover:bg-white hover:text-black">
                  Fix Desk Bestätigung
                </button>
              </Link>

              <Link className="w-full h-full font-semibold" to="/mängel">
                <button className="w-4/6 py-2 text-white bg-black hover:bg-white hover:text-black">
                  Mängel anzeigen
                </button>
              </Link>

              <Link
                className="w-full h-full font-semibold"
                to="/officehinzufügen"
              >
                <button className="w-4/6 py-2 text-white bg-black hover:bg-white hover:text-black">
                  Office hinzufügen
                </button>
              </Link>

              <Link
                className="w-full h-full font-semibold"
                to="/deskhinzufügen"
              >
                <button className="w-4/6 py-2 text-white bg-black hover:bg-white hover:text-black">
                  Desk hinzufügen
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
          <div className="mb-4 text-xl font-semibold">
            Bitte melden Sie sich mit Ihren Administrator Zugangsdaten an!
          </div>
          <button
            className="w-1/5 px-2 py-2 font-bold text-white bg-black"
            onClick={handleLoginClick}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminMenu;
