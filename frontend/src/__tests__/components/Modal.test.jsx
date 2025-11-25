import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectModal from '../../components/projectModal';
import TaskModal from '../../components/taskModal';

// Mock user search API
vi.mock('../../api/user', () => ({
    searchUsers: vi.fn(() => Promise.resolve([])),
}));

describe('Modal Components', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('ProjectModal', () => {
        const mockOnClose = vi.fn();
        const mockOnSubmit = vi.fn();

        it('should render project name input when open', () => {
            render(
                <ProjectModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    project={null}
                />
            );

            // The label is "Name:" not "Project Name"
            expect(screen.getByLabelText(/name:/i)).toBeInTheDocument();
        });

        it('should be closeable', async () => {
            const user = userEvent.setup();
            render(
                <ProjectModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    project={null}
                />
            );

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalled();
        });
    });

    describe('TaskModal', () => {
        const mockOnClose = vi.fn();
        const mockOnSubmit = vi.fn();

        it('should render task title input when open', () => {
            render(
                <TaskModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    task={null}
                />
            );

            // TaskModal uses placeholder="Title" not a label
            expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
        });

        it('should be closeable', async () => {
            const user = userEvent.setup();
            render(
                <TaskModal
                    isOpen={true}
                    onClose={mockOnClose}
                    onSubmit={mockOnSubmit}
                    task={null}
                />
            );

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            await user.click(cancelButton);

            expect(mockOnClose).toHaveBeenCalled();
        });
    });
});
