import User from '../../models/User';
import dbConnect from '../../utils/dbConnect';

export default function Users({ users }) {
  return (
    <div>
      <h2>Users</h2>
    </div>
  );
}
export async function getServerSideProps() {
  await dbConnect.connect();
  const users = await User.find({}).lean();
  await dbConnect.disconnect();

  return {
    props: {
      users: users.map(dbConnect.convertDocToObj),
    },
  };
}
