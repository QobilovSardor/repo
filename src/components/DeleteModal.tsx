import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Dispatch, SetStateAction } from "react";

interface DeleteModalProps {
  openDeleteModal: boolean;
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  handleDeleteConfirm: () => void;
  modalTitle: string;
  modalDesc: string;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  openDeleteModal,
  setOpenDeleteModal,
  handleDeleteConfirm,
  modalTitle,
  modalDesc,
}) => {
  return (
    <Dialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <DialogDescription>{modalDesc}</DialogDescription>
        </div>
        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpenDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
