import { Router } from 'express';

import UserController from './app/controllers/UserController';
import auth from './app/middleware/auth';

const routes = new Router();

routes.post('/users', UserController.store);

routes.use(auth);

export default routes;
