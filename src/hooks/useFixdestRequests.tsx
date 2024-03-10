import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';

import swal from 'sweetalert';

type Data = {
  data: string;
};
const jwtToken = localStorage.getItem('jwtToken');

const fixDeskRequestPOST = async (data: Data) => {
  console.log(data);
  try {
    const response = await axios.post(
      `https://deskbooking.dev.webundsoehne.com/api/fixdesk-requests`,
      data,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 200) {
      return swal('Request Fixdesk sended!');
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;

    if (AxiosError.response.status === 409) {
      swal(AxiosError.response.data.message);
    }
  }
};

// GET by ID
export const fixDeskRequestGetById = async () => {
  let userID;
  const extractUserIdFromToken = (token: string | null) => {
    if (!token) {
      return null;
    }
    const tokenParts = token.split('.');
    // if token dont include signature
    if (tokenParts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(atob(tokenParts[1]));
    // Log the decoded payload
    const userId = payload.id;
    return userId;
  };
  const tokenUserId = extractUserIdFromToken(jwtToken);
  if (tokenUserId) {
    userID = tokenUserId;
  }
  try {
    const response = await axios.get(
      `https://deskbooking.dev.webundsoehne.com/api/fixdesk-requests/user/${userID}`,
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
    // Log specific status codes
    if (AxiosError.response && AxiosError.response.status === 401) {
      alert(`	
Authentication not valid.`);
    }
    if (AxiosError.response && AxiosError.response.status === 403) {
      alert(`The userIds in the JWT and the request don't match.`);
    }
    if (AxiosError.response && AxiosError.response.status === 404) {
      alert(
        `	
User with the given id not found.`
      );
    }

    throw new Error(AxiosError.response.status);
  }
};

// Delete by ID
const fixDeskRequestDelete = async (id: string) => {
  try {
    await axios.delete(
      `https://deskbooking.dev.webundsoehne.com/api/fixdesk-requests/${id}`,

      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    swal('Deleted successfully');
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    if (AxiosError.status === 409) {
      // swal('User has already created a fixdesk request.');
    }
  }
};
export const useFixdeskRequestDelete = () =>
  useMutation((id: string) => fixDeskRequestDelete(id));

export const useFixdeskRequest = () =>
  useMutation((data: Data) => fixDeskRequestPOST(data));
