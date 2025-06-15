// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import Filters from './Filters';
import { vi } from 'vitest';

describe('Filters', () => {
    const data = [
        { x: '1', y: '2', z: '3', category: 'GroupA' },
        { x: '4', y: '5', z: '6', category: 'GroupB' },
    ];

    it('renders filter inputs', () => {
        render(<Filters data={data} onFilterChange={() => { }} />);
        expect(screen.getByLabelText(/X Min/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/X Max/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Category/i)).toBeInTheDocument();
    });

    it('applies filters correctly', () => {
        const onFilterChange = vi.fn();
        render(<Filters data={data} onFilterChange={onFilterChange} />);

        fireEvent.change(screen.getByLabelText(/X Min/i), { target: { value: '2' } });
        fireEvent.change(screen.getByLabelText(/Category/i), { target: { value: 'GroupB' } });
        fireEvent.click(screen.getByText(/Apply Filters/i));

        expect(onFilterChange).toHaveBeenCalledWith({ xMin: 2, xMax: null, category: 'GroupB' });
    });
});