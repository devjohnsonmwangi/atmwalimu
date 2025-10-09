import 'vitest';
/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated and admin', () => {
    const store = mockStore({ user: { accessToken: 'token', user: { role: 'admin' } } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard/admin"]}>
          <Routes>
            <Route element={<ProtectedRoute />}> 
              <Route path="/dashboard/admin" element={<div>Admin Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    const store = mockStore({ user: { accessToken: null, user: null } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard/admin"]}>
          <Routes>
            <Route element={<ProtectedRoute />}> 
              <Route path="/dashboard/admin" element={<div>Admin Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('redirects to login when not admin', () => {
    const store = mockStore({ user: { accessToken: 'token', user: { role: 'user' } } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard/admin"]}>
          <Routes>
            <Route element={<ProtectedRoute />}> 
              <Route path="/dashboard/admin" element={<div>Admin Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });
});
