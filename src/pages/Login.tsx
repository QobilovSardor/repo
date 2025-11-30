import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserData, login } from "@/api/auth";
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
import { PATHS, USER_ROLES } from "@/configs/constants";
import { useUser } from "@/context/UserContext";

interface LoginForm {
  username: string;
  password: string;
}

export const Login = () => {
  const [formData, setFormData] = useState<LoginForm>({
    username: "admin",
    password: "87654321",
  });
  const navigate = useNavigate();
  const { setUser } = useUser();

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

    try {
      await login(formData);
      const res = await getUserData();
      const userRole = res?.data?.payload?.userRole;
      setUser(res?.data?.payload);
      switch (userRole) {
        case USER_ROLES.ADMIN:
          navigate(PATHS.ADMIN);
          break;
        // case USER_ROLES.STAFF:
        //   navigate(PATHS.STAFF);
        //   break;
        // case USER_ROLES.AUTHOR:
        //   navigate(PATHS.AUTHOR);
        //   break;
        default:
          navigate(PATHS.USER);
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid username or password");
    }
  };
  return (
    <div className="h-[calc(100vh_-_65px)] flex justify-center items-center">
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
              Kirish
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
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
