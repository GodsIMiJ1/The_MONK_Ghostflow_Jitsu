import React from 'react';
import Image from 'next/image';
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
  onSaveAs: () => void;
  onLoad: () => void;
  appName: string;
  appVersion: string;
}

export function NavigationBar({
  onNew,
  onSave,
  onSaveAs,
  onLoad,
  appName,
  appVersion
}: NavigationBarProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-background">
      {/* Left section - App info */}
      <div className="flex items-center gap-4">
        <div className="relative w-8 h-8">
          <Image
            src="/the_MONK-ICON.png"
            alt="The MONK Icon"
            fill
            className="object-contain"
            priority
          />
        </div>
        <div className="relative h-12 w-72">
          <Image
            src="/The_MONK-name_logo.png"
            alt="The MONK"
            fill
            className="object-contain"
            priority
          />
        </div>
        <span className="text-sm text-muted-foreground">{appVersion}</span>
      </div>

      {/* Center section - Main menu */}
      <Menubar className="hidden md:flex">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onNew}>
              New
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onLoad}>
              Load
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={onSave}>
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={onSaveAs}>
              Save As
              <MenubarShortcut>⌘⇧S</MenubarShortcut>
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
          <Button variant="ghost" size="icon" onClick={onLoad}>
            Load
          </Button>
          <Button variant="ghost" size="icon" onClick={onSave}>
            Save
          </Button>
          <Button variant="ghost" size="icon" onClick={onSaveAs}>
            Save As
          </Button>
        </div>
      </div>
    </div>
  );
}