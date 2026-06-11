import "dotenv/config";
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import path from "node:path";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import { setLocals } from "./middleware/locals.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set("view engine", "pug");
app.set("views", path.join(process.cwd(), "src", "views"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "student-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(setLocals);

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(pageRoutes);

app.use((req, res) => {
  res.status(404).render("404", {
    title: "Page Not Found",
    message: "The page you requested was not found.",
  });
});

const server = app.listen(port, () => {
  console.log(`Steakz MIS running at http://localhost:${port}`);
});

export { server };
