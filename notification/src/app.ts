import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rx-marketplace/common';

const app = express();
import cors from "cors";
import { notificationRouter } from './routes/notification-route';
// The reason for this that traffic is being prixy to our app through ingress nginx
app.set('trust proxy', true);
app.use(express.json());

app.use(
  cookieSession({
    signed: false, // Disable encrypction in cookie
    // secure : true, // use cookie only on https connection
    secure: process.env.NODE_ENV !== 'test',
  })
);
var corsOptions = {
  origin: '*', 
  
}
app.use(cors(corsOptions));
// Router

app.use(notificationRouter);

app.use(errorHandler);
app.all('*', async () => {
  throw new NotFoundError();
});

export { app };