import express from "express";
import connection from "./db/config";
import globalErrorHandler from "./controllers/errorController";
import userRouter from "./routes/userRouter";
import authRouter from "./routes/authRouter";
import productRouter from "./routes/productRouter";
import orderRouter from "./routes/orderRouter";
import typeRouter from "./routes/typeRouter";
import cors from "cors";
import config from "./config/index"

const port = config.port;

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

connection
  .sync()
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((err) => {
    console.log("Error", err);
  });

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/types', typeRouter);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});