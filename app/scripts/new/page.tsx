'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { TextScript } from '@/lib/types/script.type';

export default function NewScript() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/scripts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create script');
      }

      const newScript = (await response.json()) as TextScript;
      router.push(`/scripts/${newScript.id}`);
    } catch (error) {
      console.error('Failed to create script:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-[900px] mx-auto p-6">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-2">
              <Link href="/scripts">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Scripts
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Create New Script</h1>
            <p className="text-sm text-muted-foreground">Start a new text-to-speech script</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-[600px]">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Script Name
              </label>
              <Input
                id="name"
                placeholder="Enter script name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">{name.length} / 100 characters</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Enter script description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">{description.length} / 100 characters</p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isSubmitting || !name.trim()}>
                {isSubmitting ? 'Creating...' : 'Create Script'}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push('/scripts')}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
