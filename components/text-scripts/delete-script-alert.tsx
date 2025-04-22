'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteScriptAlertProps {
  isOpen: boolean;
  scriptName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteScriptAlert({
  isOpen,
  scriptName,
  onClose,
  onConfirm,
}: DeleteScriptAlertProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Script</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{scriptName}</strong>? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                await onConfirm();
              } catch (error) {
                console.error('Failed to delete script:', error);
              }
            }}
            className="bg-destructive hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
