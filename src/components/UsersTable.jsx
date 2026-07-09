import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetUsers } from "@/hooks/users/useGetUsers";
import { getAvatarColor, getInitials } from "@/lib/avatarColor";
import { formatDate } from "@/lib/formatDate";

export function UsersTable({ search = "" }) {
  const { data: users, isLoading, isError } = useGetUsers();

  if (isLoading)
    return <p className="text-sm text-gray-500">Loading users...</p>;
  if (isError)
    return <p className="text-sm text-red-500">Failed to load users</p>;

  const filteredUsers = users.filter(
    (user) =>
      user.role === "Customer" &&
      user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="border rounded-2xl p-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email address</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500 py-6">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(user.name)}`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500">{user.email}</TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(user.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
