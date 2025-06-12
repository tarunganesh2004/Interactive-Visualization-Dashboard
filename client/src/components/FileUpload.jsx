import React from 'react';

const FileUpload = ({ onDataUpdate }) => {
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });
                const result = await res.json();
                if (result.error) {
                    alert('Error uploading file: ' + result.error);
                    return;
                }
                onDataUpdate(result.data);
                alert('File uploaded successfully!');
            } catch (err) {
                alert('Error uploading file: ' + err.message);
            }
        } else {
            alert('Please upload a valid CSV file.');
        }
    };

    return (
        <div className="mb-4">
            <label htmlFor="fileUpload" className="form-label">Upload CSV File</label>
            <input
                type="file"
                className="form-control"
                id="fileUpload"
                accept=".csv"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default FileUpload;