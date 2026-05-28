require('dotenv').config();
const express = require('express');
const cors = require('cors');
const employees = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/employees', employees);

app.get('/', (req, res) => res.json({ok: true, msg: 'Backend up'}));

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
