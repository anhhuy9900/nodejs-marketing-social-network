import express from 'express';
import FacebookRoutes from './facebook';
import GoogleRoutes from './google';

const app = express.Router();
app.use('/facebook', FacebookRoutes);
app.use('/google', GoogleRoutes);

export default app;