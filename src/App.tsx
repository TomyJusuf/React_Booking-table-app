import { useEffect } from "react";
import Navbar from "./components/Navbar";

function App() {
  useEffect(() => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      window.location.href = "/offices";
    } else {
      window.location.href = "/login";
    }
  }, []);
  return (
    <div className="bg-[#DCE8EB] w-screen md:h-[100vh] sm:h-full">
      <Navbar />
      <section className="flex items-center justify-center w-full h-screen bg-[#DCE8EB]">
        <h1 className="text-5xl font-bold">Sie werden umgeleitet...</h1>
      </section>
    </div>
  );
}

export default App;
