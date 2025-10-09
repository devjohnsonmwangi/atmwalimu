import 'vitest';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MySubmissionsPage from './MySubmissionsPage';

// Mock the RTK Query hooks
vi.mock('../../../../features/articles/articlesApi', async () => {
  const actual = await vi.importActual('../../../../features/articles/articlesApi');
  return {
    ...actual,
    useGetMyArticlesQuery: vi.fn(),
    useDeleteArticleMutation: vi.fn(),
  };
});

import * as articlesApi from '../../../../features/articles/articlesApi';

const mockStore = configureStore([]);

describe('MySubmissionsPage', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('filters articles by status and calls delete', async () => {
    const articles = [
      { articleId: 1, title: 'Draft Article', slug: 'd1', excerpt: 'x', author: { userId: 10, fullName: 'A' }, status: 'draft', createdAt: '', content: '' },
      { articleId: 2, title: 'Published Article', slug: 'p1', excerpt: 'y', author: { userId: 10, fullName: 'A' }, status: 'published', createdAt: '', content: '' },
    ];
  (articlesApi.useGetMyArticlesQuery as unknown as Mock).mockReturnValue({ data: { data: articles }, isLoading: false, refetch: vi.fn() });
  const mockMutate = vi.fn().mockImplementation(() => ({ unwrap: vi.fn().mockResolvedValue({}) }));
  (articlesApi.useDeleteArticleMutation as unknown as Mock).mockReturnValue([mockMutate, { isLoading: false }]);
  // mock confirm to always accept
  // mock confirm to always accept
  vi.spyOn(window, 'confirm').mockReturnValue(true);

    const store = mockStore({ user: { accessToken: 't', user: { userId: 10 } } });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <MySubmissionsPage />
        </MemoryRouter>
      </Provider>
    );

    // Both articles visible by default
    expect(screen.getByText('Draft Article')).toBeInTheDocument();
    expect(screen.getByText('Published Article')).toBeInTheDocument();

    // Click Published filter
    fireEvent.click(screen.getByText('Published'));
    expect(screen.queryByText('Draft Article')).not.toBeInTheDocument();
    expect(screen.getByText('Published Article')).toBeInTheDocument();

    // Mock delete: click Delete on Published (should call mutation)
    const deleteButtons = screen.getAllByText('Delete');
    expect(deleteButtons.length).toBeGreaterThan(0);
    fireEvent.click(deleteButtons[0]);

    expect(mockMutate).toHaveBeenCalled();
  });
}

);