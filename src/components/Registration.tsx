import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

interface Department {
  id: string;
  name: string;
}

interface FormData {
  vorname: string;
  nachname: string;
  email: string;
  abteilung: string;
  passwort: string;
  passwortBestätigen: string;
}

const schema = yup.object().shape({
  vorname: yup.string().required("Vorname ist erforderlich"),
  nachname: yup.string().required("Nachname ist erforderlich"),
  email: yup
    .string()
    .email("Ungültige E-Mail-Adresse")
    .required("E-Mail ist erforderlich"),
  abteilung: yup.string().required("Abteilung ist erforderlich"),
  passwort: yup
    .string()
    .min(6, "Passwort muss mindestens 6 Zeichen lang sein")
    .required("Passwort ist erforderlich"),
  passwortBestätigen: yup
    .string()
    .oneOf([yup.ref("passwort"), ""], "Passwörter müssen übereinstimmen"),
});

(
  schema.fields.passwort as yup.StringSchema<string, Record<string, unknown>>
).typeError("Das Passwort muss eine Zeichenfolge sein");

(
  schema.fields.passwortBestätigen as yup.StringSchema<
    string,
    Record<string, unknown>
  >
).typeError("Das Passwort bestätigen muss eine Zeichenfolge sein");

const Registration: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await fetch(
        "https://deskbooking.dev.webundsoehne.com/api/departments"
      );
      if (response.ok) {
        const data = await response.json();
        if (data && typeof data === "object") {
          const departmentsArray = Object.entries(data).map(
            ([name, value]) => ({
              id: name,
              name: value as string,
            })
          );
          setDepartments(departmentsArray);
        }
      }
    } catch (error) {
      alert(
        "Fehler beim Abrufen der Abteilungen. Bitte versuchen Sie es später erneut."
      );
    }
  };

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const formDataToSend = {
        firstname: formData.vorname,
        lastname: formData.nachname,
        email: formData.email,
        department: formData.abteilung,
        password: formData.passwort,
      };

      const response = await fetch(
        "https://deskbooking.dev.webundsoehne.com/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formDataToSend),
        }
      );

      if (response.ok) {
        reset();
        setShowAlert(true);
      } else {
        const errorResponse = await response.json();
        alert(
          "Fehler bei der Registrierung: " +
            JSON.stringify(errorResponse.message)
        );
      }
    } catch (error) {
      alert(
        "Fehler beim Einreichen des Formulars. Bitte versuchen Sie es später erneut."
      );
    }
  };

  const handleAlertButtonClick = () => {
    setShowAlert(false);
    setRedirect(true);
  };

  if (redirect) {
    window.location.href = "/login";
  }

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      {showAlert && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="p-8 bg-white rounded-lg">
            <p className="mb-4 text-lg text-center">
              Registrierung erfolgreich!
            </p>
            <button
              onClick={handleAlertButtonClick}
              className="block w-full py-2 text-center text-white bg-black rounded-lg"
            >
              Zum Login
            </button>
          </div>
        </div>
      )}
      <div className="w-[60%] max-h-570 py-14 bg-[#DCE8EB] rounded-3xl flex justify-center items-center max-sm:min-w-full max-sm:min-h-screen max-sm:rounded-none">
        <form className="w-[80%] h-auto flex flex-col gap-5 max-sm:gap-16">
          <h1 className="text-4xl font-bold pb-7">Registrierung</h1>
          <div className="flex flex-col w-56 max-sm:w-[100%]">
            <input
              type="text"
              {...register("vorname")}
              className={`w-56 py-2 bg-[#DCE8EB] placeholder:text-black text-sm max-sm:w-[100%] pl-2 ${
                errors.vorname && "border-red-500"
              }`}
              placeholder="Vorname"
            />
            {errors.vorname && (
              <span className="text-xs text-red-500">
                {errors.vorname.message}
              </span>
            )}
            <div className="bg-black h-[1px] mb-2" />

            <input
              type="text"
              {...register("nachname")}
              className={`w-56 py-2 bg-[#DCE8EB] placeholder:text-black text-sm max-[640px]:w-[100%] pl-2 ${
                errors.nachname && "border-red-500"
              }`}
              placeholder="Nachname"
            />
            {errors.nachname && (
              <span className="text-xs text-red-500">
                {errors.nachname.message}
              </span>
            )}
            <div className="bg-black h-[1px] mb-2" />

            <input
              type="email"
              {...register("email")}
              className={`w-56 py-2 bg-[#DCE8EB] placeholder:text-black text-sm max-[640px]:w-[100%] pl-2 ${
                errors.email && "border-red-500"
              }`}
              placeholder="E-Mail"
            />
            {errors.email && (
              <span className="text-xs text-red-500">
                {errors.email.message}
              </span>
            )}
            <div className="bg-black h-[1px] mb-2" />

            <select
              {...register("abteilung")}
              className={`w-56 py-2 bg-[#DCE8EB] placeholder:text-black text-sm max-[640px]:w-[100%] ${
                errors.abteilung && "border-red-500"
              }`}
            >
              <option value="">Abteilung auswählen</option>
              {departments.map((department) => (
                <option key={department.id} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
            {errors.abteilung && (
              <span className="text-xs text-red-500">
                {errors.abteilung.message}
              </span>
            )}
            <div className="bg-black h-[1px] mb-2" />
            <input
              type="password"
              {...register("passwort")}
              className={`w-56 py-2 bg-[#DCE8EB] placeholder:text-black text-sm max-[640px]:w-[100%] pl-2 ${
                errors.passwort && "border-red-500"
              }`}
              placeholder="Passwort"
            />
            {errors.passwort && (
              <span className="text-xs text-red-500">
                {errors.passwort.message}
              </span>
            )}
            <div className="bg-black h-[1px] mb-2" />
            <input
              type="password"
              {...register("passwortBestätigen")}
              className={`w-56 py-2 bg-[#DCE8EB] placeholder:text-black text-sm max-[640px]:w-[100%] pl-2 ${
                errors.passwortBestätigen && "border-red-500"
              }`}
              placeholder="Passwort bestätigen"
            />
            {errors.passwortBestätigen && (
              <span className="text-xs text-red-500">
                {errors.passwortBestätigen.message}
              </span>
            )}
            <div className="bg-black h-[1px] mb-2" />
          </div>
          <button
            type="submit"
            className="w-full text-xl font-bold text-white bg-black rounded-lg h-14 lg:mt-12 md:mt-5 hover:scale-105 transition-transform duration-300"
            onClick={handleSubmit(onSubmit)}
          >
            Registrieren
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
