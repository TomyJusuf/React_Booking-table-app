export interface DetailsDesk {
  label: string;
  id: string;
  equipment: string[]; // Specify the type of elements in the array
  type: string;
  bookings: Array<{
    dateStart: string;
    dateEnd: string;
    id: string;
    user: { firstname: string; lastname: string };
    bookedAt: string;
  }>; // Specify the type of objects in the array

  office: {
    name: string;
    rows: string;
    columns: string;
  };
  fixdesk: {
    updatedAt: string;
    id: string;
  };
}

export type NewDesk = {
  name: string;
  columns: number;
  rows: number;
};

export type ID = {
  id: string;
  name: string;
};
