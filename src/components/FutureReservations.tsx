import { useEffect, useState } from "react";
import Navbar from "./Navbar";

interface Booking {
  id: string;
  dateStart: string;
  dateEnd: string;
  desk: {
    label: string;
    equipment: string[];
    office: {
      name: string;
    };
  };
}

const CustomModal = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-700 border border-gray-300 shadow-2xl bg-opacity-50">
    <div className="max-w-md p-8 bg-white rounded-lg">
      <p className="text-center">{message}</p>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 mt-10 text-white bg-black rounded-md"
      >
        OK
      </button>
    </div>
  </div>
);

export default function FutureReservations() {
  const [futureBookings, setFutureBookings] = useState<Booking[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        const baseUrl = "https://deskbooking.dev.webundsoehne.com";
        const profileResponse = await fetch(`${baseUrl}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        if (!profileResponse.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userProfile = await profileResponse.json();
        const userId = userProfile.id;
        const bookingsResponse = await fetch(
          `${baseUrl}/api/bookings/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        );
        if (!bookingsResponse.ok) {
          throw new Error("Failed to fetch user bookings");
        }
        const bookingsData = await bookingsResponse.json();
        const currentDate = new Date();
        const filteredBookings = bookingsData.filter(
          (booking: Booking) => new Date(booking.dateStart) > currentDate
        );

        setFutureBookings(filteredBookings);
      } catch (error) {
        setModalMessage("Fehler: erhalte keine Daten");
        setShowModal(true);
      }
    };
    fetchData();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const baseUrl = "https://deskbooking.dev.webundsoehne.com";

      const response = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        setFutureBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.id !== bookingId)
        );
        setModalMessage("Buchung erfolgreich storniert");
        setShowModal(true);
      } else {
        alert("Fehler beim Stornieren der Buchung");
        setModalMessage("Fehler beim Stornieren der Buchung");
        setShowModal(true);
      }
    } catch (error) {
      alert("An error occurred");
      setModalMessage("Ein Fehler ist aufgetreten");
      setShowModal(true);
    }
  };

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("de-DE", options);
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />
      {showModal && (
        <CustomModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="bg-white rounded-xl w-[80%] h-screen mb-14 flex flex-col justify-start items-center max-sm:flex-col overflow-y-auto max-sm:gap-10">
        <h1 className="pt-12 pb-12 text-2xl font-bold">
          Zukünftige Reservierungen
        </h1>
        <ul className="flex flex-col items-center w-full">
          {futureBookings.map((booking) => (
            <div
              className="flex items-center justify-around w-full border-b-2 max-sm:flex-col"
              key={booking.id}
            >
              <ul className="flex flex-col items-center w-[40%] my-7">
                <li className="font-bold">{booking.desk.office.name}</li>
                <li className="my-4 font-semibold text-start">
                  Equipment:
                  <ul className="font-normal">
                    {booking.desk.equipment.map((item, index) => (
                      <li key={index}>
                        <span className="mr-2">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
                <li>{booking.desk.label}</li>
                <li className="">
                  Reserviert von: {formatDate(booking.dateStart)}
                </li>
                <li className="">
                  Reserviert bis: {formatDate(booking.dateEnd)}
                </li>
              </ul>

              <li className="flex flex-col justify-center items-center w-[40%] max-sm:w-full">
                <button
                  onClick={() => handleCancelBooking(booking.id)}
                  className="px-4 py-2 mt-2 font-bold text-white bg-red-500 max-sm:mb-7 rounded-md"
                >
                  Reservierung Stornieren
                </button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
