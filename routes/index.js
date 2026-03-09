var express = require('express');
var router = express.Router();
/* GET home page. */
//localhost:3000
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/init', async function (req, res, next) {
  try {
    let roleModel = require("../schemas/roles");
    let userModel = require("../schemas/users");
    let userController = require('../controllers/users');

    // 1. Tao Role
    let roleAdmin = await roleModel.findOne({ name: "ADMIN" });
    if (!roleAdmin) {
      roleAdmin = new roleModel({ name: "ADMIN", description: "Admin Role" });
      await roleAdmin.save();
    }

    let roleMod = await roleModel.findOne({ name: "MODERATOR" });
    if (!roleMod) {
      roleMod = new roleModel({ name: "MODERATOR", description: "Moderator Role" });
      await roleMod.save();
    }

    // 2. Tao User Admin
    let adminUser = await userModel.findOne({ username: "admin_user" });
    if (!adminUser) {
      await userController.CreateAnUser(
        "admin_user", "admin_password", "admin@gmail.com", roleAdmin._id,
        undefined, "Admin User", true, 0
      );
    }

    // 3. Tao User Mod
    let modUser = await userModel.findOne({ username: "mod_user" });
    if (!modUser) {
      await userController.CreateAnUser(
        "mod_user", "mod_password", "mod@gmail.com", roleMod._id,
        undefined, "Mod User", true, 0
      );
    }

    res.send({ message: "Khoi tao du lieu thanh cong" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
