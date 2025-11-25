import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from '../../components/registerForm';
import * as authAPI from '../../api/auth';

vi.mock('../../api/auth');

describe('RegisterForm', () => {
    const mockOnRegisterSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render name, username, and password inputs', () => {
        render(<RegisterForm onRegisterSuccess={mockOnRegisterSuccess} />);

        expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
        render(<RegisterForm onRegisterSuccess={mockOnRegisterSuccess} />);

        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('should allow typing in all fields', async () => {
        const user = userEvent.setup();
        render(<RegisterForm onRegisterSuccess={mockOnRegisterSuccess} />);

        await user.type(screen.getByPlaceholderText(/full name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
        await user.type(screen.getByPlaceholderText(/password/i), 'password123');

        expect(screen.getByPlaceholderText(/full name/i)).toHaveValue('Test User');
        expect(screen.getByPlaceholderText(/username/i)).toHaveValue('testuser');
        expect(screen.getByPlaceholderText(/password/i)).toHaveValue('password123');
    });

    it('should call register function on form submit', async () => {
        const user = userEvent.setup();
        authAPI.register.mockResolvedValue({ token: 'test-token', success: true });

        render(<RegisterForm onRegisterSuccess={mockOnRegisterSuccess} />);

        await user.type(screen.getByPlaceholderText(/full name/i), 'Test User');
        await user.type(screen.getByPlaceholderText(/username/i), 'testuser');
        await user.type(screen.getByPlaceholderText(/password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /register/i }));

        expect(authAPI.register).toHaveBeenCalledWith({
            name: 'Test User',
            username: 'testuser',
            password: 'password123',
        });
    });
});
