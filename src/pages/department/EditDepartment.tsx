import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IDepartment } from "@/interface";

interface EditDepartmentProps {
  openEditModal: boolean;
  setOpenEditModal: Dispatch<SetStateAction<boolean>>;
  selectedDep: IDepartment | null;
  onSave: (data: Partial<IDepartment>) => void;
}

export const EditDepartment: React.FC<EditDepartmentProps> = ({
  openEditModal,
  setOpenEditModal,
  selectedDep,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<IDepartment>>({
    depType: "FACULTY",
    nameUz: "",
    nameEn: "",
    nameRu: "",
    isBlocked: false,
  });

  const [originalData, setOriginalData] = useState<Partial<IDepartment>>({});

  useEffect(() => {
    if (selectedDep) {
      const initData = {
        depType: selectedDep.depType,
        nameUz: selectedDep.nameUz,
        nameEn: selectedDep.nameEn || "",
        nameRu: selectedDep.nameRu || "",
        isBlocked: selectedDep.isBlocked,
      };
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(initData);
      setOriginalData(initData);
    }
  }, [selectedDep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      depType: value,
    }));
  };

  const handleCheckbox = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isBlocked: checked,
    }));
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDep) return;

    onSave({
      ...formData,
      id: selectedDep.id,
    });

    setOpenEditModal(false);
  };
  const isFormUnchanged =
    JSON.stringify(formData) === JSON.stringify(originalData);

  return (
    <Dialog open={openEditModal} onOpenChange={setOpenEditModal}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
        </DialogHeader>

        <form className="space-y-6 mt-3" onSubmit={handleEditSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 select-box">
              <Label htmlFor="depType">Select department</Label>
              <Select
                required
                value={formData.depType || undefined}
                onValueChange={handleSelect}
              >
                <SelectTrigger id="depType">
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

            <div className="space-y-2">
              <Label htmlFor="nameUz">Name (UZ)</Label>
              <Input
                id="nameUz"
                name="nameUz"
                value={formData.nameUz || ""}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameEn">Name (EN)</Label>
              <Input
                id="nameEn"
                name="nameEn"
                value={formData.nameEn || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameRu">Name (RU)</Label>
              <Input
                id="nameRu"
                name="nameRu"
                value={formData.nameRu || ""}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Checkbox
                id="isBlocked"
                checked={formData.isBlocked || false}
                onCheckedChange={handleCheckbox}
              />
              <Label htmlFor="isBlocked">Is Blocked</Label>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenEditModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isFormUnchanged}>
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
