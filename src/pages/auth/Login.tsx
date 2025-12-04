import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { isPasswordLengthValid } from "@/helpers";
import { useAuth } from "@/context";
import type { ILoginForm } from "@/interface";
import { INITIAL_LOGIN_FORM_DATA } from "@/configs";

export const Login = () => {
  const [formData, setFormData] = useState<ILoginForm>(INITIAL_LOGIN_FORM_DATA);

  const { login, loading } = useAuth();
  const [error, setError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (isPasswordLengthValid(formData.password) === false) {
      setError("Password must be at least 8 characters long");
      return;
    }

    try {
      await login(formData);
    } catch (error) {
      setError("Invalid username or password");
      console.log(error);
    }
  };

  return (
    <div className="h-[calc(100vh_-_130px)] flex justify-center items-center">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Tizimga kirish</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-6">
              {loading ? "Loading..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2 -mt-3">
          <Link to="/register" className="w-full">
            <Button variant="outline" className="w-full">
              Ro'yxatdan o'tish
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};
