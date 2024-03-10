import { DetailsDesk } from '../types/type';

type detail = {
  detailDesk: {};
};
type FixDesk = {
  createdAt: string;
  id: string;
  status: string;
  updatedAt: string;
  user: {
    firstname: string;
    lastname: string;
  };
};

const formatDate = (dateString: string) => {
  const dateObject = new Date(dateString);
  const day = ('0' + dateObject.getDate()).slice(-2);
  const month = ('0' + (dateObject.getMonth() + 1)).slice(-2);
  const year = dateObject.getFullYear();
  return `${day}/${month}/${year}`;
};

export default function ConvertTimeFixDesk({ detailDesk }: detail) {
  const formattedUpdatedAt = formatDate(
    (detailDesk as DetailsDesk).fixdesk.updatedAt
  );

  const formDate = () => {
    // Assuming dateString is the input date in "dd/mm/yyyy" format
    const dateString = formattedUpdatedAt;

    // Split the date string into day, month, and year
    const [day, month, year] = dateString.split('/');

    // Create a Date object using the provided values
    const dateObject = new Date(`${year}-${month}-${day}`);

    dateObject.setMonth(dateObject.getMonth() + 3);
    // Extract year, month, and day in YY/MM/DD format
    const yearFormatted = dateObject.getFullYear().toString().slice(-2);
    const monthFormatted = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    const dayFormatted = ('0' + dateObject.getDate()).slice(-2);

    // Formatted date in YY/MM/DD format
    const formattedDate = `${dayFormatted}/${monthFormatted}/${yearFormatted}`;

    return `${dateString} - ${formattedDate}`;
  };

  return (
    <div className="reservation_already_done flex flex-wrap    h-auto max-[639px]:w-full max-[639px]:mb-2 md:w-full sm:w-full max-[509px]:w-full max-[280px]:w-full ">
      {'fixdesk' in detailDesk && detailDesk.fixdesk !== null && (
        <div
          key={(detailDesk.fixdesk as FixDesk).id}
          className="  text-center py-3  flex flex-wrap border-white border-2 sm:w-full sm:flex-wrap  max-[639px]:w-full  max-[375px]:w-full max-[414px]:w-full max-[414px]:flex-wrap max-[430px]:w-full max-[506px]:w-full max-[389px]:w-1/3 max-[389px]:flex  max-[389px]:text-xs max-[280px]:w-full max-[360px]:justify-center max-[414px]:justify-center"
        >
          <h1 className="p-2  w-1/3 max-[388px]:w-1/2 max-[360px]:text-center max-[414px]:w-full">
            {(detailDesk.fixdesk as FixDesk).user?.firstname}{' '}
            {(detailDesk.fixdesk as FixDesk).user?.lastname}
          </h1>

          <h1 className="p-2 w-1/2 max-[389px]:w-full  max-[389px]:text-xs">
            {formDate()}
          </h1>
        </div>
      )}
    </div>
  );
}
