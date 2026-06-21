import { Router } from 'express';
import { validateFileName, validateFileBody } from '../middleware/validator.js';
import * as filesCtrl from '../controllers/files.controller.js';

const router = Router();

router.get('/', filesCtrl.list);
router.get('/:name', validateFileName, filesCtrl.read);
router.post('/', validateFileBody, filesCtrl.create);
router.put('/:name', validateFileName, filesCtrl.update);
router.delete('/:name', validateFileName, filesCtrl.remove);

export default router;
