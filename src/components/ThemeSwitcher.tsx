import React from 'react';
import { useTheme } from '@/lib/theme-provider';
import { THEME_OPTIONS } from '@/lib/theme-utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-4">
      <Select
        value={theme}
        onValueChange={setTheme}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {THEME_OPTIONS.map((themeOption) => (
            <SelectItem
              key={themeOption.id}
              value={themeOption.id}
              className="flex flex-col items-start"
            >
              <span className="font-medium">{themeOption.name}</span>
              <span className="text-xs text-muted-foreground">
                {themeOption.description}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
} 