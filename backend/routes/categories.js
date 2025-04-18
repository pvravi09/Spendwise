const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock categories database
const categories = [];

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all categories
router.get('/', verifyToken, (req, res) => {
  res.json(categories);
});

// Create category
router.post('/', verifyToken, (req, res) => {
  const { name, priority, budget } = req.body;
  const category = {
    id: Date.now().toString(),
    name,
    priority,
    budget,
    spent: 0
  };
  categories.push(category);
  res.status(201).json(category);
});

// Update category
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { name, priority, budget, spent } = req.body;
  
  const category = categories.find(c => c.id === id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  if (name) category.name = name;
  if (priority) category.priority = priority;
  if (budget) category.budget = budget;
  if (spent !== undefined) category.spent = spent;

  res.json(category);
});

// Delete category
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Category not found' });
  }

  categories.splice(index, 1);
  res.status(204).send();
});

module.exports = router; 