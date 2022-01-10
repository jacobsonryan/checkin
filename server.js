const express = require("express");
const app = express();
const db = require("./models");
const cors = require('cors')
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors())

const apiRoutes = require("./routes/routes");
app.use("/api", apiRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
  });
});