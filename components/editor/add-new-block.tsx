'use client';

import { Button } from '@/components/ui/button';
import { useTextScript } from '../script-provider';

export function AddNewBlock() {
  const { addBlock } = useTextScript();

  return (
    <div className="flex justify-center items-center py-4">
      <Button variant="outline" onClick={addBlock}>
        Add new block
      </Button>
    </div>
  );
}
