import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

export function Navbar() {
  return (
    <header className="flex h-20 w-full items-center justify-between border-b bg-white px-8">
      <div>
        <Image
          src={"/logos/mainlogo.png"}
          alt="Website logo"
          height={200}
          width={400}
          className="w-43 h-auto object-contain"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
            <Avatar className="h-10 w-10 border-2 border-gray-100">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>JW</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-semibold text-gray-900 md:block">
              James William
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 mt-2">
            <DropdownMenuItem>My Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
