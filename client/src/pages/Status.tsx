import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services/userService";
import Table from "../components/Table";
import TableHead from "../components/TableHead";
import TableCell from "../components/TableCell";

interface User {
  firstName: string;
  lastName: string;
  phone: string;
}

export default function Status() {
  const users = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <main className="max-w-screen-lg mx-auto">
      <Table>
        <TableHead>
          <tr>
            <TableCell head>Name</TableCell>
            <TableCell head>Phone</TableCell>
            <TableCell head>Seat</TableCell>
          </tr>
        </TableHead>
        <tbody>
          {users.data?.map((user, index) => (
            <tr key={index}>
              <TableCell>
                {user.firstName} {user.lastName}
              </TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell></TableCell>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}
