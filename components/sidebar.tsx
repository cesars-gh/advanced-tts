"use client";

import { Button } from "@/components/ui/button";
import { Cuboid as Cube, FileText, Mic2, Key, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar() {
  return (
    <div className="flex h-screen w-[250px] flex-col bg-background border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Cube className="h-8 w-8" />
        </div>
        
        <div className="space-y-4">
          <Button className="w-full justify-start" variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            New File
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full justify-between" variant="outline">
                Dialog
                <span>▼</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Marketing Script</DropdownMenuItem>
              <DropdownMenuItem>Video Script</DropdownMenuItem>
              <DropdownMenuItem>Podcast Script</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="w-full justify-start gap-2" variant="outline">
            <Mic2 className="h-4 w-4" />
            Create Voice Clone
          </Button>
        </div>

        <nav className="mt-8 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            Files
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mic2 className="mr-2 h-4 w-4" />
            Custom Voices
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </Button>
        </nav>
      </div>

      <div className="mt-auto p-6">
        <Button variant="ghost" className="w-full justify-start">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          Profile
        </Button>
      </div>
    </div>
  );
}