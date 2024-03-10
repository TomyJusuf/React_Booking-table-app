import { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import Navbar from "./Navbar";

interface Booking {
  id: string;
  dateStart: string;
  dateEnd: string;
  desk: {
    label: string;
    equipment: string[];
    id: string;
    office: {
      name: string;
    };
  };
}

export default function PastReservations() {
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [commentErrors, setCommentErrors] = useState<{
    [key: string]: string | null;
  }>({});
  const alertRef = useRef<HTMLDivElement>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const commentSchema = Yup.object().shape({
    comment: Yup.string().required("*Bitte beschreiben Sie die Mängel"),
  });

  const handleSendComment = async (bookingId: string) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const baseUrl = "https://deskbooking.dev.webundsoehne.com";

      const isValid = await commentSchema.isValid({
        comment: comments[bookingId],
      });

      if (!isValid) {
        setCommentErrors({ [bookingId]: "*Bitte beschreiben Sie die Mängel" });
        return;
      }

      const deskId = pastBookings.find((booking) => booking.id === bookingId)
        ?.desk.id;

      const response = await fetch(`${baseUrl}/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          comment: comments[bookingId],
          desk: deskId,
        }),
      });

      if (response.ok) {
        setAlertMessage("Kommentar erfolgreich erstellt");
        openAlert();
      } else {
        setAlertMessage("Fehler beim Erstellen des Kommentars");
        openAlert();
      }
    } catch (error) {
      setAlertMessage("An error occurred");
      openAlert();
    }
  };

  const openAlert = () => {
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

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
          (booking: Booking) => new Date(booking.dateEnd) > currentDate
        );
        setPastBookings(filteredBookings);
      } catch (error) {
        setAlertMessage("An error occurred");
        openAlert();
      }
    };
    fetchData();
  }, []);

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    return new Date(date).toLocaleDateString("de-DE", options);
  };

  return (
    <>
      <div className="flex flex-col items-center w-screen h-screen min-h-screen text-center bg-[#DCE8EB]">
        <Navbar />
        <div className="bg-white rounded-xl w-[80%] h-screen mb-14 flex flex-col justify-start items-center max-sm:flex-col overflow-y-auto max-sm:gap-10">
          <h1 className="pt-24 pb-12 text-2xl font-bold">
            Letzte Reservierungen
          </h1>
          <div className="w-full">
            <ul className="flex flex-col items-center w-full">
              {pastBookings.map((booking) => (
                <div
                  className="flex justify-around w-full border-b-2 max-sm:flex-col max-sm:items-center"
                  key={booking.id}
                >
                  <div className="flex flex-col items-center w-[40%] my-7">
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
                    <li>Von: {formatDate(booking.dateStart)}</li>
                    <li>Bis: {formatDate(booking.dateEnd)}</li>
                  </div>

                  <li className="flex flex-col justify-center items-center w-[40%] max-sm:w-[70%]">
                    {commentErrors[booking.id] && (
                      <p className="w-full text-left text-red-500 ">
                        {commentErrors[booking.id]}
                      </p>
                    )}
                    <textarea
                      value={comments[booking.id] || ""}
                      onChange={(e) =>
                        setComments({
                          ...comments,
                          [booking.id]: e.target.value,
                        })
                      }
                      className="w-full h-[70%] border border-black px-2 py-1 resize-none focus:outline max-sm:h-[100%]"
                    />

                    <button
                      onClick={() => handleSendComment(booking.id)}
                      className="w-full py-2 font-bold text-white bg-black max-sm:mb-10"
                    >
                      Mängel weiterleiten
                    </button>
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div
        ref={alertRef}
        className={`fixed top-1/2 left-1/2 flex flex-col justify-center items-center transform -translate-x-1/2 -translate-y-1/2 rounded-md border border-gray-300 shadow-2xl h-[25%] w-[40%] text-center max-lg:w-[50%] max-lg:h-[25%] max-sm:w-[80% ${
          showAlert ? "block" : "hidden"
        }`}
      >
        <div className="w-full h-full p-8 bg-white rounded-lg">
          <p className="">{alertMessage}</p>
          <button
            className="py-2 fixed bottom-0 left-0 hover:bg-[#DCE8EB] hover:text-black w-full font-semibold text-white bg-black rounded-b-md"
            onClick={() => setShowAlert(false)}
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}
