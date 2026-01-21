import express from 'express';
import {
    getSkills,
    getSkill,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillsByTeacher,
    getMySkills,
    getCategories
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/my', protect, getMySkills);
router.get('/teacher/:teacherId', getSkillsByTeacher);

router.route('/')
    .get(getSkills)
    .post(protect, createSkill);

router.route('/:id')
    .get(getSkill)
    .put(protect, updateSkill)
    .delete(protect, deleteSkill);

export default router;
