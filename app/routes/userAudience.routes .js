module.exports = (app) => {
  // const tutorials = require("../controllers/tutorial.controller.js");
  const userAudience = require("../controllers/userAudience.controller");

  var router = require("express").Router();

  // ===> Audience
  // Create a new userAudience
  router.post("/", userAudience.createUserAudience);
  // Find a new userAudience
  router.get("/:id", userAudience.findOneAudience);

  app.use("/api/audience", router);
};
