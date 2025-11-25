import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../pages/dashboard';

// Mock child components
vi.mock('../../components/projectCard', () => ({
    default: ({ project }) => <div>{project.name}</div>,
}));

vi.mock('../../components/projectModal', () => ({
    default: () => <div>Mocked Modal</div>,
}));

describe('Dashboard', () => {
    const mockProps = {
        token: 'test-token',
        userId: 'user123',
        openProjectTasks: vi.fn(),
        allProjects: [],
        setAllProjects: vi.fn(),
        pinnedProjects: [],
        setPinnedProjects: vi.fn(),
    };

    it('should render Add Project button', () => {
        render(<Dashboard {...mockProps} />);

        expect(screen.getByText(/add project/i)).toBeInTheDocument();
    });

    it('should display project cards when projects exist', () => {
        const projectsWithData = {
            ...mockProps,
            allProjects: [
                { _id: '1', name: 'Test Project 1' },
                { _id: '2', name: 'Test Project 2' },
            ],
        };

        render(<Dashboard {...projectsWithData} />);

        expect(screen.getByText('Test Project 1')).toBeInTheDocument();
        expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    });

    it('should show empty state when no projects', () => {
        render(<Dashboard {...mockProps} />);

        // Only the Add Project button should be visible
        expect(screen.getByText(/add project/i)).toBeInTheDocument();
        expect(screen.queryByText(/Test Project/)).not.toBeInTheDocument();
    });
});
