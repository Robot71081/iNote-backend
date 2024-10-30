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
    body("email", "Enter a valid email").isEmail(),
    body("password", "Enter a valid password").exists(),
  ],
  async (req, res) => {
    let success = false;

    // Validate request
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() }); // Fixed the error here
    }

    const { email, password } = req.body;

    try {
      // Find user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ success, error: "Please enter correct credentials" }); // Corrected typo
      }

      // Compare password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ success, error: "Please enter correct credentials" }); // Corrected typo
      }

      // Create JWT token
      const data = {
        user: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;

      // Send response
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some internal server error occurred"); // Capitalized for consistency
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
