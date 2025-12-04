import { Title } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building, Plus } from "lucide-react";
import { useState } from "react";
import { DepartmentTable } from "./DepartmentTable";
import { useDepartments } from "@/context/department/useDepartment";

export const DepartmentDashboard = () => {
  const { departments, addDepartment, removeDepartment } =
    useDepartments();


  const [formData, setFormData] = useState({
    depType: "FACULTY",
    nameUz: "",
    nameEn: "",
    nameRu: "",
    isBlocked: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || null,
    }));
  };

  const handleSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      depType: value,
    }));
  };

  const handleCheckbox = (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isBlocked: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await addDepartment({
      depType: formData.depType,
      nameUz: formData.nameUz,
      nameEn: formData.nameEn || null,
      nameRu: formData.nameRu || null,
      isBlocked: formData.isBlocked,
    });

    // formni tozalash
    setFormData({
      depType: "FACULTY",
      nameUz: "",
      nameEn: "",
      nameRu: "",
      isBlocked: false,
    });
  };

  return (
    <div className="bg-gradient-to-br from-background via-background to-muted/20 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-primary/10">
          <Building className="w-8 h-8 text-primary" />
        </div>
        <Title label="Department Management Dashboard" />
      </div>

      <Card className="border border-border/50 shadow-lg pt-0 overflow-hidden">
        <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent pt-6">
          <div className="space-y-2">
            <CardTitle>Register New Department</CardTitle>
            <CardDescription>Create a new department</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Department type */}
              <div className="space-y-2 select-box">
                <Label>Select department</Label>
                <Select
                  required
                  value={formData.depType}
                  onValueChange={handleSelect}
                  defaultValue="FACULTY"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="FACULTY">FACULTY</SelectItem>
                      <SelectItem value="CONFERENCE">CONFERENCE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Name fields */}
              <div className="space-y-2">
                <Label>Name (UZ)</Label>
                <Input
                  name="nameUz"
                  value={formData.nameUz}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Name (EN)</Label>
                <Input
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Name (RU)</Label>
                <Input
                  name="nameRu"
                  value={formData.nameRu}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Blocked */}
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={formData.isBlocked}
                  onCheckedChange={handleCheckbox}
                />
                <Label>Is Blocked</Label>
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create Department
            </Button>
          </form>
        </CardContent>
      </Card>

      <DepartmentTable
        departments={departments}
        onEdit={(dep) => console.log("Edit:", dep)}
        onDelete={removeDepartment}
      />
    </div>
  );
};
