import axios, { AxiosError } from 'axios';

export const getAllOffices = async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  try {
    const response = await axios.get(
      'https://deskbooking.dev.webundsoehne.com/api/offices/',
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    throw new Error(AxiosError);
  }
};
export const getAllOfficesById = async () => {
  const id = 'here put some ID of offices';
  const jwtToken = localStorage.getItem('jwtToken');
  try {
    const response = await axios.get(
      `https://deskbooking.dev.webundsoehne.com/api/offices/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.status == 200) {
      return response.data;
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    throw new Error(AxiosError);
  }
};
