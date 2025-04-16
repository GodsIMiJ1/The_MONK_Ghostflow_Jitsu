declare module 'js-yaml' {
  export function load(str: string): any;
  export function dump(obj: any, options?: { indent?: number }): string;
} 