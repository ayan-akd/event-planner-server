import express, { Application, Request, Response } from "express";
import cors from "cors";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import cookieParser from "cookie-parser";
import router from "./app/routes";

const app: Application = express();
app.use(cors());
app.use(cookieParser());
//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000","https://evenzo.vercel.app"],
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Event Planning Management API running .",
  });
});

app.use("/api", router);

//not found route
app.use((req: Request, res: Response) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    status: httpStatus.NOT_FOUND,
    message: "API NOT FOUND!",
    stack: null,
  });
});

app.use(globalErrorHandler);

export default app;
