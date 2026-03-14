import express from "express";
import cors from "cors";
import cookieSession from "cookie-session";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:4321",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: ["supersecretkey"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(userRoutes);

app.listen(4500, () => {
  console.log("Server running on http://localhost:4500");
});
