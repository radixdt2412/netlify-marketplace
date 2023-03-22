import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@rx-marketplace/common';
import { adminAuthRouter } from './routes/admin-router';
import { customerRouter } from './routes/customer-auth';
import { customerAddressRouter } from './routes/customer-address-route';
import { stateRouter } from './routes/state-route';
import { countryRouter } from './routes/country-route';
import { cityRouter } from './routes/city-route';
import { BusinessUserRouter } from './routes/business-user-auth-route';
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "../src/swagger.json"
const app = express();

// The reason for this that traffic is being prixy to our app through ingress nginx
app.set('trust proxy', true);
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    signed: false, // Disable encrypction in cookie
    secure : true, // use cookie only on https connection
    // secure: process.env.NODE_ENV !== 'test',
  })
);
var corsOptions = {
  origin: '*', 
  
}
app.use(cors(corsOptions));

app.use("/api/users/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument),()=>{
  console.log('swagger');
  
});

// Router
app.use(adminAuthRouter);
app.use(customerRouter);
app.use(customerAddressRouter);
app.use(stateRouter);
app.use(countryRouter);
app.use(cityRouter);
app.use(BusinessUserRouter);


app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };