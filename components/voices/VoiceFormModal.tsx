'use client';

import { useState, useEffect } from 'react'; /** changed */
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type Voice, voiceSchema } from '@/lib/types/voice.type';
import { toast } from 'sonner';
import { OPENAI_VOICES } from '@/components/client.utils';
type FormValues = z.infer<typeof voiceSchema>;

interface VoiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  initialData?: Voice;
}

const defaultFormValues: FormValues = {
  name: '',
  provider: 'openai',
  openaiVoice: OPENAI_VOICES[0],
  prompt: '',
};

export function VoiceFormModal({ open, onOpenChange, onSubmit, initialData }: VoiceFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(voiceSchema),
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });

  // Reset form when initialData changes *changed*
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset(defaultFormValues);
    }
  }, [form, initialData]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save voice', {
        description: 'Please try again later',
      });
      console.error('Failed to save voice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Voice' : 'Create Voice'}</DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Update the details for this voice.'
              : 'Set up a new voice for text-to-speech.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter voice name" {...field} maxLength={100} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value.length} / 100 characters
                  </p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI</SelectItem>
                      <SelectItem value="hume">Hume AI</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.watch('provider') === 'openai' && (
              <FormField
                control={form.control}
                name="openaiVoice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select voice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {OPENAI_VOICES.map((voice) => (
                          <SelectItem key={voice} value={voice}>
                            {voice}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter voice prompt"
                      className="min-h-[120px]"
                      {...field}
                      maxLength={1000}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    {field.value.length} / 1000 characters
                  </p>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !form.formState.isValid}>
                {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
