import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@snow/core/ui';

import { useState } from 'react';

interface VisionModelGuidanceProps {
  onNavigateToSettings: () => void;
}

export const VisionModelGuidance: React.FC<VisionModelGuidanceProps> = ({ onNavigateToSettings }) => {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">No Vision Model Configured</AlertDialogTitle>
          <AlertDialogDescription>
            To use image-based AI features, you need to configure a vision model in Settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={onNavigateToSettings}>Configure Vision Model</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
