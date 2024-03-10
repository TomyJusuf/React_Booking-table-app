import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { Inputs } from '../components/Login';

interface LoginResponse {
  success: boolean;
  message?: string;
}

const loginUser = async (data: Inputs): Promise<LoginResponse> => {
  try {
    const response = await axios.post(
      `https://deskbooking.dev.webundsoehne.com/api/users/login`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      const { token, refresh } = response.data;

      if (token && refresh) {
        localStorage.setItem('jwtToken', token);

        window.location.href = '/offices';
        return { success: true };
      } else {
        throw new Error('Invalid response format');
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const AxiosError = error as AxiosError;
      const { message }: any = AxiosError.response?.data;

      return {
        message: message,
        success: false,
      };
    }
  }

  // Add a default return statement in case no other return statement is executed
  return {
    message: 'An unexpected error occurred during login',
    success: false,
  };
};

export const useLoginUser = () =>
  useMutation((data: Inputs) => loginUser(data), {
    onSuccess(data) {
      data;
    },
  });
