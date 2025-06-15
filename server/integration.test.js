// @ts-nocheck
const request = require('supertest');
const express = require('express');
const uploadRouter = require('./routes/upload');
const mysql = require('mysql2/promise');
const dbConfig = require('./config/db');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use('/upload', uploadRouter);

describe('Integration: File Upload to Database', () => {
    let connection;

    beforeAll(async () => {
        connection = await mysql.createConnection({ ...dbConfig, database: 'data_viz_test_db' });
        await connection.execute('TRUNCATE TABLE datasets');
    });

    afterAll(async () => {
        await connection.end();
    });

    it('should upload CSV and store in database', async () => {
        const filePath = path.join(__dirname, 'test-data.csv');
        fs.writeFileSync(filePath, 'x,y,z,category\n1,2,3,GroupA\n4,5,6,GroupB');

        const res = await request(app)
            .post('/upload')
            .attach('file', filePath);

        expect(res.status).toBe(200);
        expect(res.body.data).toHaveLength(2);

        const [rows] = await connection.execute('SELECT * FROM datasets');
        expect(rows).toHaveLength(1);
        expect(JSON.parse(rows[0].data)).toHaveLength(2);

        fs.unlinkSync(filePath);
    });
});