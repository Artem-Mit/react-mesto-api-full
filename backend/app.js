const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const cors = require("cors");
const { celebrate, Joi, errors } = require("celebrate");
const usersRouter = require("./routes/users");
const cardsRouter = require("./routes/cards");
const auth = require("./middlewares/auth");
const { login, createUser } = require("./controllers/users");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

require("dotenv").config();

const { NODE_ENV, SRV_MONGO_URL } = process.env;

const app = express();
const { PORT = 3000 } = process.env;
const limiter = rateLimit({
  windowMs: 45 * 60 * 1000, // 45 minutes
  max: 500, // Limit each IP to 100 requests per `window` (here, per 45 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

mongoose.set("strictQuery", true);
mongoose.connect(NODE_ENV === "production" ? SRV_MONGO_URL : "mongodb://127.0.0.1:27017/mestodb");

app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(bodyParser.json());
app.use(requestLogger);
app.post("/signin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https:\/\//i),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
app.use(auth);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);
app.use("*", (req, res) => {
  res.status(404).send({ message: "Not available" });
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
