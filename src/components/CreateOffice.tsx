import React, { useState, ChangeEvent } from "react";
import * as Yup from "yup";

import Navbar from "./Navbar";

interface OfficeData {
  name: string;
  columns: number;
  rows: number;
}

const CreateOffice: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [columns, setColumns] = useState<number | string>("");
  const [rows, setRows] = useState<number | string>("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [columnsError, setColumnsError] = useState<string | null>(null);
  const [rowsError, setRowsError] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const schema = Yup.object().shape({
    name: Yup.string().required("Name ist ein Pflichtfeld"),
    columns: Yup.number().required("Sitzspalten ist ein Pflichtfeld"),
    rows: Yup.number().required("Sitzreihen ist ein Pflichtfeld"),
  });

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError(null);
  };

  const handleColumnsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setColumns(value);
    setColumnsError(null);
  };

  const handleRowsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRows(value);
    setRowsError(null);
  };

  const handleAddOffice = async () => {
    let hasError = false;

    if (!name) {
      setNameError("*Name ist ein Pflichtfeld");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!columns) {
      setColumnsError("*Sitzspalten ist ein Pflichtfeld");
      hasError = true;
    } else {
      setColumnsError(null);
    }

    if (!rows) {
      setRowsError("*Sitzreihen ist ein Pflichtfeld");
      hasError = true;
    } else {
      setRowsError(null);
    }

    if (hasError) {
      return;
    }

    try {
      await schema.validate({
        name,
        columns: parseInt(columns as string),
        rows: parseInt(rows as string),
      });

      const officeData: OfficeData = {
        name: name,
        columns: parseInt(columns as string),
        rows: parseInt(rows as string),
      };

      const jwtToken = localStorage.getItem("jwtToken");
      const baseUrl = "https://deskbooking.dev.webundsoehne.com";

      const response = await fetch(`${baseUrl}/api/admin/offices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(officeData),
      });

      if (response.ok) {
        setAlertMessage("Büro erfolgreich erstellt");
      } else {
        setAlertMessage("Fehler beim Erstellen des Büros");
      }
    } catch (validationError: any) {
      const { path, message } = validationError;
      if (path === "name") {
        setNameError(message);
      } else if (path === "columns") {
        setColumnsError(message);
      } else if (path === "rows") {
        setRowsError(message);
      }
    }
  };

  const handleAlertClose = () => {
    setAlertMessage(null);
  };

  return (
    <div className="flex flex-col items-center w-screen h-screen min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />

      <div className="bg-white rounded-xl w-[80%] h-screen mb-14 flex flex-col justify-center items-center max-sm:flex-col overflow-y-auto max-sm:gap-10">
        <div className="flex flex-col items-center justify-center w-3/5 h-3/5 gap-2 bg-[#DCE8EB] rounded-lg max-md:w-full max-md:h-full border border-gray-300 max-sm:border-none shadow-2xl">
          <div className="flex flex-col w-1/2">
            <div className="flex flex-col items-start">
              <label htmlFor="name" className="font-semibold">
                Office Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={handleNameChange}
                className="w-full py-1 border rounded-md"
              />
              {nameError && <p className="text-xs text-red-500">{nameError}</p>}
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="columns" className="font-semibold">
                Sitzspalten
              </label>
              <input
                id="columns"
                type="number"
                value={columns as string}
                onChange={handleColumnsChange}
                className="w-full py-1 border rounded-md"
              />
              {columnsError && (
                <p className="text-xs text-red-500">{columnsError}</p>
              )}
            </div>

            <div className="flex flex-col items-start">
              <label htmlFor="rows" className="font-semibold">
                Sitzreihen
              </label>
              <input
                id="rows"
                type="number"
                value={rows as string}
                onChange={handleRowsChange}
                className="w-full py-1 border rounded-md"
              />
              {rowsError && <p className="text-xs text-red-500">{rowsError}</p>}
            </div>
            <button
              onClick={handleAddOffice}
              className="py-2 mt-4 font-bold text-white bg-black hover:scale-105 transition-transform duration-300"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      </div>

      {alertMessage && (
        <div className="fixed p-8 bg-white border border-gray-300 rounded-lg shadow-lg top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <p className="mb-4 text-lg text-center">{alertMessage}</p>
          <button
            onClick={handleAlertClose}
            className="block w-full py-2 text-center text-white bg-black rounded-lg"
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateOffice;
