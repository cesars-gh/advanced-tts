import type { Voice } from '@/lib/types/voice.type';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AudioLines } from 'lucide-react';

interface VoiceSelectProps {
  voices: Voice[];
  currentVoice: Voice;
  onVoiceChange: (voice: Voice) => void;
}

export const VoiceSelect = ({ voices, currentVoice, onVoiceChange }: VoiceSelectProps) => {
  const handleVoiceChange = (value: string) => {
    const voice = voices.find((v) => v.id === Number.parseInt(value));
    if (voice) {
      onVoiceChange(voice);
    }
  };

  return (
    <div className="">
      <Select value={currentVoice.id.toString()} onValueChange={handleVoiceChange}>
        <SelectTrigger className="w-[180px]">
          <AudioLines className="h-4 w-4 mr-2 text-emerald-500" />
          <SelectValue placeholder="Change voice">{currentVoice.name}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {voices.map((voiceOption) => (
            <SelectItem key={voiceOption.id} value={voiceOption.id.toString()}>
              <div className="flex flex-col">
                <span className="font-medium">{voiceOption.name}</span>
                <span className="text-xs text-muted-foreground capitalize">
                  {voiceOption.provider}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
