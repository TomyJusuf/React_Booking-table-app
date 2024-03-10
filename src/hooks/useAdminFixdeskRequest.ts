import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
type Data = {
  id: string;
  status: string;
};
export const useFixdeskRequestGET = async () => {
  const jwtToken = localStorage.getItem('jwtToken');
  try {
    const response = await axios.get(
      'https://deskbooking.dev.webundsoehne.com/api/admin/fix-desk-requests',
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

    if (AxiosError.response.status === 401) {
      sweetAlert('Authentication not valid.');
    }
    if (AxiosError.response.status === 403) {
      sweetAlert(`	
The user associated with the userId you sent does not have permission to access this route.`);
    }
    throw new Error(AxiosError.message);
  }
};

export const fixdeskRequestPUT = async (data: Data) => {
  const jwtToken = localStorage.getItem('jwtToken');
  try {
    const response = await axios.put(
      'https://deskbooking.dev.webundsoehne.com/api/admin/fix-desk-requests',
      data,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      const responseData = response.data;

      sweetAlert('Data was ' + responseData.status);
      return responseData;
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    if (AxiosError.response.status === 401) {
      sweetAlert('Authentication not valid');
    }
    if (AxiosError.response.status === 403) {
      sweetAlert(
        `The user associated with the userId you sent does not have permission to access this route.`
      );
    }
    if (AxiosError.response.status === 404) {
      sweetAlert(' Not found');
    }

    throw new Error(AxiosError.message);
  }
};

export const useFixdeskRequestPUT = () => {
  return useMutation((data: Data) => fixdeskRequestPUT(data));
};
