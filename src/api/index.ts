import { Router } from 'express';
import authentication from './authentication/authentication.controller';
import vendor from './vendor/vendor.controller';

const routes = Router();

routes.use('/auth', authentication);
routes.use('/vendor', vendor);

export default routes;
