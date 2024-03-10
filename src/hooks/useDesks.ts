import axios, { AxiosError } from 'axios';

// GET
export const getDesks = async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  try {
    const response = await axios.get(
      `https://deskbooking.dev.webundsoehne.com/api/desks`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData;
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    throw new Error(AxiosError);
  }
};

// GET BY ID
export const getDesksById = async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  const id = localStorage.getItem('selectedDeskId');

  try {
    const response = await axios.get(
      `https://deskbooking.dev.webundsoehne.com/api/desks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return responseData;
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    throw new Error(AxiosError);
  }
};
