// @ts-nocheck
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            try {
                const connection = await mysql.createConnection(dbConfig);
                await connection.execute(
                    'INSERT INTO datasets (name, data) VALUES (?, ?)',
                    [req.file.originalname, JSON.stringify(results)]
                );
                await connection.end();
                fs.unlinkSync(req.file.path);
                res.json({ data: results });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        });
});

module.exports = router;