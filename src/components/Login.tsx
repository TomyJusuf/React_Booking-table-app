import { useForm, SubmitHandler } from "react-hook-form";
import { useLoginUser } from "../hooks/useLoginUser";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

export type Inputs = {
  email: string;
  password: string;
};

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .required("Email required")
    .email("Invalid email address"),
  password: yup.string().min(5).required("Password required"),
});

export default function Login() {
  const { mutate, data } = useLoginUser();
  const [logIsWrong, setLogIsWrong] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({ resolver: yupResolver(loginSchema) });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate(data);
  };

  useEffect(() => {
    if (data) {
      const { success } = data;
      setLogIsWrong(success);
    }
  }, [data]);

  return (
    <div className="max-[640px]:bg-[#DCE8EB]">
      <div className="flex w-[80vw]  mx-auto justify-center items-center  h-full md:mt-36  lg:mt-36  sm:mt-40 sm:flex sm:items-center   max-[640px]:bg-[#DCE8EB] mb-36  sm:w-[80%] max-[640px]:flex max-[640px]:mt-40  max-[375px]:mt-[80px] max-[360px]:mt-[120px] max-[280px]:mt-[72px] max-[375px]:w-full">
        <div className="login_table w-[50%] h-auto bg-[#DCE8EB] rounded-3xl flex justify-center items-start lg:w-[70%] md:w-[80%] md:mt-0  sm:w-[90%] max-[640px]:w-[500px] max-[740px]:rounded-3xl   min-[635px]:rounded-3xl  max-[375px]:h-auto">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="login_table_form w-[80%]  mx-auto flex flex-wrap mt-12 gap-y-5  lg:h-[60vh] max-[640px]:w-full max-[375px]:mt-0 max-[375px]:px-3 max-[280px]:mt-16 h-auto "
          >
            {" "}
            <h1 className="w-full h-12 col-span-2 row-span-1 text-5xl lg:text-5xl font-bold mb-14 lg:mt-10 md:text-5xl max-[640px]:text-4xl max-[375px]: max-[360px]:mb-5">
              Login
            </h1>{" "}
            {logIsWrong ? (
              ""
            ) : (
              <div className="w-full text-2xl font-bold text-center text-white bg-red-600">
                Not Success,please try again !
              </div>
            )}
            <div className="login_table_input w-56 mb-12 lg:mt-3 lg:mb-0 max-[640px]:w-[100%]">
              <input
                type="text"
                {...register("email")}
                placeholder="Email"
                className="w-56 py-3 pl-2 bg-[#DCE8EB] placeholder:text-slate-500 text-xl md:text-lg max-[640px]:w-[100%] placeholder:pl-2"
              />{" "}
              <span className="text-red-500 absolute ml-5 max-[640px]:absolute  max-[640px]:ml-[-400px] max-[640px]:mt-[-23px] max-[280px]:relative max-[280px]:ml-[0px] max-[280px]:text-sm max-[280px]:w-56">
                {errors.email?.message}
              </span>{" "}
              <div className="bg-black h-[1px] mb-2" />
              <input
                type="password"
                {...register("password")}
                placeholder="Password"
                className="w-56 py-3 pl-2 bg-[#DCE8EB] placeholder:text-slate-500 text-xl md:text-lg max-[640px]:w-full placeholder:pl-2 "
              />{" "}
              <span className="text-red-500 absolute ml-5 max-[640px]:absolute  max-[640px]:ml-[-390px] max-[640px]:mt-[29px] max-[280px]:relative max-[280px]:ml-[0px] max-[280px]:text-sm max-[280px]:bg-blue-300 max-[280px]:w-56">
                {errors.password?.message}
              </span>
              <div className="bg-black h-[1px]" />
            </div>
            <button
              type="submit"
              className="w-full h-16 bg-black text-white  font-bold text-2xl lg:mt-12 md:mt-5 md:text-xl max-[280px]:h-14 max-[280px]:text-xl max-[280px]:mt-[-50px]"
            >
              Login
            </button>
            <Link
              to="/registration"
              className="md:text-sm w-full mb-16 font-normal"
            >
              Registrieren
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
