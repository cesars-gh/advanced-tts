'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { TextScript } from '@/lib/types/script.type';

interface UpdateScriptModalProps {
  isOpen: boolean;
  script: TextScript | null;
  onClose: () => void;
  onUpdate: (scriptId: string, name: string, description: string) => Promise<void>;
}

export function UpdateScriptModal({ isOpen, script, onClose, onUpdate }: UpdateScriptModalProps) {
  const [name, setName] = useState(script?.name || '');
  const [description, setDescription] = useState(script?.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update local state when script changes
  useEffect(() => {
    if (script) {
      setName(script.name);
      setDescription(script.description);
    }
  }, [script]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!script) return;

    setIsSubmitting(true);
    try {
      await onUpdate(script.id, name, description);
      onClose();
    } catch (error) {
      console.error('Failed to update script:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Script</DialogTitle>
          <DialogDescription>Update the title and description of your script.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={100}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
