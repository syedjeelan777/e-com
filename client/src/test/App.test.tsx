import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import App from '../App';

// Mock API services during client tests
vi.mock('../services/productService', () => ({
  productService: {
    getFeaturedProducts: vi.fn().mockResolvedValue({ success: true, data: [] }),
    getProducts: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

vi.mock('../services/categoryService', () => ({
  categoryService: {
    getCategories: vi.fn().mockResolvedValue({ success: true, data: [] }),
  },
}));

describe('Client Frontend Application', () => {
  it('renders SHAZIYAKART homepage header brand name', async () => {
    render(<App />);
    const brandElements = await screen.findAllByText(/SHAZIYA/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });
});
