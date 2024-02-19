import { Router } from 'express';
import authentication from './authentication/authentication.controller';

const routes = Router();

routes.use('/auth', authentication);

export default routes;
