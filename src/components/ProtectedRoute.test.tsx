import 'vitest';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

describe('ProtectedRoute (top-level)', () => {
  it('renders children when authenticated and role allowed', () => {
    const store = mockStore({ user: { accessToken: 'token', user: { role: 'admin' } } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route path="/protected" element={<ProtectedRoute allowedRoles={["admin"]}><div>Admin Content</div></ProtectedRoute>} />
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
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
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route path="/protected" element={<ProtectedRoute allowedRoles={["admin"]}><div>Admin Content</div></ProtectedRoute>} />
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  it('redirects to unauthorized when role not allowed', () => {
    const store = mockStore({ user: { accessToken: 'token', user: { role: 'user' } } });
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/protected"]}>
          <Routes>
            <Route path="/protected" element={<ProtectedRoute allowedRoles={["admin"]}><div>Admin Content</div></ProtectedRoute>} />
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Unauthorized')).toBeInTheDocument();
  });
});
