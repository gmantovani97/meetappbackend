import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .min(6)
        .required(),
    });

    if (!schema.isValid) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'User do not exists' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ email, password }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });

    return res.json({ token });
  }
}

export default new SessionController();