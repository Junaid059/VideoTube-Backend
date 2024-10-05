import express from "express";
import cors from "cors";
import cookieParser from "cookieparser";

const app = express();

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    Credential: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

export default app;
