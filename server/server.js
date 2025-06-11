const express = require('express');
const cors = require('cors');
const uploadRouter = require('./routes/upload');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/upload', uploadRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));