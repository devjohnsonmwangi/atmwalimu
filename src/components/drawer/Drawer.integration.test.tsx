/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Drawer from '../../pages/dashboard/aside/Drawer';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('Drawer integration', () => {
  it('navigates to dashboard admin when Manage Categories is clicked by admin', async () => {
    const store = mockStore({ user: { accessToken: 'token', user: { role: 'admin' } } });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Drawer isMobileOpen={false} onMobileClose={() => {}} />} />
            <Route path="/dashboard/admin" element={<div>Admin Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    // Click the Manage Categories link in the drawer
    const link = screen.getByText(/Manage Categories/i);
    await userEvent.click(link);

    // After clicking, the Admin Page route should render
    expect(await screen.findByText('Admin Page')).toBeInTheDocument();
  });
});
