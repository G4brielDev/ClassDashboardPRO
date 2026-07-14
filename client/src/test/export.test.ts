import { describe, expect, it } from 'vitest';
import { importData } from '../services/export';

describe('importação', () => {
  it('rejeita JSON estruturalmente inválido', async () => {
    const file = new File([JSON.stringify({ invalid: true })], 'dados.json', { type: 'application/json' });
    await expect(importData(file)).rejects.toBeTruthy();
  });
});
