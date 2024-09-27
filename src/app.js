import express from "express";
import cors from "cors";
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

export default app;
