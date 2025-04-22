'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { VoiceList } from '@/components/voices/VoiceList';
import { VoiceFormModal } from '@/components/voices/VoiceFormModal';
import type { Voice } from '@/lib/types/voice.type';
import { toast } from 'sonner';

export default function Voices() {
  const [voices, setVoices] = useState<Voice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVoice, setEditingVoice] = useState<Voice | undefined>(undefined);

  useEffect(() => {
    const loadVoices = async () => {
      try {
        const response = await fetch('/api/voices');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        setVoices(data);
      } catch (error) {
        console.error('Failed to load voices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVoices();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingVoice(undefined);
    setModalOpen(true);
  };

  const handleEditVoice = (voice: Voice) => {
    setEditingVoice(voice);
    setModalOpen(true);
  };

  const handleDeleteVoice = async (id: number) => {
    try {
      const response = await fetch(`/api/voices/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete voice');
      }

      setVoices((prevVoices) => prevVoices.filter((voice) => voice.id !== id));
      toast.success('Voice deleted successfully');
    } catch (error) {
      console.error('Failed to delete voice:', error);
      toast.error('Failed to delete voice', {
        description: 'Please try again later',
      });
      throw error;
    }
  };

  const handleSaveVoice = async (values: Partial<Voice>) => {
    const endpoint = editingVoice ? `/api/voices/${editingVoice.id}` : '/api/voices';
    const method = editingVoice ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to update voice');
      }
      const data = await response.json();

      if (editingVoice) {
        setVoices((prevVoices) => prevVoices.map((voice) => (voice.id === data.id ? data : voice)));
      } else {
        setVoices((prevVoices) => [...prevVoices, data]);
      }

      toast.success('Voice saved successfully');
    } catch (error) {
      console.error('Failed to save voice:', error);
      throw error;
    }
  };

  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[900px] mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Your Voices</h1>
              <p className="text-sm text-muted-foreground">Manage your text-to-speech voices</p>
            </div>
            <Button onClick={handleOpenCreateModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Voice
            </Button>
          </div>

          <VoiceList
            voices={voices}
            onEdit={handleEditVoice}
            onDelete={handleDeleteVoice}
            onCreateNew={handleOpenCreateModal}
            loading={loading}
          />

          <VoiceFormModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            onSubmit={handleSaveVoice}
            initialData={editingVoice}
          />
        </div>
      </div>
    </main>
  );
}
