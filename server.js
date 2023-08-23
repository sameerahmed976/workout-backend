import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import workoutsRouter from "./routes/workoutsRoutes";
import errorHandler from "./middlewares/errorHandler";
import dbConnect from "./db/dbConnect";
import UsersRouter from "./routes/usersRoutes";
const app = express();

// const whiteList = ["https://awesome-recipes.onrender.com", "https://awesome-recipes.onrender.com"];
const whiteList = ["https://awesome-recipes.onrender.com"];

// ! origin  for postman

const corsOptions = {
  origin: (origin, callback) => {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(express.static("/public"));

app.use(cors(corsOptions));
// env file
dotenv.config();
// database initialize
dbConnect();

const PORT = process.env.PORT || 8000;
//middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//work out routes
app.use("/api/workouts", workoutsRouter);
// auth
app.use("/api", UsersRouter);

app.get("/", (req, res) => {
  res.send("welcome to work out  tracker API ");
});

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server started at port http://localhost:${PORT}`);
});
