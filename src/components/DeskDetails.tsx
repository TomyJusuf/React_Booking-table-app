import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { getDesksById } from '../hooks/useDesks';
import { useForm } from 'react-hook-form';
import { useBookingPost } from '../hooks/useBooking';
import ConvertTimeFixDesk from './ConvertTimeFixDesk';
import { DetailsDesk } from '../types/type';
import { useFixdeskRequest } from '../hooks/useFixdestRequests';

const initialDetailsData: DetailsDesk = {
  label: '',
  id: '',
  equipment: [],
  type: '',
  bookings: [],

  office: {
    name: '',
    rows: '',
    columns: '',
  },
  fixdesk: {
    updatedAt: '',
    id: '',
  },
};

interface Daten {
  formattedDateTimeStart: string;
  formattedDateTimeEnd: string;
}

export default function DeskDetails() {
  const [detailDesk, setDetailDesk] = useState<DetailsDesk | {}>(
    initialDetailsData
  );
  const { register, handleSubmit } = useForm<Daten>();

  const { mutate: bookingMutate } = useBookingPost();
  const { mutate: fixRequest } = useFixdeskRequest();

  const onSubmit = async (data: Daten) => {
    try {
      const dateStart = `${data.formattedDateTimeStart}T00:00:00.000Z`;
      const dateEnd = `${data.formattedDateTimeEnd}T00:00:00.000Z`;
      const deskId = (detailDesk as DetailsDesk).id;

      await bookingMutate({ desk: deskId, dateStart, dateEnd });
      const response = await getDesksById();
      setDetailDesk(response);
    } catch (error) {}
  };

  const fixdeskRequest = () => {
    const deskId = (detailDesk as DetailsDesk).id;
    const desk: any = {
      desk: deskId,
    };

    fixRequest(desk);
  };

  useEffect(() => {
    const fetch = async () => {
      const response = await getDesksById();
      setDetailDesk(response);
    };
    fetch();
  }, [onSubmit]);

  useEffect(() => {
    const fetch = async () => {
      const response = await getDesksById();
      setDetailDesk(response);
    };
    fetch();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center  w-screen h-full min-h-screen text-center bg-[#DCE8EB]">
        <Navbar />
        <div className="bg-white  rounded-xl w-[80%] h-screen mb-14  flex justify-center items-center overflow-y-auto  ">
          <div className="  flex flex-row  justify-between items-center   xl:min-w-[1000px] mx-auto  md:rounded-3xl h-auto mb-16 lg:w-[95%] md:w-[90%] max-[639px]:mb-0 max-[430px]:pb-10 max-[390px]:pb-0 max-[414px]:pb-0 sm:mt-6 sm:top-12 sm:relative mt-[-66px]  ">
            <div className="h-screen equipment_and_booking_time flex mx-auto justify-center items-center flex-wrap w-[100%]  sm:mx-auto max-[639px]:mx-auto  ">
              {/* EQUIPMENT */}
              <div className="w-[98%]   justify-center items-center mx-auto mb-12 xl:w-[87%] max-[639px]:mt-16 max-[639px]:w-full max-[639px]:mx-auto  max-[250px]:flex max-[250px]:flex-wrap ">
                <h1 className="w-full mb-6 lg:mt-6  xl:mt-0 h-1 text-3xl font-bold xl:ml-20 lg:ml-20 md:ml-10 sm:ml-10 max-[639px]:font-normal  max-[639px]:pl-5   max-[303px]:text-2xl  max-[250px]:text-xl  text-center">
                  Office {(detailDesk as DetailsDesk).office.name}
                </h1>{' '}
              </div>
              <div className="xl:w-96 h-1/5   mb-56 lg:w-96 md:w-full md:flex lg:h-96 md:h-0  md:ml-10 sm:flex sm:justify-between sm:w-full sm:ml-10  sm:h-10 max-[639px]:flex max-[639px]:mb-16 max-[639px]:w-full max-[371px]:mb-28 ">
                <div className="tish  w-full flex  flex-wrap justify-center items-center  lg:w-96  md:w-72  sm:w-72 sm:h-1/5 max-[639px]:w-1/2 max-[639px]:flex">
                  <div className=" w-full  h-96 md:h-36 lg:h-96   sm:h-52 max-[639px]:w-[90%] max-[639px]:h-28  ">
                    {'fixdesk' in detailDesk && detailDesk.fixdesk === null ? (
                      <div className="table_flex_fix flex flex-wrap justify-center w-full h-full text-center">
                        <div className="bg-slate-500 h-1/2 flex items-center justify-center w-full">
                          <h1 className="w-full mb-6 mt-[5px]  h-1 text-2xl font-bold text-white  uppercase ">
                            <em>{'label' in detailDesk && detailDesk.label}</em>
                          </h1>{' '}
                        </div>
                        <div className="h-[5px] bg-orange-400 w-full"></div>
                        <div className="h-1/2 flex items-center justify-center w-full bg-green-300">
                          <h3 className="uppercase text-4xl font-bold text-slate-600 md:text-3xl md:font-medium max-[639px]:text-lg">
                            {'type' in detailDesk && detailDesk.type
                              ? `${detailDesk.type} desk`
                              : ''}
                          </h3>
                        </div>
                        <div className="Fixdesk_request_body text-xl flex flex-col justify-center items-center  w-full max-[446px]:text-lg max-[402px]:text-sm">
                          <h1>Fixdesk reservieren ?</h1>
                          <button
                            type="button"
                            className="w-full px-10 py-2 text-white bg-black"
                            onClick={() => fixdeskRequest()}
                          >
                            Fixdesk
                          </button>{' '}
                        </div>
                      </div>
                    ) : (
                      <div className="table_flex_fix   text-center flex  flex-wrap w-full h-full justify-center md:w-full sm:w-72 sm:justify-between max-[639px]:w-full">
                        <div className="bg-slate-500 h-1/2 sm:w-full flex items-center justify-center w-full">
                          <h1 className=" uppercase text-yellow-400 font-bold text-4xl md:text-3xl md:font-medium max-[639px]:text-lg">
                            Tisch
                          </h1>
                        </div>
                        <div className="h-[5px] bg-yellow-300 w-full"></div>
                        <div className="h-1/2 flex items-center justify-center w-full bg-red-400">
                          <h3 className="uppercase text-4xl font-bold text-white md:text-3xl md:font-medium max-[639px]:text-lg">
                            Fix
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>{' '}
              </div>
              <div className="reservation_table w-[50%] mt-7 flex flex-wrap gap-y-10  mb-16 lg:mt-0 lg:w-[50%] md:w-[90%] sm:w-[90%] max-[639px]:w-[95%] max-[639px]:gap-y-0 max-[639px]:mb-7 ">
                {' '}
                {'fixdesk' in detailDesk && detailDesk.fixdesk !== null ? (
                  <ConvertTimeFixDesk detailDesk={detailDesk} />
                ) : (
                  <div className="reservation_already_done flex flex-wrap w-auto  h-auto max-[639px]:mb-2 md:w-full sm:w-full max-[509px]:w-full">
                    <div className="reservation_already_done flex flex-wrap w-full">
                      {(detailDesk as DetailsDesk).bookings &&
                        Array.isArray((detailDesk as DetailsDesk).bookings) &&
                        (detailDesk as DetailsDesk).bookings.map(
                          (item, index) => {
                            const { dateStart, dateEnd } = item;

                            const dateObject = new Date(dateStart);
                            const dateObjectEnd = new Date(dateEnd);
                            // Extracting year, month, and day - START
                            const yearStart = dateObject
                              .getFullYear()
                              .toString()
                              .slice(-2);
                            // Get the last two digits of the yearStart
                            const monthStart: string = (
                              '0' +
                              (dateObject.getMonth() + 1)
                            ).slice(-2);
                            // Months are zero-indexed
                            const dayStart: string = (
                              '0' + dateObject.getDate()
                            ).slice(-2);

                            // Months are zero-indexed
                            const dayEnd: string = (
                              '0' + dateObjectEnd.getDate()
                            ).slice(-2);
                            // Extracting year, month, and day - END
                            const yearEnd: string = dateObjectEnd
                              .getFullYear()
                              .toString()
                              .slice(-2); // Get the last two digits of the yearStart
                            const monthEnd: string = (
                              '0' +
                              (dateObjectEnd.getMonth() + 1)
                            ).slice(-2);

                            // BOX TABLE RESERVED
                            return (
                              <div
                                key={index}
                                className="w-auto text-center py-3 rounded-lg flex flex-wrap border-white border-2 md:w-1/3 sm:w-full  max-[639px]:w-full max-[280px]:w-full max-[375px]:w-full max-[414px]:w-full max-[430px]:w-full "
                              >
                                <h1 className="text-center py-2 font-light text-black bg-red-500 h-10 text-lg md:text-xl w-full  max-[430px]:h-8 max-[390px]:text-sm max-[390px]:font-normal max-[390px]:h-7 max-[280px]:text-normal">
                                  reserviert
                                </h1>
                                <div className="title flex justify-evenly w-full bg-red-500 py-2 text-slate-100 font-light max-[639px]:text-sm max-[390px]:text-xs max-[280px]:text-[13px] max-[412px]:text-[13px] ">
                                  <h3 className="">
                                    {dayStart}/{monthStart}/{yearStart}
                                  </h3>
                                  <div className="">-</div>
                                  <h3 className="">
                                    {dayEnd}/{monthEnd}/{yearEnd}
                                  </h3>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  </div>
                )}
                {/* RESERVATION */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="reservation_future  flex  items-end w-[100%] justify-between
          mt-1 max-[639px]:w-full max-[390px]:text-sm max-[430px]:mt-10 max-[280px]:flex max-[280px]:flex-wrap max-[280px]:gap-y-5 max-[480px]:flex   max-[480px]:flex-wrap  max-[480px]:gap-y-5"
                >
                  <div className="reservieren_von w-[32.8%] max-[480px]:w-full max-[280px]:w-full">
                    <label htmlFor="" className="text-slate-600 font-medium">
                      Reservieren von:
                    </label>
                    <input
                      type="date"
                      data-date-format="dd mm yyy"
                      {...register('formattedDateTimeStart')}
                      placeholder="dd-mm-yyyy"
                      className="w-[100%]  placeholder:text-center text-center h-10 bg-[#DCE8EB] placeholder:text-black placeholder:font-thin"
                    />
                  </div>
                  <div className="reservieren_bis w-[32.8%] max-[480px]:w-full max-[280px]:w-full ">
                    <label htmlFor="" className="text-slate-600 font-medium">
                      Reservieren bis:
                    </label>

                    <input
                      type="date"
                      data-date-format="DD MM YYYY"
                      {...register('formattedDateTimeEnd')}
                      placeholder="dd-mm-yyyy"
                      className="w-[100%] placeholder:text-center text-center placeholder:text-black placeholder:font-thin h-10  bg-[#DCE8EB]"
                    />
                  </div>
                  <button
                    type="submit"
                    className=" bg-slate-700 text-white w-[30%]  max-[480px]:w-full h-10 font-bold max-[280px]:w-full "
                  >
                    Reservieren
                  </button>{' '}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
