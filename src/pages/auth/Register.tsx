import { FormField } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INITIAL_USER_FORM_DATA, PATHS } from "@/configs";
import { useAuth, useDepartments } from "@/context";
import type { IUser } from "@/interface";
import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";

export const Register = () => {
  const [formData, setFormData] = useState<IUser>(INITIAL_USER_FORM_DATA);
  const { departments } = useDepartments();
  const { loading, register, authError } = useAuth();
  const [error, setError] = useState<string>("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = (value: string) => {
    setFormData((prev) => ({ ...prev, departmentId: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // if (!isPasswordLengthValid(formData.password)) {
    //   setError("Password must be at least 8 characters long");
    //   return;
    // }
    try {
      await register(formData);
      console.log("salom");
    } catch (error) {
      setError("Invalid username or password");
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Tizimga kirish</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {authError && (
              <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 border border-red-200">
                {authError}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div className="grid gap-4 grid-cols-2">
              <FormField
                id="firstName"
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
              />
              <FormField
                id="lastName"
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
              />
              <FormField
                id="middleName"
                label="Middle Name"
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Middle Name"
              />
              <FormField
                id="email"
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />

              <FormField
                id="hemisId"
                label="Hemis ID"
                name="hemisId"
                value={formData.hemisId}
                onChange={handleChange}
                placeholder="Hemis ID"
              />
              <FormField
                id="orcid"
                label="ORCID"
                name="orcid"
                value={formData.orcid}
                onChange={handleChange}
                placeholder="ORCID"
              />
              <FormField
                id="ror"
                label="ROR ID"
                name="ror"
                value={formData.ror}
                onChange={handleChange}
                placeholder="01tts0094"
              />
              <div className=" select-box mb-0">
                <Label className="text-sm font-medium block mb-2">
                  Select Department
                </Label>
                <Select
                  onValueChange={handleDepartmentChange}
                  value={String(formData.departmentId)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dep) => (
                      <SelectItem key={dep.id} value={String(dep.id)}>
                        {dep.nameUz} ({dep.depType})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full mt-4">
              {loading ? "Loading..." : "Submit"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 -mt-3">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to={PATHS.LOGIN}
              className="font-semibold text-primary hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};
