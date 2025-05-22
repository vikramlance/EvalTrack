const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all metrics for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const metrics = await prisma.metric.findMany({
      where: { userId: req.user.id },
      include: {
        metricLogs: {
          orderBy: { date: 'desc' },
          take: 30 // Last 30 logs for charts
        }
      }
    });

    res.json(metrics);
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new metric
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, target, unit, endDate } = req.body;

    const metric = await prisma.metric.create({
      data: {
        name,
        description,
        target,
        unit,
        endDate: endDate ? new Date(endDate) : null,
        userId: req.user.id
      }
    });

    res.status(201).json(metric);
  } catch (error) {
    console.error('Create metric error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific metric
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const metric = await prisma.metric.findUnique({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      },
      include: {
        metricLogs: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!metric) {
      return res.status(404).json({ message: 'Metric not found' });
    }

    res.json(metric);
  } catch (error) {
    console.error('Get metric error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a metric
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, target, current, unit, endDate } = req.body;

    // Check if metric exists and belongs to user
    const existingMetric = await prisma.metric.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingMetric) {
      return res.status(404).json({ message: 'Metric not found' });
    }

    if (existingMetric.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const metric = await prisma.metric.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        target,
        current,
        unit,
        endDate: endDate ? new Date(endDate) : existingMetric.endDate
      }
    });

    res.json(metric);
  } catch (error) {
    console.error('Update metric error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a metric
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if metric exists and belongs to user
    const existingMetric = await prisma.metric.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingMetric) {
      return res.status(404).json({ message: 'Metric not found' });
    }

    if (existingMetric.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete related metric logs first
    await prisma.metricLog.deleteMany({
      where: { metricId: req.params.id }
    });

    // Delete the metric
    await prisma.metric.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Metric deleted' });
  } catch (error) {
    console.error('Delete metric error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a log entry to a metric
router.post('/:id/logs', authenticateToken, async (req, res) => {
  try {
    const { value, note, date } = req.body;

    // Check if metric exists and belongs to user
    const existingMetric = await prisma.metric.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingMetric) {
      return res.status(404).json({ message: 'Metric not found' });
    }

    if (existingMetric.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create log entry
    const log = await prisma.metricLog.create({
      data: {
        value,
        note,
        date: date ? new Date(date) : new Date(),
        metricId: req.params.id
      }
    });

    // Update current value of the metric
    await prisma.metric.update({
      where: { id: req.params.id },
      data: { current: existingMetric.current + value }
    });

    res.status(201).json(log);
  } catch (error) {
    console.error('Add log error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard summary data
router.get('/dashboard/summary', authenticateToken, async (req, res) => {
  try {
    // Get metrics summary
    const metrics = await prisma.metric.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        name: true,
        current: true,
        target: true,
        unit: true
      }
    });

    // Get job applications summary
    const jobApplications = await prisma.jobApplication.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        status: true,
        appliedDate: true
      }
    });

    // Calculate job stats
    const totalApplications = jobApplications.length;
    const interviews = jobApplications.filter(job => job.status === 'Interview').length;
    const offers = jobApplications.filter(job => job.status === 'Offer').length;
    const rejected = jobApplications.filter(job => job.status === 'Rejected').length;

    // Get active challenges
    const challenges = await prisma.challenge.findMany({
      where: { 
        userId: req.user.id,
        endDate: { gte: new Date() },
        isCompleted: false
      },
      select: {
        id: true,
        name: true,
        current: true,
        target: true,
        endDate: true
      },
      take: 3,
      orderBy: { endDate: 'asc' }
    });

    // Get recent prep activities
    const prepActivities = await prisma.prepActivity.findMany({
      where: { userId: req.user.id },
      orderBy: { date: 'desc' },
      take: 5
    });

    // Calculate application streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const hasAppliedToday = jobApplications.some(job => {
      const appliedDate = new Date(job.appliedDate);
      appliedDate.setHours(0, 0, 0, 0);
      return appliedDate.getTime() === today.getTime();
    });
    
    const hasAppliedYesterday = jobApplications.some(job => {
      const appliedDate = new Date(job.appliedDate);
      appliedDate.setHours(0, 0, 0, 0);
      return appliedDate.getTime() === yesterday.getTime();
    });

    // Return dashboard data
    res.json({
      metrics,
      jobStats: {
        totalApplications,
        interviews,
        offers,
        rejected
      },
      challenges,
      recentPrep: prepActivities,
      streak: {
        hasAppliedToday,
        hasAppliedYesterday
      }
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
