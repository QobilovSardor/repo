import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";
import type { IDepartment } from "@/interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDepartments } from "@/context/department/useDepartment";
import { DeleteModal } from "@/components";
import { EditDepartment } from "./EditDepartment";

interface DepartmentTableProps {
  departments: IDepartment[];
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

  const handleEdit = useCallback((dep: IDepartment) => {
    setSelectedDep(dep);
    setOpenEditModal(true);
  }, []);

  const handleDelete = useCallback((dep: IDepartment) => {
    setSelectedDep(dep);
    setOpenDeleteModal(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (selectedDep) {
      onDelete(selectedDep.id);
      setOpenDeleteModal(false);
      setSelectedDep(null);
    }
  }, [selectedDep, onDelete]);

  const handleSave = useCallback(
    async (data: Partial<IDepartment>) => {
      if (!selectedDep) return;

      try {
        await editDepartment(selectedDep.id, {
          depType: data.depType,
          nameUz: data.nameUz,
          nameEn: data.nameEn,
          nameRu: data.nameRu,
          isBlocked: data.isBlocked,
        });
        setSelectedDep(null);
        setOpenEditModal(false);
      } catch (error) {
        console.error("Failed to save department:", error);
      }
    },
    [selectedDep, editDepartment]
  );

  const closeEditModal = useCallback(() => {
    setOpenEditModal(false);
    setSelectedDep(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setOpenDeleteModal(false);
    setSelectedDep(null);
  }, []);

  return (
    <>
      <Card className="p-0 overflow-hidden gap-0">
        <CardHeader className="border-b border-border bg-gradient-to-r from-primary/5 to-transparent pt-6">
          <CardTitle>Departments List</CardTitle>
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
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-muted-foreground py-6"
                  >
                    No departments found...
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dep, idx) => (
                  <TableRow key={dep.id}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{dep.depType}</TableCell>
                    <TableCell>{dep.nameUz}</TableCell>
                    <TableCell>{dep.nameEn}</TableCell>
                    <TableCell>{dep.nameRu}</TableCell>
                    <TableCell>
                      <span
                        className={
                          dep.isBlocked
                            ? "text-red-500 font-medium"
                            : "text-green-600 font-medium"
                        }
                      >
                        {dep.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => handleEdit(dep)}
                          className="p-1.5 rounded-md hover:bg-muted transition"
                          title="Edit"
                          aria-label={`Edit ${dep.nameEn}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dep)}
                          className="p-1.5 rounded-md hover:bg-red-50 transition"
                          title="Delete"
                          aria-label={`Delete ${dep.nameEn}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedDep && (
        <EditDepartment
          openEditModal={openEditModal}
          setOpenEditModal={closeEditModal}
          selectedDep={selectedDep}
          onSave={handleSave}
        />
      )}
      {selectedDep && (
        <DeleteModal
          modalTitle="Delete Department"
          modalDesc="Are you sure you want to delete this department? This action cannot be undone."
          setOpenDeleteModal={closeDeleteModal}
          openDeleteModal={openDeleteModal}
          handleDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
};
