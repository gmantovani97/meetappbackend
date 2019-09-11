import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string()
        .required()
        .min(6),
      passwordConfirmation: Yup.string()
        .required()
        .oneOf([Yup.ref('password')]),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { email } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const { name } = await User.create(req.body);

    return res.status(200).json({ name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      passwordConfirmation: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const {
      userId,
      body: { name, email, oldPassword, password },
    } = req;

    const user = await User.findByPk(userId);

    const updateObject = {};

    if (name) {
      Object.assign(updateObject, { name });
    }

    if (email) {
      const emailExists = await User.findOne({ where: { email } });
      if (!emailExists) {
        Object.assign(updateObject, { email });
      } else {
        return res
          .status(400)
          .json({ error: 'The email you provided is already in use' });
      }
    }

    if (oldPassword) {
      const isPasswordValid = await user.checkPassword(oldPassword);
      if (!isPasswordValid) {
        return res
          .status(400)
          .json({ error: 'The password you provided is incorrect' });
      }
      Object.assign(updateObject, { password });
    }

    const { id } = await user.update(updateObject);

    return res.json({ id, name, email });
  }
}

export default new UserController();
