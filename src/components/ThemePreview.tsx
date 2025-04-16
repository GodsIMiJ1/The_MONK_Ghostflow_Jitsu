import React from 'react';
import { useTheme } from '@/lib/theme-provider';
import { cn } from '@/lib/utils';
import { ThemeType, AVAILABLE_THEMES } from '@/lib/theme-utils';

interface ThemePreviewProps {
  themeId: ThemeType;
  active?: boolean;
  onClick?: () => void;
}

export function ThemePreview({ themeId, active = false, onClick }: ThemePreviewProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-40 h-24 rounded-lg p-2 border-2 transition-all cursor-pointer hover:scale-105',
        active ? 'border-accent' : 'border-border',
        'relative overflow-hidden'
      )}
      data-theme={themeId}
    >
      {/* Preview Layout */}
      <div className="w-full h-full flex flex-col gap-2">
        {/* Header */}
        <div className="h-2 w-full bg-accent rounded" />
        
        {/* Content */}
        <div className="flex-1 flex gap-2">
          {/* Sidebar */}
          <div className="w-1/3 bg-muted rounded" />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="h-1 w-3/4 bg-muted rounded" />
            <div className="h-1 w-1/2 bg-muted rounded" />
            <div className="h-1 w-2/3 bg-muted rounded" />
          </div>
        </div>
      </div>
      
      {/* Theme Name */}
      <div className="absolute bottom-1 left-2 right-2 text-xs font-medium truncate">
        {themeId.charAt(0).toUpperCase() + themeId.slice(1).replace(/-/g, ' ')}
      </div>
    </button>
  );
}

export function ThemeGrid() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {AVAILABLE_THEMES.map((themeId) => (
        <ThemePreview
          key={themeId}
          themeId={themeId}
          active={theme === themeId}
          onClick={() => setTheme(themeId)}
        />
      ))}
    </div>
  );
} 