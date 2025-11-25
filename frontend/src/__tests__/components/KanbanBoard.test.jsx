import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import KanbanBoard from '../../pages/kanbanBoard';

// Mock socket
vi.mock('socket.io-client', () => ({
    default: vi.fn(() => ({
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
    })),
}));

describe('KanbanBoard', () => {
    const mockProps = {
        token: 'test-token',
        currentProjectId: 'project123',
        goBack: vi.fn(),
    };

    it('should render column headers', () => {
        render(<KanbanBoard {...mockProps} />);

        // Actual column names are "To Do", "In Progress", "Done"
        expect(screen.getByText(/to do/i)).toBeInTheDocument();
        expect(screen.getByText(/in progress/i)).toBeInTheDocument();
        expect(screen.getByText(/done/i)).toBeInTheDocument();
    });

    it('should render Add Task button', () => {
        render(<KanbanBoard {...mockProps} />);

        expect(screen.getByText(/\+ add task/i)).toBeInTheDocument();
    });
});
