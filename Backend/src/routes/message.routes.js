import { Router } from 'express'
import { add_to_message, previousMessages } from '../controllers/message.controller.js';

const router = Router()

router.route('/add_to_message').post(add_to_message)
router.route('/previous_message').post(previousMessages)

export default router;