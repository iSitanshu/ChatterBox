import { Router } from "express";
import { join_room, create_room, my_rooms, channels, no_of_users } from "../controllers/room.controller.js";

const router = Router()

router.route('/create').post(create_room)
router.route('/join').post(join_room)
router.route('/my_rooms').post(my_rooms)
router.route('/channels').post(channels)
router.route('/no_of_user').post(no_of_users)

export default router;