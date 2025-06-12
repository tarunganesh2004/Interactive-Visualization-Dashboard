import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import * as d3 from 'd3';

const Visualization = ({ data, filters }) => {
    const canvasRef = useRef(null);
    const vrButtonRef = useRef(null);

    useEffect(() => {
        if (!data.length || !canvasRef.current) return;

        // Set up Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf5f7fa);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
        renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
        renderer.xr.enabled = true;
        document.body.appendChild(VRButton.createButton(renderer));
        vrButtonRef.current = renderer.xr.getSession();

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Add axes
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        // Process data with D3
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.x))
            .range([-5, 5]);
        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.y))
            .range([-5, 5]);
        const zScale = d3.scaleLinear()
            .domain(d3.extent(data, d => +d.z))
            .range([-5, 5]);

        // Apply filters
        const filteredData = data.filter(d => {
            if (filters.category && d.category !== filters.category) return false;
            if (filters.xMin && +d.x < filters.xMin) return false;
            if (filters.xMax && +d.x > filters.xMax) return false;
            return true;
        });

        // Create scatter plot
        filteredData.forEach(d => {
            const geometry = new THREE.SphereGeometry(0.1, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: d.category === 'GroupA' ? 0xff0000 : 0x0000ff,
                shininess: 100,
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(xScale(+d.x), yScale(+d.y), zScale(+d.z));
            scene.add(sphere);
        });

        // Add lighting for better 3D effect
        const light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x404040));

        // Animation loop
        const animate = () => {
            renderer.setAnimationLoop(() => {
                controls.update();
                renderer.render(scene, camera);
            });
        };
        animate();

        // Handle window resize
        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.6);
        };
        window.addEventListener('resize', onWindowResize);

        return () => {
            window.removeEventListener('resize', onWindowResize);
            renderer.setAnimationLoop(null);
            document.body.removeChild(VRButton.createButton(renderer));
        };
    }, [data, filters]);

    return (
        <div className="visualization-container">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default Visualization;