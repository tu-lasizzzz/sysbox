import { Router } from 'express';
import { getSystem } from '../controllers/system.controller.js';

const router = Router();

router.get('/', getSystem);

export default router;
