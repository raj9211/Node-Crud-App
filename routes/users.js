const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.post("/register", userController.create);
router.post("/userLogin", userController.userLogin);
router.get("/users", userController.getAllUsers);
router.get("/getParticularUser/:userId", userController.getParticularUser);
router.patch("/updateUser/:userId", userController.updateUser);
router.delete("/deleteUser/:userId", userController.deleteUser);

module.exports = router;