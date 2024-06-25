import { GetServerSideProps } from 'next';
import { authenticate } from '../utils/auth';
import { NextApiRequest } from 'next';
import Link from 'next/link';
import sequelize from '../utils/database';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Booking System</h1>
      <p>Please log in or register to book a slot or manage your meetings.</p>
      <Link href="/auth/login"> Login </Link>
      <Link href="/auth/register"> Register </Link>
    </div>
  );
};
// start the database connection
sequelize.sync();



// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const user = authenticate(context.req as NextApiRequest);

//   if (user) {
//     return {
//       redirect: {
//         destination: '/slots',
//         permanent: false,
//       },
//     };
//   }

//   return {
//     props: {},
//   };
// };

export default HomePage;
