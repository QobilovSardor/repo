import { Title } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

export const UsersDashboard = () => {
  return (
    <div>
      <Title
        label="User Management Dashboard"
        icon={<Users className="w-8 h-8 text-blue-500" />}
      />
      {/*  */}
      <Card>
        <CardHeader>Register New Staff User</CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Usernmae</Label>
            <Input type="text" placeholder="Username (max 127, no space)" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Password (min 8, max 64, no space)"
            />
          </div>
          <div className="space-y-2">
            <Label>Usernmae</Label>
            <Input type="text" placeholder="First Name (required)" />
          </div>
          <div className="space-y-2">
            <Label>Usernmae</Label>
            <Input type="text" placeholder="Middle Name (optional)" />
          </div>
          <Button>Register Staff User</Button>
        </CardContent>
      </Card>

      {/* users list table */}
      <Card>
        <CardHeader>Register New Staff User</CardHeader>

      </Card>
    </div>
  );
};
