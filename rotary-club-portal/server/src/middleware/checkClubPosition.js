import Member from '../models/Member.js';
import { logger } from '../config/logger.js';

/**
 * Middleware to check if user has a specific club position
 * Positions that grant admin access: President, Secretary, Treasurer
 */
export const checkClubPosition = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Get member profile with committees
    const member = await Member.findOne({ user: req.user._id });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Member profile not found',
      });
    }

    // Check if user is super_admin (always has access)
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Define positions that grant admin access
    const adminPositions = ['President', 'Secretary', 'Treasurer'];

    // Check current committees for admin positions
    const hasAdminPosition = member.committees?.some((committee) => {
      const position = committee.position?.trim();
      return adminPositions.some((adminPos) => 
        position?.toLowerCase().includes(adminPos.toLowerCase())
      );
    });

    if (!hasAdminPosition) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only President, Secretary, and Treasurer can access this resource.',
        requiredPositions: adminPositions,
      });
    }

    // User has admin position, proceed
    next();
  } catch (error) {
    logger.error('Error in checkClubPosition middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error checking club position',
    });
  }
};

/**
 * Combined middleware: Check if user has admin role OR admin club position
 */
export const requireAdminAccess = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Super admin always has access
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Get member profile
    const member = await Member.findOne({ user: req.user._id });

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'Member profile not found',
      });
    }

    // Check for admin positions
    const adminPositions = ['President', 'Secretary', 'Treasurer'];
    const hasAdminPosition = member.committees?.some((committee) => {
      const position = committee.position?.trim();
      return adminPositions.some((adminPos) => 
        position?.toLowerCase().includes(adminPos.toLowerCase())
      );
    });

    if (!hasAdminPosition) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only President, Secretary, and Treasurer can access admin panel.',
        requiredPositions: adminPositions,
      });
    }

    next();
  } catch (error) {
    logger.error('Error in requireAdminAccess middleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error checking admin access',
    });
  }
};
