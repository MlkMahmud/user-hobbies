import { Router } from 'express';
import controllers from './controllers';

const router = Router();

router.route('/')
  .get(async (_req, res) => {
    const users = await controllers.getAllUsers();
    res.json({ success: true, data: users });
  })
  .post(async (req, res) => {
    const data = await controllers.createUser(req.body);
    res.statusCode = 201;
    res.json({ success: true, data });
  });

router.route('/:userId/hobbies')
  .get(async (req, res) => {
    const { userId } = req.params;
    const hobbies = await controllers.getHobbies(userId);
    res.json({ success: true, data: hobbies });
  })
  .post(async (req, res) => {
    const { userId } = req.params;
    const hobby = await controllers.createHobby({ ...req.body, userId });
    res.statusCode = 201;
    res.json({ success: true, data: hobby });
  });

router.route('/:userId/hobbies/:hobbyId')
  .delete(async (req, res) => {
    const { userId, hobbyId } = req.params;
    await controllers.deleteHobby(hobbyId, userId);
    res.json({ success: true, data: {} });
  })

export default router;
