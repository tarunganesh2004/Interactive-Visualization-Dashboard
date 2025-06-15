import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import * as d3 from 'd3';
import FileUpload from './components/FileUpload';
import Visualization from './components/Visualization';
import Filters from './components/Filters';

const App = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  const handleDataUpdate = (newData) => {
    setData(newData);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container my-4">
      <h1 className="display-4 text-center mb-4">3D Data Visualization Dashboard</h1>
      <FileUpload onDataUpdate={handleDataUpdate} />
      <Filters data={data} onFilterChange={handleFilterChange} />
      <Visualization data={data} filters={filters} />
    </div>
  );
};

export default App;