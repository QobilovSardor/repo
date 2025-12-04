import toast, { Toaster } from "react-hot-toast";
import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
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
import { Lock, User, LogOut } from "lucide-react";
import { updatePassword } from "@/api/auth";
import { FormField, Title } from "@/components";
import { useAuth, useDepartments } from "@/context";
import { INITIAL_USER_FORM_DATA } from "@/configs/constants";
import { isPasswordLengthValid } from "@/helpers";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IUser } from "@/interface";
import axios from "axios";

export const Profile = () => {
  const { updateProfileFunc } = useAuth();
  const { logout, user } = useAuth();
  const { departments } = useDepartments();
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [formData, setFormData] = useState(INITIAL_USER_FORM_DATA);
  const [loading, setLoading] = useState<boolean>(false);

  const allFieldsEmpty = useMemo(
    () => Object.values(formData).every((v) => v === "" || v === null),
    [formData]
  );

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

    if (!isPasswordLengthValid(passwordData.newPassword)) {
      console.log(passwordData.newPassword);
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (allFieldsEmpty) return;

    setLoading(true);
    try {
      setLoading(false);
      await updatePassword(passwordData);
      toast.success("Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data?.code === 2006) {
          toast.error("Wrong password");
        } else {
          toast.error(err.response?.data?.message || "Password error");
        }
      } else {
        toast.error("Unexpected error");
      }

      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (allFieldsEmpty) return;

    setLoading(true);
    try {
      const changedEntries = Object.entries(formData).filter(
        ([, v]) => v !== "" && v !== null && v !== undefined
      );
      const changedPayload = Object.fromEntries(
        changedEntries
      ) as Partial<IUser>;

      const payloadToSend = {
        ...(user ?? {}),
        ...changedPayload,
      } as Partial<IUser>;

      await updateProfileFunc(payloadToSend as unknown as IUser);
      toast.success("Profile updated successfully!");
      setFormData(INITIAL_USER_FORM_DATA);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while updating your profile!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-8">
        <div className="mb-8 flex items-center justify-between">
          <Title
            label="Account Settings"
            subTitle="Manage your profile information and security settings"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border border-border shadow-lg pt-0 lg:col-span-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    id="firstName"
                    label="First name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder={user?.firstName}
                  />
                  <FormField
                    id="lastName"
                    label="Last name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder={user?.lastName}
                  />

                  <div className="flex flex-col gap-2 select-box">
                    <Label
                      htmlFor="departmentId"
                      className="text-sm font-medium"
                    >
                      Department (Optional)
                    </Label>
                    <Select
                      onValueChange={(val) =>
                        setFormData((prev) => ({ ...prev, departmentId: val }))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Department (Optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Department (Optional)</SelectLabel>
                          {departments?.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.nameUz}
                            >
                              {department.nameUz}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <FormField
                    id="hemisId"
                    label="Hemis ID (Optional)"
                    name="hemisId"
                    value={formData.hemisId}
                    onChange={handleChange}
                    placeholder={user?.hemisId}
                  />

                  <FormField
                    id="orcid"
                    label="ORCID (XXXX-XXXX-XXXX-XXXX) (Optional)"
                    name="orcid"
                    value={formData.orcid}
                    onChange={handleChange}
                    placeholder="ORCID (XXXX-XXXX-XXXX-XXXX) (Optional)"
                  />

                  <FormField
                    id="ror"
                    label="ROR (0xxxxxxXX) (Optional)"
                    name="ror"
                    value={formData.ror}
                    onChange={handleChange}
                    placeholder="ROR (0xxxxxxXX) (Optional)"
                  />

                  <FormField
                    id="middleName"
                    label="Middle name"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    maxLength={63}
                    placeholder={user?.middleName}
                    className="col-span-2"
                  />
                </div>

                <div className="flex justify-between gap-1 flex-wrap">
                  <Button type="submit" disabled={allFieldsEmpty}>
                    {loading ? "Loading..." : "Save Profile Changes"}
                  </Button>
                  <Button onClick={logout} variant="destructive" type="button">
                    Log out
                    <LogOut />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

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
                  {loading ? "Loading..." : "Update Password"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
