// @ts-nocheck
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from './FileUpload';
import { vi } from 'vitest';

describe('FileUpload', () => {
    it('renders file input', () => {
        render(<FileUpload onDataUpdate={() => { }} />);
        expect(screen.getByLabelText(/Upload CSV File/i)).toBeInTheDocument();
    });

    it('handles valid CSV file upload', async () => {
        const onDataUpdate = vi.fn();
        render(<FileUpload onDataUpdate={onDataUpdate} />);

        const file = new File(['x,y,z,category\n1,2,3,GroupA'], 'test-data.csv', { type: 'text/csv' });
        const input = screen.getByLabelText(/Upload CSV File/i);

        global.fetch = vi.fn().mockResolvedValue({
            json: () => Promise.resolve({ data: [{ x: '1', y: '2', z: '3', category: 'GroupA' }] }),
        });

        fireEvent.change(input, { target: { files: [file] } });

        await vi.waitFor(() => {
            expect(onDataUpdate).toHaveBeenCalledWith([{ x: '1', y: '2', z: '3', category: 'GroupA' }]);
        });
    });

    it('shows alert for invalid file type', async () => {
        global.alert = vi.fn();
        render(<FileUpload onDataUpdate={() => { }} />);

        const file = new File(['invalid'], 'test.txt', { type: 'text/plain' });
        const input = screen.getByLabelText(/Upload CSV File/i);

        fireEvent.change(input, { target: { files: [file] } });

        expect(global.alert).toHaveBeenCalledWith('Please upload a valid CSV file.');
    });
});