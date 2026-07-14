import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomePage } from '../pages/HomePage';

describe('HomePage', () => {
  it('renderiza a chamada principal e ações', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /uma tela organizada/i })).not.toBeNull();
    expect(screen.getByRole('link', { name: /abrir painel/i }).getAttribute('href')).toBe('/painel');
  });
});
