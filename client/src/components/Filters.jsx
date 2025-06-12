import React, { useState } from 'react';
import * as d3 from 'd3';

const Filters = ({ data, onFilterChange }) => {
    const [xMin, setXMin] = useState('');
    const [xMax, setXMax] = useState('');
    const [category, setCategory] = useState('');

    const categories = [...new Set(data.map(d => d.category))];

    const handleApplyFilters = () => {
        onFilterChange({ xMin: xMin ? +xMin : null, xMax: xMax ? +xMax : null, category });
    };

    return (
        <div className="mb-4">
            <h3 className="h5">Filters</h3>
            <div className="row g-3">
                <div className="col-md-4">
                    <label htmlFor="xMin" className="form-label">X Min</label>
                    <input
                        type="number"
                        className="form-control"
                        id="xMin"
                        value={xMin}
                        onChange={(e) => setXMin(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="xMax" className="form-label">X Max</label>
                    <input
                        type="number"
                        className="form-control"
                        id="xMax"
                        value={xMax}
                        onChange={(e) => setXMax(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label htmlFor="category" className="form-label">Category</label>
                    <select
                        className="form-select"
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleApplyFilters}>
                Apply Filters
            </button>
        </div>
    );
};

export default Filters;