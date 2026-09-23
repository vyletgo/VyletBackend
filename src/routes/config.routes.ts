import { Router } from 'express';
import { getGoogleMapsKey, health } from '../controllers/config.controller.js';

const router = Router();

router.get('/health', health);
router.get('/config/google-maps-key', getGoogleMapsKey);

export default router;
