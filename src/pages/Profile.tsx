"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import { Lock, User, Hash } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { updatePassword } from "@/api/auth";
import type { IUser } from "@/interface/user";

const ORCID_REGEX = /\d{4}-\d{4}-\d{4}-\d{4}/;
const ROR_REGEX = /0\d{7}[A-Z]{2}/;

export const Profile = () => {
  const { user, updateUser } = useUser();

  const fields = [
    {
      id: "firstName",
      label: "First Name",
      type: "text",
      name: "firstName",
      maxLength: 63,
      required: true,
      placeholder: user?.firstName,
      icon: User,
    },
    {
      id: "lastName",
      label: "Last Name",
      type: "text",
      name: "lastName",
      maxLength: 63,
      required: true,
      placeholder: user?.lastName,
      icon: User,
    },
    {
      id: "middleName",
      label: "Middle Name (Optional)",
      type: "text",
      name: "middleName",
      maxLength: 63,
      placeholder: user?.middleName,
      fullWidth: true,
    },
    {
      id: "hemisId",
      label: "Hemis ID (Optional)",
      type: "text",
      name: "hemisId",
      maxLength: 31,
      placeholder: "HEM-12345",
      icon: Hash,
    },
    {
      id: "departmentId",
      label: "Department (Optional)",
      type: "select",
      name: "departmentId",
      placeholder: "Select Department",
    },
    {
      id: "orcid",
      label: "ORCID (XXXX-XXXX-XXXX-XXXX)",
      type: "text",
      name: "orcid",
      maxLength: 19,
      pattern: ORCID_REGEX.source,
      title: "Format: XXXX-XXXX-XXXX-XXXX",
      placeholder: "0000-0000-0000-0000",
    },
    {
      id: "ror",
      label: "ROR (0xxxxxxXX)",
      type: "text",
      name: "ror",
      maxLength: 9,
      pattern: ROR_REGEX.source,
      title: "Format: 0xxxxxxXX (9 chars total)",
      placeholder: "012345678",
    },
  ];
  const initialState = fields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {} as Record<string, string>);

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [formData, setFormData] = useState(initialState);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (passwordData.newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters long");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    try {
      const res = await updatePassword(passwordData);
      console.log(res);
      setSuccessMessage("Password updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      setErrorMessage("Password error");
      setTimeout(() => setErrorMessage(""), 3000);
      console.log(error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    const payload: Partial<IUser> = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        value.trim() || null,
      ])
    );

    try {
      await updateUser(payload);
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Account Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your profile information and security settings
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
          {successMessage}
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <div className="lg:col-span-2">
          <Card className="border border-border shadow-lg pt-0">
            <CardHeader className="border-b border-border pt-5 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal and professional details
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.slice(0, 2).map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <Label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                      </Label>
                      <div className="relative">
                        {field.icon && (
                          <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        )}
                        <Input
                          id={field.id}
                          name={field.name}
                          type={field.type}
                          value={formData[field.name]}
                          onChange={handleChange}
                          maxLength={field.maxLength}
                          placeholder={field.placeholder}
                          required={field.required}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Middle Name Full Width */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="middleName" className="text-sm font-medium">
                    {fields[2].label}
                  </Label>
                  <Input
                    id="middleName"
                    name="middleName"
                    type="text"
                    value={formData.middleName}
                    onChange={handleChange}
                    maxLength={63}
                    placeholder={fields[2].placeholder}
                  />
                </div>

                {/* Other Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Hemis ID */}
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="hemisId" className="text-sm font-medium">
                      {fields[3].label}
                    </Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="hemisId"
                        name="hemisId"
                        type="text"
                        value={formData.hemisId}
                        onChange={handleChange}
                        maxLength={31}
                        placeholder={fields[3].placeholder}
                        className="pl-9"
                      />
                    </div>
                  </div>

                  {/* Department */}
                  <div className="flex flex-col gap-2">
                    <Label
                      htmlFor="departmentId"
                      className="text-sm font-medium"
                    >
                      {fields[4].label}
                    </Label>
                    <select
                      id="departmentId"
                      name="departmentId"
                      value={formData.departmentId}
                      onChange={handleChange}
                      className="px-3 py-2 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">{fields[4].placeholder}</option>
                      <option value="dep1">Computer Science</option>
                      <option value="dep2">Engineering</option>
                      <option value="dep3">Business</option>
                    </select>
                  </div>
                </div>

                {/* ORCID and ROR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fields.slice(5, 7).map((field) => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <Label htmlFor={field.id} className="text-sm font-medium">
                        {field.label}
                      </Label>
                      <Input
                        id={field.id}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name]}
                        onChange={handleChange}
                        maxLength={field.maxLength}
                        placeholder={field.placeholder}
                        pattern={field.pattern}
                        title={field.title}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Password Card */}
        <div>
          <Card className="border border-border shadow-lg h-full pt-0 overflow-hidden">
            <CardHeader className="border-b border-border pt-5 bg-gradient-to-r from-primary/5 to-transparent">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">Security</CardTitle>
                  <CardDescription className="text-xs">
                    Update password
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="oldPassword" className="text-sm font-medium">
                    Current Password
                  </Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter current password"
                    minLength={8}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password"
                    minLength={8}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                >
                  Update Password
                </Button>
                {/* Success Message */}
                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-green-950/20 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200">
                    {errorMessage}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
