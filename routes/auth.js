const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser=require("../middleware/fetchuser")
const router = express.Router();
const JWT_SECRET = "rohitauthsecretkey";

//  ROUTE1 create a user no login required
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 5 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    // const user=User(req.body)
    // user.save()
    let success=false;
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400), json({success, errors: errors.array() });
      }
      let user = await User.findOne({success, email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "sorry a user with this email already exists" });
      }
      const salt = await bcrypt.genSalt(10);

      seqPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: seqPass,
      });
      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
     success=true;
      res.json({success,authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some error occured");
    }
  }
);

// ROUTE2 login a user no login required
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "enter avalid password").exists(),
  ],
  async (req, res) => {
    let success=false
   
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400), json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "Please enter correct credientials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false
        return res
          .status(400)
          .json({success, error: "Please enter correct credientials" });
      }

      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true
      res.json({success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some internal server error occured");
    }
  }
);

//  ROUTE3 get loggedin  user  login required
router.post(
  "/getuser",fetchuser,
 
  async (req, res) => {
    try {
      userId=req.user;
     
      const user= await User.findById(userId).select("-password");
     
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("some internal server error occured");
    }
  })

module.exports = router;
