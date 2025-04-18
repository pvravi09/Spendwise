const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock rules database
const rules = [
  {
    id: '1',
    name: '50/30/20 Rule',
    description: '50% Needs, 30% Wants, 20% Savings',
    allocations: {
      needs: 50,
      wants: 30,
      savings: 20
    }
  },
  {
    id: '2',
    name: 'Zero-Based Budgeting',
    description: 'Every rupee/dollar assigned',
    allocations: {
      needs: 0,
      wants: 0,
      savings: 0
    }
  }
];

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

// Get all rules
router.get('/', verifyToken, (req, res) => {
  res.json(rules);
});

// Get active rule
router.get('/active', verifyToken, (req, res) => {
  const activeRule = rules[0]; // Default to first rule
  res.json(activeRule);
});

// Set active rule
router.post('/:id/activate', verifyToken, (req, res) => {
  const { id } = req.params;
  const rule = rules.find(r => r.id === id);
  
  if (!rule) {
    return res.status(404).json({ message: 'Rule not found' });
  }

  // Move the selected rule to the first position
  const index = rules.findIndex(r => r.id === id);
  const [selectedRule] = rules.splice(index, 1);
  rules.unshift(selectedRule);

  res.json(selectedRule);
});

// Customize rule allocations
router.put('/:id/customize', verifyToken, (req, res) => {
  const { id } = req.params;
  const { allocations } = req.body;
  
  const rule = rules.find(r => r.id === id);
  if (!rule) {
    return res.status(404).json({ message: 'Rule not found' });
  }

  rule.allocations = allocations;
  res.json(rule);
});

module.exports = router; 