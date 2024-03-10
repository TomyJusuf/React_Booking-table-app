import { useEffect, useState } from "react";
import Navbar from "./Navbar";

interface Comment {
  id: string;
  comment: string;
  commentedAt: string;
  user: {
    firstname: string;
    lastname: string;
  };
  desk: {
    label: string;
    equipment: string[];
  };
}

const MängelAnzeigen = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");
        if (!jwtToken) {
          throw new Error("JWT-Token nicht gefunden.");
        }

        const baseUrl = "https://deskbooking.dev.webundsoehne.com";
        const page = 0;

        const response = await fetch(`${baseUrl}/api/comments?page=${page}`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Fehler beim Abrufen der Kommentare.");
        }

        const commentsData = await response.json();
        setComments(commentsData);
      } catch (error) {
        alert("Ein Fehler ist aufgetreten");
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = async (commentId: string) => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");
      const baseUrl = "https://deskbooking.dev.webundsoehne.com";

      const response = await fetch(`${baseUrl}/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        setAlertMessage("Kommentar erfolgreich gelöscht");
      } else {
        throw new Error("Fehler beim Löschen des Kommentars.");
      }
    } catch (error) {
      console.error("Ein Fehler ist aufgetreten:", error);
      setAlertMessage("Ein Fehler ist aufgetreten");
    }
  };

  const handleCloseAlert = () => {
    setAlertMessage("");
  };

  return (
    <div className="flex flex-col items-center w-screen h-full min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />
      <div className="bg-white rounded-xl w-[80%] h-[85vh] mb-14 overflow-y-auto pb-12">
        <h1 className="pt-24 pb-12 text-2xl font-bold">Mängel anzeigen</h1>
        <div className="flex items-center justify-center w-full">
          <ul className="flex flex-col items-center justify-center w-full">
            {comments.map((comment) => (
              <div
                className="flex items-center justify-center w-full border-b-2 max-md:flex-col max-md:gap-0 gap-12"
                key={comment.id}
              >
                <div className="flex flex-col items-center w-[40%] mt-7">
                  <p className="w-full font-bold">
                    Desk Label: {comment.desk.label}
                  </p>
                  <p className="font-bold">Equipment:</p>
                  <ul>
                    {comment.desk.equipment.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col items-center w-[40%] my-7">
                  <p className="font-bold">
                    {comment.user.firstname} {comment.user.lastname}
                  </p>
                  <p>{comment.comment}</p>
                  <p className="text-xs">
                    {new Date(comment.commentedAt).toLocaleString()}
                  </p>
                  <button
                    className="px-4 py-2 mt-2 font-bold text-white bg-red-500 rounded-md"
                    onClick={() => handleDeleteComment(comment.id)}
                  >
                    Löschen
                  </button>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>
      {alertMessage && (
        <div className="fixed p-4 bg-white border border-gray-300 shadow-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-md">
          <p>{alertMessage}</p>
          <button
            onClick={handleCloseAlert}
            className="px-2 py-2 font-semibold text-white bg-black"
          >
            weiter
          </button>
        </div>
      )}
    </div>
  );
};

export default MängelAnzeigen;
