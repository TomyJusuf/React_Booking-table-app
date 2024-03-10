import axios, { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import swal from 'sweetalert';

export type Data = {
  desk: string;
  dateStart: string;
  dateEnd: string;
};

// POST method
const jwtToken = localStorage.getItem('jwtToken');
const bookingPost = async (data: Data) => {
  try {
    const response = await axios.post(
      'https://deskbooking.dev.webundsoehne.com/api/bookings',
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
      return responseData;
    }
  } catch (error) {
    const AxiosError: unknown | any = error as AxiosError;
    // Log specific status codes
    if (AxiosError.response && AxiosError.response.status === 400) {
      swal(`	
Failed to create booking. The booking is either too long or is not in the valid range of 4 weeks`);
    }
    if (AxiosError.response && AxiosError.response.status === 406) {
      swal(`A Fixdesk booking exists for the desk.`);
    }
    if (AxiosError.response && AxiosError.response.status === 409) {
      swal(
        `The dates are intersecting with other bookings (either your own booking for another desk or other bookings for this desk).`
      );
    }

    throw new Error(AxiosError.response.status);
  }
};

// GET by ID
export const useBookingGetUser = async () => {
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
      `https://deskbooking.dev.webundsoehne.com/api/bookings/user/${userID}`,
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
    if (AxiosError.response && AxiosError.response.status === 400) {
      alert(`The Table have capacity maximal for 4 weeks`);
    }
    if (AxiosError.response && AxiosError.response.status === 406) {
      alert(`A Fixdesk booking exists for the desk.`);
    }
    if (AxiosError.response && AxiosError.response.status === 409) {
      alert(
        `The dates are intersecting with other bookings (either your own booking for another desk or other bookings for this desk).`
      );
    }

    throw new Error(AxiosError.response.status);
  }
};

// Delete method

const deleteUserBookings = async (id: string) => {
  try {
    await axios.delete(
      `https://deskbooking.dev.webundsoehne.com/api/bookings/${id}`,
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    swal('Deleted successfully');
  } catch (error) {}
};

export const useBookingDelete = () =>
  useMutation((data: string) => deleteUserBookings(data));

export const useBookingPost = () =>
  useMutation((data: Data) => bookingPost(data), {
    onSuccess() {
      swal('Booking created');
    },
  });
