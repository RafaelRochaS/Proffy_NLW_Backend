import express from 'express';



const routes = express.Router();



routes.get('/', (request, response) => {
    return response.json({ message: 'Tá on' });
});

routes.post('/classes', );

export default routes;