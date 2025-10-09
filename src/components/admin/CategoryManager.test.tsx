import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryManager from './CategoryManager';

// Mock the articlesApi hooks
vi.mock('../../features/articles/articlesApi', () => {
  return {
    useGetCategoriesQuery: vi.fn(() => ({ data: [{ categoryId: 1, name: 'Test' }], isLoading: false, isError: false })),
    useCreateCategoryMutation: vi.fn(() => [vi.fn(() => Promise.resolve({})), { isLoading: false }]),
    useDeleteCategoryMutation: vi.fn(() => [vi.fn(() => Promise.resolve({})), { isLoading: false }]),
  };
});

describe('CategoryManager', () => {
  it('renders existing categories', () => {
    render(<CategoryManager />);
    expect(screen.getByText('Manage Categories')).toBeInTheDocument();
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('allows creating a new category', async () => {
  const api = await import('../../features/articles/articlesApi');
  const mockCreate = vi.fn(() => ({ unwrap: async () => ({}) }));
  // cast to any to override mock return value for the test
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (api.useCreateCategoryMutation as any).mockReturnValue([mockCreate, { isLoading: false }]);

    render(<CategoryManager />);
    const input = screen.getByPlaceholderText('New category name');
    await userEvent.type(input, 'NewCat');
    const addBtn = screen.getByRole('button', { name: /add category/i });
    userEvent.click(addBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalled();
    });
  });
});
