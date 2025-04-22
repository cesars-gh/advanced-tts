import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface ScriptMenuProps {
  onOptionClick?: (option: string) => void;
}

export const ScriptMenu = ({ onOptionClick }: ScriptMenuProps) => {
  const handleOptionClick = (option: string) => {
    onOptionClick?.(option);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-md h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-md">
        <DropdownMenuItem onClick={() => handleOptionClick('option1')}>Option 1</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOptionClick('option2')}>Option 2</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOptionClick('option3')}>Option 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
