import React from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from './ui/button';

interface NavigationBarProps {
  onNew: () => void;
  onSave: () => void;
  onLoad: () => void;
  appName: string;
  appVersion: string;
}

export function NavigationBar({
  onNew,
  onSave,
  onLoad,
  appName,
  appVersion
}: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-background">
      {/* Left section - App info */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold">{appName}</span>
        <span className="text-sm text-muted-foreground">{appVersion}</span>
      </div>

      {/* Center section - Main menu */}
      <Menubar className="hidden md:flex">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onNew}>
              New Document
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onSave}>
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onLoad}>
              Load
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      {/* Right section - Theme switcher and mobile menu */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        
        {/* Mobile menu */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={onNew}>
            New
          </Button>
          <Button variant="ghost" size="icon" onClick={onSave}>
            Save
          </Button>
          <Button variant="ghost" size="icon" onClick={onLoad}>
            Load
          </Button>
        </div>
      </div>
    </div>
  );
} 