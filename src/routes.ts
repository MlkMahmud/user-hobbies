import { Router } from 'express';
import controllers from './controllers';

const router = Router();

router.route('/users')
  .get(async (_req, res) => {
    const users = await controllers.getAllUsers();
    res.json({ success: true, data: users });
  })
  .post(async (req, res) => {
    const data = await controllers.createUser(req.body);
    res.statusCode = 201;
    res.json({ success: true, data });
  });

router.route('/users/:userId/hobbies')
  .get(async (req, res) => {
    const { userId } = req.params;
    const hobbies = await controllers.geHobbies(userId);
    res.json({ success: true, data: hobbies });
  })
  .post(async (req, res) => {
    const { userId } = req.params;
    const hobby = await controllers.createHobby({ ...req.body, user: userId });
    res.statusCode = 201;
    res.json({ success: true, data: hobby });
  });

export default router;
