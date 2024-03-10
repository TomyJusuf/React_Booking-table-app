import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { NewDesk } from '../types/type';
import swal from 'sweetalert';

const createOffice = async (data: NewDesk) => {
  const jwtToken = localStorage.getItem('jwtToken');
  try {
    const response = await axios.post(
      `https://deskbooking.dev.webundsoehne.com/api/admin/offices`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return(responseData);
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    if (AxiosError.response.status === 403) {
      swal('No permitions');
    }

    throw new Error(AxiosError);
  }
};

const deleteOffice = async (id: string) => {
  const jwtToken = localStorage.getItem('jwtToken');
  try {
    const response = await axios.delete(
      `https://deskbooking.dev.webundsoehne.com/api/admin/offices/${id}`,

      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );

    if (response.status === 200) {
      const responseData = response.data;
      return(responseData)
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    if (AxiosError.response.status === 403) {
      swal('No permitions');
    }

    throw new Error(AxiosError);
  }
};
export const useDeleteOffice = () =>
  useMutation((id: string) => deleteOffice(id), {
    onSuccess() {
      swal('Office successfully deleted !');
    },
    onError() {
      swal('Please choise a Office');
    },
  });

export const useCreateOffice = () =>
  useMutation((data: NewDesk) => createOffice(data), {
    onSuccess() {
      swal('Office successfully created !');
    },
  });
