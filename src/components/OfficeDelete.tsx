import Navbar from './Navbar';
import { useForm } from 'react-hook-form';

import { useDeleteOffice } from '../hooks/useAdminOffices';
import { useEffect, useState } from 'react';
import { getAllOffices } from '../hooks/useOffices';
import { ID } from '../types/type';
import { DetailsDesk } from '../types/type';
export default function OfficeDelete() {
  const [allOffices, setAllOffices] = useState<DetailsDesk[]>();
  const { mutate } = useDeleteOffice();
  const { register, handleSubmit } = useForm<ID>({});

  const onSubmit = async (id: any) => {
    await mutate(id.id);
    const response = await getAllOffices();
    setAllOffices(response);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await getAllOffices();
      setAllOffices(response);
    };

    fetch();
  }, []);

  return (
    <>
      <Navbar />{' '}
      <div className="bg-[#DCE8EB] h-full max-[538px]:bg-[#DCE8EB] max-[455px]:h-screen">
        <div className="bg-white  h-auto flex-col flex-wrap justify-start max-w-[1350px] mx-auto rounded-3xl my-10  pt-16 md:w-[90%] sm:w-[80%] max-[639px]:w-[90%] max-[455px]:h-[100%] max-[455px]:bg-[#DCE8EB]  max-[408px]:justify-center ">
          <div className="w-full  justify-center font-bold text-5xl flex-row  flex items-center   max-[639px]:text-3xl ">
            Office delete
          </div>{' '}
          <div className="flex w-[80%] mx-auto h-auto  justify-center lg:gap-x-28 mt-[56px] md:w-[80%] md:gap-x-12 sm:gap-x-10 max-[639px]:gap-x-5 max-[639px]:justify-start max-[639px]:w-[50%] max-[455px]:flex-wrap max-[455px]:justify-center max-[455px]:w-full mb-16  max-[500px]:w-[70%] ">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-[450px] h-auto sm:w-72   max-[455px]:h-auto    sm:flex sm:flex-wrap sm:justify-start max-[500px]:w-full "
            >
              <label htmlFor="label" className="text-2xl font-thin ">
                Office name:*
              </label>
              <br />
              <div className="relative">
                <select
                  className=" w-96 py-3 my-2 border border-black pl-2 md:w-80 sm:w-full sm:py-2 max-[639px]:w-full max-[455px]:w-full max-[455px]:mx-auto max-[408px]:w-full "
                  {...register('id')}
                >
                  <option value="">Select an office</option>
                  {allOffices?.map((office: any) => {
                    return (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <br />

              <br />
              <button
                type="submit"
                className="bg-black mt-10 text-white font-bold px-12 py-2 w-64 text-xl shadow-lg shadow-slate-500 active:scale-[.9] sm:w-full max-[639px]:w-full max-[455px]:w-full max-[408px]:w-full mb-16 uppercase"
              >
                Delete office
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
