const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all prep activities for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const prepActivities = await prisma.prepActivity.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' }
    });

    res.json(prepActivities);
  } catch (error) {
    console.error('Get prep activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new prep activity
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { type, date, selfRating, notes } = req.body;

    const prepActivity = await prisma.prepActivity.create({
      data: {
        type,
        date: date ? new Date(date) : new Date(),
        selfRating,
        notes,
        userId: req.user.id
      }
    });

    res.status(201).json(prepActivity);
  } catch (error) {
    console.error('Create prep activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific prep activity
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const prepActivity = await prisma.prepActivity.findUnique({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!prepActivity) {
      return res.status(404).json({ message: 'Prep activity not found' });
    }

    res.json(prepActivity);
  } catch (error) {
    console.error('Get prep activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a prep activity
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { type, date, selfRating, notes } = req.body;

    // Check if prep activity exists and belongs to user
    const existingPrepActivity = await prisma.prepActivity.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingPrepActivity) {
      return res.status(404).json({ message: 'Prep activity not found' });
    }

    if (existingPrepActivity.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const prepActivity = await prisma.prepActivity.update({
      where: { id: req.params.id },
      data: {
        type,
        date: date ? new Date(date) : existingPrepActivity.date,
        selfRating,
        notes
      }
    });

    res.json(prepActivity);
  } catch (error) {
    console.error('Update prep activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a prep activity
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if prep activity exists and belongs to user
    const existingPrepActivity = await prisma.prepActivity.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingPrepActivity) {
      return res.status(404).json({ message: 'Prep activity not found' });
    }

    if (existingPrepActivity.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the prep activity
    await prisma.prepActivity.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Prep activity deleted' });
  } catch (error) {
    console.error('Delete prep activity error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get prep activity statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const prepActivities = await prisma.prepActivity.findMany({
      where: { userId: req.user.id }
    });

    // Calculate statistics by type
    const typeCounts = {
      DSA: prepActivities.filter(prep => prep.type === 'DSA').length,
      SystemDesign: prepActivities.filter(prep => prep.type === 'SystemDesign').length,
      MockInterview: prepActivities.filter(prep => prep.type === 'MockInterview').length,
      Leetcode: prepActivities.filter(prep => prep.type === 'Leetcode').length
    };

    // Calculate average ratings by type
    const typeRatings = {
      DSA: calculateAverageRating(prepActivities.filter(prep => prep.type === 'DSA')),
      SystemDesign: calculateAverageRating(prepActivities.filter(prep => prep.type === 'SystemDesign')),
      MockInterview: calculateAverageRating(prepActivities.filter(prep => prep.type === 'MockInterview')),
      Leetcode: calculateAverageRating(prepActivities.filter(prep => prep.type === 'Leetcode'))
    };

    // Calculate activities per day (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const activitiesPerDay = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      activitiesPerDay[dateString] = 0;
    }

    prepActivities.forEach(activity => {
      const activityDate = new Date(activity.date);
      if (activityDate >= thirtyDaysAgo) {
        const dateString = activityDate.toISOString().split('T')[0];
        if (activitiesPerDay[dateString] !== undefined) {
          activitiesPerDay[dateString]++;
        }
      }
    });

    res.json({
      totalActivities: prepActivities.length,
      typeCounts,
      typeRatings,
      activitiesPerDay
    });
  } catch (error) {
    console.error('Prep stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate average rating
function calculateAverageRating(activities) {
  if (activities.length === 0) return 0;
  
  const validRatings = activities.filter(activity => activity.selfRating !== null);
  if (validRatings.length === 0) return 0;
  
  const sum = validRatings.reduce((total, activity) => total + activity.selfRating, 0);
  return sum / validRatings.length;
}

module.exports = router;
