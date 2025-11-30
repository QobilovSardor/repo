"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Users, Search, Plus, Trash2, Edit2 } from "lucide-react";
import { useStaffUsers } from "@/context/StaffUsers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function UsersDashboard() {
  const {
    staffUsers,
    loading,
    error,
    successMessage,
    createUser,
    deleteUser,
    clearMessages,
  } = useStaffUsers();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    departmentId: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, departmentId: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await createUser({
        username: formData.username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
        departmentId: formData.departmentId,
      });

      setFormData({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        middleName: "",
        departmentId: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }
    await deleteUser(userId);
  };

  const handleEditUser = (userId: number) => {
    // TODO: Edit modal yoki sahifani ochish
    console.log("Edit user:", userId);
  };

  const filteredUsers = staffUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              User Management Dashboard
            </h1>
            <p className="text-muted-foreground text-sm">
              Register and manage staff users
            </p>
          </div>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200 flex justify-between items-center">
            <span>{successMessage}</span>
            <button
              onClick={clearMessages}
              className="text-sm font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearMessages}
              className="text-sm font-medium hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Registration Form */}
        <Card className="border border-border/50 shadow-lg pt-0 overflow-hidden">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent pt-6">
            <div className="flex items-center gap-2">
              <div>
                <CardTitle>Register New Staff User</CardTitle>
                <CardDescription>
                  Add a new staff member to the system
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Username (max 127, no space)"
                    value={formData.username}
                    onChange={handleInputChange}
                    maxLength={127}
                    required
                    disabled={submitting || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Password (min 8, max 64, no space)"
                    value={formData.password}
                    onChange={handleInputChange}
                    maxLength={64}
                    required
                    disabled={submitting || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First Name (required)"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={submitting || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last Name (required)"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={submitting || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="middleName" className="text-sm font-medium">
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    type="text"
                    placeholder="Middle Name (optional)"
                    value={formData.middleName}
                    onChange={handleInputChange}
                    disabled={submitting || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departmentId" className="text-sm font-medium">
                    Select department
                  </Label>
                  <Select
                    value={formData.departmentId}
                    onValueChange={handleDepartmentChange}
                    disabled={submitting || loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Department 1 (ID: 1)</SelectItem>
                        <SelectItem value="2">Department 2 (ID: 2)</SelectItem>
                        <SelectItem value="3">Department 3 (ID: 3)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                disabled={submitting || loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                {submitting ? "Registering..." : "Register Staff User"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Users List Table */}
        <Card className="border border-border/50 shadow-lg pt-0 overflow-hidden gap-0">
          <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Staff Users List
                  {loading && (
                    <span className="text-sm text-muted-foreground ml-2">
                      (Loading...)
                    </span>
                  )}
                </CardTitle>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/50 bg-muted/30">
                    <TableHead className="px-6 py-3 text-left text-sm font-semibold">
                      ID
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-sm font-semibold">
                      Username
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-sm font-semibold">
                      Full Name
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-sm font-semibold">
                      Role
                    </TableHead>
                    <TableHead className="px-6 py-3 text-left text-sm font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="px-6 py-3 text-center text-sm font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-border/30 hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                        {user.id}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm font-medium">
                        {user.username}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {user.firstName} {user.lastName} {user.middleName}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                              : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-1.5 rounded-md hover:bg-muted transition-colors"
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit2 className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 text-muted-foreground hover:text-red-600 dark:hover:text-red-400" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No staff users found</p>
              </div>
            )}

            {loading && staffUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading users...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
