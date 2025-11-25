import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from '../../components/loginForm';
import * as authAPI from '../../api/auth';

// Mock the auth API
vi.mock('../../api/auth');

describe('LoginForm', () => {
    const mockOnLoginSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render username and password inputs', () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        const submitButton = screen.getByRole('button', { name: /login/i });
        expect(submitButton).toBeInTheDocument();
    });

    it('should allow typing in inputs', async () => {
        const user = userEvent.setup();
        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        await user.type(usernameInput, 'testuser');
        await user.type(passwordInput, 'password123');

        expect(usernameInput).toHaveValue('testuser');
        expect(passwordInput).toHaveValue('password123');
    });

    it('should call login function on form submit', async () => {
        const user = userEvent.setup();
        authAPI.login.mockResolvedValue({ token: 'test-token' });

        render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

        await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
        await user.type(screen.getByPlaceholderText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /login/i }));

        expect(authAPI.login).toHaveBeenCalledWith('testuser', 'password123');
        expect(mockOnLoginSuccess).toHaveBeenCalledWith('test-token');
    });
});
