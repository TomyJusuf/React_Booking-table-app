import { Link } from "react-router-dom";

import { useEffect, useState } from "react";

export default function Navbar() {
  const [showLinks, setShowLinks] = useState(false);

  const handleResize = () => {
    if (window.innerWidth <= 870) {
      setShowLinks(false);
    }
  };

  // Check if JWT token is present
  const jwtToken = localStorage.getItem("jwtToken");

  // If JWT token is not present, redirect to login page
  if (!jwtToken) {
    window.location.href = "/login";
    return null; // Prevent rendering the dashboard if redirected
  }
  // logout function
  const logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    handleResize();
    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <nav
        className={
          "flex mx-auto xl:w-[100%] lg:max-w-[100%] justify-end md:w-[100%] text-2xl font-bold uppercase md:max-w-full md:justify-center lg:flex-wrap lg:justify-end  md:flex-wrap sm:flex-wrap  sm:h-auto py-3  md:relative sm:w-[100%]  sm:justify-end sm:z-10  max-[639px]:w-[100%] max-[639px]:h-auto max-[639px]:flex max-[639px]:flex-wrap  max-[517px]:w-[100%] lg:py-3 md:py-3 md:bg-[#DCE8EB] lg:bg-[#DCE8EB] max-[639px]:bg-[#DCE8EB]"
        }
      >
        {/* Hamburger menu button */}

        <div className=" sm:w-[100%]  sm:flex sm:justify-end lg:hidden md:hidden  max-[639px]:flex max-[639px]:mr-5 max-[639px]:h-14 max-[639px]:text-end bg-[#DCE8EB]">
          <button onClick={() => setShowLinks(!showLinks)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-20 h-10"
            >
              <path
                fill="#000"
                d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
              />
            </svg>
          </button>
        </div>

        {/* Navigation links */}
        <div
          className={`${
            showLinks
              ? "lg:visible sm:flex sm:flex-wrap md:flex-wrap md:hidden max-[639px]:w-[100%] max-[639px]:flex max-[639px]:flex-wrap max-[639px]:h-auto max-[639px]:gap-y-5 max-[639px]:my-2 bg-[#DCE8EB] sm:h-[93.3vh] sm:ml-96"
              : "sm:hidden md:flex lg:visible xl:visible gap-x-5 lg:py-3 md:py-3 max-[639px]:hidden  lg:max-w-[90%] lg:mr-16 bg-[#DCE8EB] text-xs"
          }`}
        >
          <Link
            className="hover:scale-105 hover:underline lg:w-auto md:w-full text-center sm:text-start sm:w-full max-[639px]:text-start max-[639px]:pl-10 max-[639px]:w-full"
            to="/offices"
          >
            Offices
          </Link>
          <Link
            className="hover:scale-105 hover:underline flg:w-auto md:w-full text-center sm:text-start sm:w-full max-[639px]:text-start max-[639px]:pl-10 max-[639px]:w-full"
            to="/favorites"
          >
            Favoriten
          </Link>
          <Link
            className="hover:scale-105 hover:underline lg:w-auto md:w-full text-center sm:text-start sm:w-full max-[639px]:text-start max-[639px]:pl-10 max-[639px]:w-full"
            to="/reservations"
          >
            Reservierungen
          </Link>
          <Link
            className="hover:scale-105 hover:underline lg:w-auto md:w-full text-center sm:text-start sm:w-full max-[639px]:text-start max-[639px]:pl-10 max-[639px]:w-full"
            to="/user"
          >
            user
          </Link>
          <Link
            className="hover:scale-105 hover:underline lg:w-auto md:w-full text-center sm:text-start sm:w-full max-[639px]:text-start max-[639px]:pl-10 max-[639px]:w-full"
            to="/admin"
          >
            Admin
          </Link>
          <Link
            className="hover:scale-105 hover:underline lg:w-auto md:w-full text-center sm:text-start sm:w-full max-[639px]:text-start max-[639px]:pl-10 max-[639px]:w-full"
            to={"/login"}
            onClick={logout}
          >
            Logout
          </Link>
        </div>
      </nav>
    </>
  );
}
