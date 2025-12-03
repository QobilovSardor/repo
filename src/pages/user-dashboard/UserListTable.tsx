"use client";

import { useEffect, useState } from "react";
import { useStaffUsers } from "@/context/StaffUsers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, Edit2, Trash2 } from "lucide-react";

export const UserListTable = () => {
  const { staffUsers, loading, deleteUser, fetchUsers } = useStaffUsers();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = staffUsers?.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Staff Users List</CardTitle>

        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>

                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-3">
                    <button>
                      <Edit2 className="w-4" />
                    </button>
                    <button onClick={() => deleteUser(user.id)}>
                      <Trash2 className="w-4 text-red-500" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {!loading && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {loading && (
          <div className="text-center py-4 text-muted-foreground">
            Loading...
          </div>
        )}
      </CardContent>
    </Card>
  );
};
