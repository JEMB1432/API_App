const user = require("../controllers/user.controller");

const express = require("express");

const router = express.Router();

router.get("/user", user.getAllUsers);
router.get("/user/:id", user.getUserById);
router.get("/user/email/:email", user.getUserByEmail);
router.post("/user", (req, res, next) => {
  console.log("POST /user hit");
  user.createUser(req, res, next);
});
router.put("/user/:id", user.updateUser);
router.delete("/user/:id", user.deleteUser);

module.exports = router;
