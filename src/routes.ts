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

export default router;
