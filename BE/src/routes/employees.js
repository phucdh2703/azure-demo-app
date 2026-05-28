const express = require('express');
const { pool } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, position, created_at FROM employees ORDER BY id'
    );

    res.json(rows);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
      detail: err.detail,
      stack: err.stack
    });
  }
});

router.post('/', async (req, res) => {
  const { name, position } = req.body;

  if (!name) {
    return res.status(400).json({
      error: 'name is required'
    });
  }

  try {
    const { rows } = await pool.query(
      `
      INSERT INTO employees (name, position)
      VALUES ($1, $2)
      RETURNING id, name, position, created_at
      `,
      [name, position || null]
    );

    res.status(201).json(rows[0]);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
      detail: err.detail,
      stack: err.stack
    });
  }
});

module.exports = router;