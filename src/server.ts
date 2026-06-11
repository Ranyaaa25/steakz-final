import "dotenv/config";
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import methodOverride from "method-override";
import path from "node:path";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import labApiRoutes from "./routes/labApiRoutes.js";
import pageRoutes from "./routes/pageRoutes.js";
import { setLocals } from "./middleware/locals.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.set("view engine", "pug");
app.set("views", path.join(process.cwd(), "src", "views"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, X-User-Role, X-User-Branch");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json());
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
app.use(labApiRoutes);
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
