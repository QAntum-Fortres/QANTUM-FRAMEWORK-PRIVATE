import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge classes correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500', 'text-green-500');
    // tailwind-merge should override text-red-500 with text-green-500
    expect(result).toBe('bg-blue-500 text-green-500');
  });

  it('should handle conditional classes', () => {
    const result = cn('text-red-500', false && 'bg-blue-500', 'text-green-500');
    expect(result).toBe('text-green-500');
  });
});
