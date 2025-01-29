import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { getAllOffices } from '../hooks/useOffices'
import { usePostDesk } from '../hooks/useAdminDesks'

type NewDesk = {
  equipment: string[]
  label: string
  office: string
}

type EquipmentValues = string[]

export default function AdminDesks() {
  const { register, handleSubmit } = useForm<NewDesk>()
  const [deskData, setDeskData] = useState<NewDesk[]>([])
  const [equipmentValues, setEquipmentValues] = useState<EquipmentValues>([''])
  const [allOffices, setAllOffices] = useState([])
  const { mutate } = usePostDesk()

  const onSubmit: SubmitHandler<NewDesk> = async (data) => {
    try {
      const newDesk: NewDesk = {
        equipment: equipmentValues,
        label: data.label,
        office: data.office,
      }
      setDeskData([newDesk])
      mutate(newDesk)
      setEquipmentValues([''])
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleAddEquipment = () => {
    setEquipmentValues([...equipmentValues, ''])
  }

  const handleEquipmentChange = (index: number, value: string) => {
    const updatedEquipmentValues = [...equipmentValues]
    updatedEquipmentValues[index] = value
    setEquipmentValues(updatedEquipmentValues)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseAllOffice = await getAllOffices()
        setAllOffices(responseAllOffice)
      } catch (error: any) {
        throw new Error(error)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <div className="flex flex-col items-center w-screen h-full min-h-screen text-center bg-[#DCE8EB]">
        <Navbar />
        <div className="bg-white rounded-xl w-[80%] h-[85vh] mb-14 overflow-y-auto pb-12 flex flex-col justify-center items-center">
          <div className="bg-white  h-full flex-col flex-wrap justify-start max-w-[1350px] mx-auto rounded-3xl pt-16 md:w-[90%] sm:w-[80%] max-[639px]:w-[90%] max-[455px]:h-[100%] max-[455px]:bg-[#DCE8EB]  max-[408px]:justify-center top-96">
            <div className="w-full  justify-center font-bold text-5xl flex-row  flex items-center   max-[639px]:text-3xl">
              Desk hinzufügen
            </div>{' '}
            <div className="flex w-[80%] mx-auto h-auto  justify-center lg:gap-x-28 mt-[56px] md:w-[80%] md:gap-x-12 sm:gap-x-10 max-[639px]:gap-x-5 max-[639px]:justify-start max-[639px]:w-[90%] max-[455px]:flex-wrap max-[455px]:justify-center  mb-16">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-[450px] h-auto sm:w-80   max-[455px]:h-auto "
              >
                <label htmlFor="deskNumber" className="text-2xl font-bold">
                  Tischname:
                </label>
                <br />
                <input
                  type="text"
                  id="deskNumber"
                  className="w-96 py-3 my-2 border border-black pl-2 md:w-80 sm:w-60 sm:py-2 max-[639px]:w-60 max-[455px]:w-96 max-[455px]:mx-auto max-[408px]:w-full"
                  {...register('label')}
                />

                <br />
                <label htmlFor="office" className="text-2xl font-bold">
                  Office:
                </label>
                <br />
                <select
                  id="office"
                  {...register('office')}
                  className="w-96 py-3 my-2 border border-black placeholder:bg-white bg-white md:w-80 sm:w-60 sm:py-3 max-[639px]:w-60 max-[455px]:w-96 max-[408px]:w-full "
                >
                  {allOffices.map((office: any) => {
                    return (
                      <option key={office.id} value={office.id}>
                        {office.name}
                      </option>
                    )
                  })}
                </select>

                <br />
                <div className="equipment_body flex flex-wrap mt-5">
                  <label className="w-full text-2xl font-bold">
                    Equipment:
                  </label>
                  {equipmentValues.map((value, index) => (
                    <div key={index}>
                      <input
                        type="text"
                        className="border-black  border w-96 py-2 my-2 placeholder:pl-2 pl-2 font-bold text-xl md:w-80 sm:w-60 sm:py-2 sm:text-lg sm:placeholder:font-medium max-[639px]:w-60 max-[455px]:w-96 max-[408px]:w-full "
                        placeholder="Equipment ?"
                        value={value}
                        onChange={(e) =>
                          handleEquipmentChange(index, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <button type="button" onClick={handleAddEquipment}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="h-7 w-10"
                    >
                      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                    </svg>
                  </button>{' '}
                </div>
                <br />

                <button
                  type="submit"
                  className="bg-black text-white font-bold px-12 py-2 w-64 text-xl shadow-lg shadow-slate-500 active:scale-[.9] sm:w-60 max-[455px]:w-96 max-[408px]:w-full mb-16"
                >
                  Add deskt
                </button>
              </form>
              <div className="output  w-96 md:mt-2 sm:mt-5 max-[639px]:mt-4 max-[455px]:mt-1">
                {deskData.map((item) => {
                  return (
                    <div key={item.office} id={item.office}>
                      {item.equipment.map((equipment, equipmentIndex) => {
                        return (
                          <div
                            key={`${item.office}-${equipmentIndex}`}
                            className="equipment_text w-auto my-5"
                          >
                            <div className=" font-medium underline decoration-2 text-xl capitalize max-[455px]:text-center max-[455px]:font-light">
                              {equipment}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
