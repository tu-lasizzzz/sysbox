import { Router } from 'express';
import { getEnvironment } from '../controllers/env.controller.js';

const router = Router();

router.get('/', getEnvironment);

export default router;
