const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

dotenv.config();

const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/task");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*", // Allow all origins or specify your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  console.log("controll reach");
  res.status(200).send({ hello: "word" });
});
