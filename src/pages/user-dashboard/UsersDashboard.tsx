// src/app/admin/users/UsersDashboard.tsx
"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Users, Plus, X } from "lucide-react";

import { useStaffUsers } from "@/context/StaffUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { UserListTable } from "./UserListTable";
import { useDepartments } from "@/context/DepartmentContext";

export function UsersDashboard() {
  const { loading, error, successMessage, createUser, clearMessages } =
    useStaffUsers();
  const { departments, fetchDepartments } = useDepartments();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    middleName: "",
    departmentId: 0,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (value: string) => {
    setFormData({ ...formData, departmentId: Number(value) });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    await createUser(formData);

    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      middleName: "",
      departmentId: 0,
    });

    setSubmitting(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">User Management Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Manage staff system users
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-100 rounded  flex items-center gap-2 justify-between">
          {successMessage}
          <button onClick={clearMessages}>
            <X />
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 rounded flex items-center gap-2 justify-between">
          {error}
          <button onClick={clearMessages}>
            <X />
          </button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Register New Staff User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                minLength={8}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label>Middle Name</Label>
              <Input
                name="middleName"
                value={formData.middleName}
                onChange={handleInputChange}
              />
            </div>

            <div className="select-box space-y-2">
              <Label>Select Department</Label>
              <Select onValueChange={handleDepartmentChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.length > 0 ? (
                    departments.map((dep) => (
                      <SelectItem key={dep.id} value={String(dep.id)}>
                        {dep.nameUz} ({dep.depType})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="0" disabled>
                      No departments found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-fit"
              disabled={loading || submitting}
            >
              <Plus className="mr-2 w-4" />
              Register Staff User
            </Button>
          </form>
        </CardContent>
      </Card>

      <UserListTable />
    </div>
  );
}
