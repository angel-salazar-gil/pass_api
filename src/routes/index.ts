import { Router } from "express";
import auth from './auth';
import user from './user';
import pass from './pass';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', user);
routes.use('/passes', pass);

export default routes;