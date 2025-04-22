'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ScriptList } from '@/components/text-scripts/script-list';
import { DeleteScriptAlert } from '@/components/text-scripts/delete-script-alert';
import { UpdateScriptModal } from '@/components/text-scripts/update-script-modal';
import type { TextScript } from '@/lib/types/script.type';
import { toast } from 'sonner';

export default function Scripts() {
  const [scripts, setScripts] = useState<TextScript[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scriptToDelete, setScriptToDelete] = useState<TextScript | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [scriptToEdit, setScriptToEdit] = useState<TextScript | null>(null);

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const response = await fetch('/api/scripts');
        if (!response.ok) {
          throw new Error('Failed to fetch scripts');
        }
        const data = await response.json();
        setScripts(data);
      } catch (error) {
        console.error('Failed to load scripts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadScripts();
  }, []);

  const handleDeleteClick = (scriptId: string) => {
    const script = scripts.find((s) => s.id === scriptId);
    if (script) {
      setScriptToDelete(script);
      setDeleteDialogOpen(true);
    }
  };

  const handleEditClick = (script: TextScript) => {
    setScriptToEdit(script);
    setEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!scriptToDelete) return;

    try {
      const response = await fetch(`/api/scripts/${scriptToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete script');
      }

      // Remove the deleted script from the state
      setScripts(scripts.filter((script) => script.id !== scriptToDelete.id));
      toast.success('Script deleted', {
        description: 'Your script has been successfully deleted',
      });
    } catch (error) {
      toast.error('Failed to delete script', {
        description: 'Please try again later',
      });
      console.error('Error deleting script:', error);
    } finally {
      setDeleteDialogOpen(false);
      setScriptToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setScriptToDelete(null);
  };

  const handleUpdateScript = async (scriptId: string, name: string, description: string) => {
    try {
      const response = await fetch(`/api/scripts/${scriptId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update script');
      }

      // Update the scripts state with the updated script
      setScripts(
        scripts.map((script) =>
          script.id === scriptId ? { ...script, name, description } : script
        )
      );
      toast.success('Script updated', {
        description: 'Your script has been successfully updated',
      });

      return Promise.resolve();
    } catch (error) {
      toast.error('Failed to update script', {
        description: 'Please try again later',
      });
      console.error('Error updating script:', error);
      return Promise.reject(error);
    }
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setScriptToEdit(null);
  };

  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[900px] mx-auto p-6">
          <ScriptList
            scripts={scripts}
            loading={loading}
            onDeleteScript={handleDeleteClick}
            onEditScript={handleEditClick}
          />
        </div>
      </div>

      {scriptToDelete && (
        <DeleteScriptAlert
          isOpen={deleteDialogOpen}
          scriptName={scriptToDelete.name}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <UpdateScriptModal
        isOpen={editModalOpen}
        script={scriptToEdit}
        onClose={handleEditCancel}
        onUpdate={handleUpdateScript}
      />
    </main>
  );
}
