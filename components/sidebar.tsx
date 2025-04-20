"use client";

import { Button } from "@/components/ui/button";
import { Cuboid as Cube, FileText, Mic2, KeyRound } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen w-[250px] flex-col bg-background border-r">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <Cube className="h-8 w-8" />
          <p className="text-xl font-bold">
            Advanced TTS
          </p>
        </div>
        
        <div className="space-y-4">
          <Button 
            className="w-full justify-start" 
            variant="outline"
            asChild
          >
            <Link href="/scripts/new">
              <FileText className="mr-2 h-4 w-4" />
              New Script
            </Link>
          </Button>
          
          {/* <DropdownMenu>
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
          </DropdownMenu> */}

          {/* <Button className="w-full justify-start gap-2" variant="outline">
            <Mic2 className="h-4 w-4" />
            Create Voice Clone
          </Button> */}
        </div>

        <nav className="mt-8 space-y-2">
          <Button 
            variant={pathname.startsWith('/scripts') ? "default" : "ghost"} 
            className="w-full justify-start"
            asChild
          >
            <Link href="/scripts">
              <FileText className="mr-2 h-4 w-4" />
              Scripts
            </Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Mic2 className="mr-2 h-4 w-4" />
            Voices
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <KeyRound className="mr-2 h-4 w-4" />
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