import Navbar from "./Navbar";
import { Link } from "react-router-dom";

export default function Reservations() {
  return (
    <>
      <div className="flex flex-col items-center w-screen h-screen min-h-screen text-center bg-[#DCE8EB]">
        <Navbar />
        <div className="bg-[#DCE8EB] mb-14 pb-12 rounded-xl w-[80%] h-screen flex flex-col justify-center items-center overflow-y-auto">
          <h1 className="text-3xl font-bold pt-28 max-sm:text-xl">
            Reservierungen
          </h1>
          <div className="flex items-center w-full h-full justify-evenly max-sm:flex-col max-sm:gap-7">
            <div className="border-gray-300 border shadow-2xl flex flex-col items-center justify-end w-1/4 max-sm:mt-12  bg-white h-2/4 max-sm:w-3/4 max-sm:h-[100%]">
              <div className="flex items-center justify-center h-full text-7xl pt-7">
                &#10094;
              </div>
              <Link to="/pastreservations" className="w-full">
                <button className="w-full px-2 py-2 font-bold text-white bg-black max-sm:text-sm">
                  vergangene
                </button>
              </Link>
            </div>

            <div className="border-gray-300 border shadow-2xl flex flex-col items-center justify-end w-1/4 bg-white h-2/4 max-sm:w-3/4 max-sm:h-[100%]">
              <div className="flex items-center justify-center h-full text-7xl pt-7">
                &#9733;
              </div>
              <Link to="/favorites" className="w-full">
                <button className="w-full h-full px-2 py-2 font-bold text-white bg-black max-sm:text-sm">
                  Favoriten
                </button>
              </Link>
            </div>

            <div className="border-gray-300 border shadow-2xl flex flex-col items-center justify-end w-1/4 bg-white h-2/4 max-sm:w-3/4 max-sm:h-[100%]">
              <div className="flex items-center justify-center h-full text-7xl pt-7">
                &#10095;
              </div>
              <Link to="/futurereservations" className="w-full">
                <button className="w-full px-2 py-2 font-bold text-white bg-black max-sm:text-sm">
                  zukünftige
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
