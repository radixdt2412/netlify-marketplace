import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rx-marketplace/common';
import { cartRouter } from './routes/cart-route';
import { OrderRouter } from './routes/order-route';
const app = express();
import cors from "cors";
import { OrderStatusTypeRouter } from './routes/order-status-type-route';
import { OrderStatusRouter } from './routes/order-satus-route';
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
app.use(OrderStatusTypeRouter);
app.use(OrderStatusRouter);
app.use(cartRouter);
app.use(OrderRouter);

app.use(errorHandler);

app.all('*', async () => {
  throw new NotFoundError();
});

export { app };