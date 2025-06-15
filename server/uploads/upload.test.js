// @ts-nocheck
const request = require('supertest');
const express = require('express');
const uploadRouter = require('./upload');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/upload', uploadRouter);

describe('POST /upload', () => {
    let connection;

    beforeAll(async () => {
        connection = await mysql.createConnection({ ...dbConfig, database: 'data_viz_test_db' });
        await connection.execute('TRUNCATE TABLE datasets');
    });

    afterAll(async () => {
        await connection.end();
    });

    it('should upload a valid CSV and store it in MySQL', async () => {
        const filePath = path.join(__dirname, 'test-data.csv');
        fs.writeFileSync(filePath, 'x,y,z,category\n1,2,3,GroupA\n4,5,6,GroupB');

        const res = await request(app)
            .post('/upload')
            .attach('file', filePath);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);
        expect(res.body.data[0]).toEqual({ x: '1', y: '2', z: '3', category: 'GroupA' });

        const [rows] = await connection.execute('SELECT * FROM datasets');
        expect(rows).toHaveLength(1);
        expect(JSON.parse(rows[0].data)).toHaveLength(2);

        fs.unlinkSync(filePath);
    });

    it('should return 500 for invalid CSV', async () => {
        const filePath = path.join(__dirname, 'invalid.csv');
        fs.writeFileSync(filePath, 'invalid data');

        const res = await request(app)
            .post('/upload')
            .attach('file', filePath);

        expect(res.status).toBe(500);
        fs.unlinkSync(filePath);
    });
});