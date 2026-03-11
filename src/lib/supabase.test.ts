import { describe, it, expect, vi } from 'vitest';
import { safeQuery } from './supabase';

describe('safeQuery', () => {
  it('should return data on successful query', async () => {
    const mockQuery = Promise.resolve({ data: [{ id: 1 }], error: null });
    const result = await safeQuery(mockQuery);
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should return empty array on error', async () => {
    const mockQuery = Promise.resolve({ data: null, error: { message: 'Test error', details: '' } });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await safeQuery(mockQuery);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
