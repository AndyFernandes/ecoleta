import express from 'express';

import PointsControllers from './controllers/PointsControllers';
import ItensControllers from './controllers/ItensControllers';

const routes = express.Router();
const pointsControllers = new PointsControllers();
const itensControllers = new ItensControllers();

routes.get('/items', itensControllers.index);
routes.post('/points', pointsControllers.create);
routes.get('/points/:id', pointsControllers.show);
routes.get('/points', pointsControllers.index);

export default routes;