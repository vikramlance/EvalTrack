const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Get all job applications for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const jobs = await prisma.jobApplication.findMany({
      where: { userId: req.user.id },
      orderBy: { appliedDate: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new job application
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { 
      jobTitle, 
      company, 
      applicationUrl, 
      resumeVersion, 
      contactName, 
      contactEmail, 
      contactLinkedIn, 
      notes, 
      status, 
      appliedDate 
    } = req.body;

    const job = await prisma.jobApplication.create({
      data: {
        jobTitle,
        company,
        applicationUrl,
        resumeVersion,
        contactName,
        contactEmail,
        contactLinkedIn,
        notes,
        status: status || 'Applied',
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        userId: req.user.id
      }
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific job application
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const job = await prisma.jobApplication.findUnique({
      where: { 
        id: req.params.id,
        userId: req.user.id 
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a job application
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { 
      jobTitle, 
      company, 
      applicationUrl, 
      resumeVersion, 
      contactName, 
      contactEmail, 
      contactLinkedIn, 
      notes, 
      status, 
      appliedDate 
    } = req.body;

    // Check if job exists and belongs to user
    const existingJob = await prisma.jobApplication.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingJob) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    if (existingJob.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const job = await prisma.jobApplication.update({
      where: { id: req.params.id },
      data: {
        jobTitle,
        company,
        applicationUrl,
        resumeVersion,
        contactName,
        contactEmail,
        contactLinkedIn,
        notes,
        status,
        appliedDate: appliedDate ? new Date(appliedDate) : existingJob.appliedDate
      }
    });

    res.json(job);
  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job application
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    // Check if job exists and belongs to user
    const existingJob = await prisma.jobApplication.findUnique({
      where: { 
        id: req.params.id
      }
    });

    if (!existingJob) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    if (existingJob.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete the job
    await prisma.jobApplication.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Job application deleted' });
  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get job application statistics
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const jobs = await prisma.jobApplication.findMany({
      where: { userId: req.user.id }
    });

    // Calculate statistics
    const totalApplications = jobs.length;
    const statusCounts = {
      Applied: jobs.filter(job => job.status === 'Applied').length,
      Interview: jobs.filter(job => job.status === 'Interview').length,
      Offer: jobs.filter(job => job.status === 'Offer').length,
      Rejected: jobs.filter(job => job.status === 'Rejected').length
    };

    // Calculate applications per day (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const applicationsPerDay = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      applicationsPerDay[dateString] = 0;
    }

    jobs.forEach(job => {
      const appliedDate = new Date(job.appliedDate);
      if (appliedDate >= thirtyDaysAgo) {
        const dateString = appliedDate.toISOString().split('T')[0];
        if (applicationsPerDay[dateString] !== undefined) {
          applicationsPerDay[dateString]++;
        }
      }
    });

    res.json({
      totalApplications,
      statusCounts,
      applicationsPerDay
    });
  } catch (error) {
    console.error('Job stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
