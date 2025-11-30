import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import type { IDepartment } from "@/interface/department";
import { EditDepartment } from "./EditDepartament";
import { DeleteDepartment } from "./DeleteDepartment";
import { useDepartments } from "@/context/DepartmentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DepartmentTableProps {
  departments: IDepartment[];
  onEdit?: (department: IDepartment) => void;
  onDelete: (id: number) => void;
}

export const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  onDelete,
}) => {
  const [selectedDep, setSelectedDep] = useState<IDepartment | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { editDepartment } = useDepartments();

  const handleEdit = (dep: IDepartment) => {
    setSelectedDep(dep);
    setOpenEditModal(true);
  };

  const handleDelete = (dep: IDepartment) => {
    setSelectedDep(dep);
    setOpenDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedDep) onDelete(selectedDep.id);
    setOpenDeleteModal(false);
    setSelectedDep(null);
  };

  const handleSave = async (data: Partial<IDepartment>) => {
    if (!selectedDep) return;

    await editDepartment(selectedDep.id, {
      depType: data.depType,
      nameUz: data.nameUz,
      nameEn: data.nameEn,
      nameRu: data.nameRu,
      isBlocked: data.isBlocked,
    });

    setSelectedDep(null);
    setOpenEditModal(false);
  };

  return (
    <>
      <Card className="p-0 overflow-hidden block">
        <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent pt-6">
          <div className="space-y-2">
            <CardTitle>Departments List</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Name (Uz)</TableHead>
                <TableHead>Name (En)</TableHead>
                <TableHead>Name (Ru)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {departments.map((dep, idx) => (
                <TableRow key={dep.id}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{dep.depType}</TableCell>
                  <TableCell>{dep.nameUz}</TableCell>
                  <TableCell>{dep.nameEn}</TableCell>
                  <TableCell>{dep.nameRu}</TableCell>

                  <TableCell>
                    {dep.isBlocked ? (
                      <span className="text-red-500 font-medium">Blocked</span>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEdit(dep)}
                        className="p-1.5 rounded-md hover:bg-muted transition"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(dep)}
                        className="p-1.5 rounded-md hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {departments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-6"
                  >
                    No departments found...
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <EditDepartment
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
        selectedDep={selectedDep}
        onSave={handleSave}
      />

      <DeleteDepartment
        setOpenDeleteModal={setOpenDeleteModal}
        openDeleteModal={openDeleteModal}
        handleDeleteConfirm={handleDeleteConfirm}
      />
    </>
  );
};
