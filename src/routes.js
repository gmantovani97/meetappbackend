import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => res.json({ a: 'a' }));

export default routes;
