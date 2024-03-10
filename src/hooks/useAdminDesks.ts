import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import swal from 'sweetalert';
type Inputs = {
  equipment: string[];
  label: string;
  office: string;
  // Add other properties as needed
};

// POST - ONLY WITH ADMIN TOKEN
const postDesks = async (data: Inputs) => {
  const jwtToken = localStorage.getItem('jwtToken');

  try {
    const response = await axios.post(
      `https://deskbooking.dev.webundsoehne.com/api/admin/desks`,
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
      return(responseData)
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    if (AxiosError.response.status === 403) {
      swal(
        'The user associated with the userId sent does not have permission to access this route.'
      );
    }
    throw new Error(AxiosError);
  }
};
export const usePostDesk = () => useMutation((data: Inputs) => postDesks(data));
