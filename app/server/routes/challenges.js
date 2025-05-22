const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all challenges for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const challenges = await prisma.challenge.findMany({
      where: { userId: req.user.id },
      orderBy: { endDate: 'asc' }
    });

    res.json(challenges);
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new challenge
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, startDate, endDate, target, unit } = req.body;

    const challenge = await prisma.challenge.create({
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: new Date(endDate),
        target,
        unit,
        userId: req.user.id
      }
    });

    res.status(201).json(challenge);
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific challenge
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const challenge = await prisma.challenge.findUnique({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    res.json(challenge);
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a challenge
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, startDate, endDate, target, current, unit, isCompleted } = req.body;

    // Check if challenge exists and belongs to user
    const existingChallenge = await prisma.challenge.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (existingChallenge.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const challenge = await prisma.challenge.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        startDate: startDate ? new Date(startDate) : existingChallenge.startDate,
        endDate: endDate ? new Date(endDate) : existingChallenge.endDate,
        target,
        current,
        unit,
        isCompleted: isCompleted !== undefined ? isCompleted : existingChallenge.isCompleted
      }
    });

    res.json(challenge);
  } catch (error) {
    console.error('Update challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a challenge
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if challenge exists and belongs to user
    const existingChallenge = await prisma.challenge.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (existingChallenge.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the challenge
    await prisma.challenge.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Challenge deleted' });
  } catch (error) {
    console.error('Delete challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update challenge progress
router.put('/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { progress } = req.body;

    // Check if challenge exists and belongs to user
    const existingChallenge = await prisma.challenge.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (existingChallenge.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Calculate new current value
    const newCurrent = existingChallenge.current + progress;
    
    // Check if challenge is completed
    const isCompleted = newCurrent >= existingChallenge.target;

    const challenge = await prisma.challenge.update({
      where: { id: req.params.id },
      data: {
        current: newCurrent,
        isCompleted
      }
    });

    res.json(challenge);
  } catch (error) {
    console.error('Update challenge progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
