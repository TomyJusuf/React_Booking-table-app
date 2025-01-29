import { Link } from 'react-router-dom'
import Navbar from './Navbar'
import { useEffect, useState } from 'react'

interface Favorite {
  id: string
  desk: {
    label: string
    equipment: string[]
    office: {
      name: string
    }
  }
}

const CustomModal = ({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) => (
  <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-700 bg-opacity-50 border-gray-300 shadow-2xl">
    <div className="max-w-md p-8 bg-white rounded-lg">
      <p className="text-center">{message}</p>
      <button
        onClick={onClose}
        className="w-full py-2 mt-12 text-white bg-black rounded-md"
      >
        OK
      </button>
    </div>
  </div>
)

export default function Favorites() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [showModal, setShowModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = localStorage.getItem('jwtToken')
        const baseUrl = 'https://deskbooking.dev.webundsoehne.com'
        const profileResponse = await fetch(`${baseUrl}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        if (!profileResponse.ok) {
          throw new Error('Failed to fetch user profile')
        }

        const userProfile = await profileResponse.json()
        const userId = userProfile.id

        const favoritesResponse = await fetch(
          `${baseUrl}/api/favourites/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
            },
          }
        )
        if (!favoritesResponse.ok) {
          throw new Error('Failed to fetch user favorites')
        }

        const favoritesData = await favoritesResponse.json()

        const extractedFavorites = favoritesData.map((favorite: any) => ({
          id: favorite.id,
          desk: {
            label: favorite.desk.label,
            equipment: favorite.desk.equipment,
            office: {
              name: favorite.desk.office.name,
            },
          },
        }))

        setFavorites(extractedFavorites)
      } catch (error) {
        setModalMessage('Fehler: erhalte keine Daten')
        setShowModal(true)
      }
    }
    fetchData()
  }, [])

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const jwtToken = localStorage.getItem('jwtToken')
      const baseUrl = 'https://deskbooking.dev.webundsoehne.com'

      const response = await fetch(`${baseUrl}/api/favourites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })

      if (response.ok) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((favorite) => favorite.id !== favoriteId)
        )
        setModalMessage('Favorit erfolgreich entfernt')
        setShowModal(true)
      } else {
        alert('Fehler beim Entfernen des Favoriten')
        setModalMessage('Fehler beim Entfernen des Favoriten')
        setShowModal(true)
      }
    } catch (error) {
      alert('An error occurred')
      setModalMessage('Ein Fehler ist aufgetreten')
      setShowModal(true)
    }
  }

  return (
    <div className="flex flex-col items-center w-screen h-screen min-h-screen text-center bg-[#DCE8EB]">
      <Navbar />
      {showModal && (
        <CustomModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="bg-white rounded-xl w-[80%] h-screen flex flex-col justify-start items-center max-sm:flex-col overflow-y-auto mb-14">
        <h1 className="mb-7 mt-24 text-2xl font-bold">Favoriten</h1>
        <ul className="flex flex-col items-center w-full">
          {favorites.map((favorite) => (
            <div
              className="max-sm:flex-col flex items-center justify-around w-full border-b-2"
              key={favorite.id}
            >
              <ul className="flex flex-col items-center w-[40%] my-7">
                <li className="font-bold">{favorite.desk.office.name}</li>
                <li className="text-start my-4 font-semibold">
                  Equipment:
                  <ul className="font-normal">
                    {favorite.desk.equipment.map((item, index) => (
                      <li key={index}>
                        <span className="mr-2">&#10003;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
                <li>{favorite.desk.label}</li>
              </ul>

              <li className="flex flex-col justify-center items-center w-[40%] max-sm:w-full">
                <Link className="w-full" to="/deskdetails">
                  <button className="w-2/3 px-4 py-2 font-bold text-white bg-black rounded-md">
                    Reservieren
                  </button>
                </Link>
                <button
                  onClick={() => handleRemoveFavorite(favorite.id)}
                  className="max-sm:mb-7 w-2/3 px-4 py-2 mt-2 font-bold text-white bg-red-500 rounded-md"
                >
                  Favorit entfernen
                </button>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}
