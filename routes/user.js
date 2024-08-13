const { Router } = require("express");
const router = Router();
const User = require("../models/user");
const { createHmac } = require("crypto");
const { createTokenForUser } = require("../services/authentication");
const {
  checkForAuthenticationCookie,
} = require("../middlewares/authentication");
const {
  noNeedOfCookiesForSignupAndSignin,
} = require("../middlewares/noCookies");

//render signin page
router.get("/signin", (req, res) => {
  return res.status(200).render("signin");
});

//post signin

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(
      email,
      password,
    ); //* First it matches the email if matched then hashed the given password, compare both password if true then passed that user to createTokenForUser(user) function which will create a token and return it

    //   const { email, password } = req.body;                              //I CAN DO LIKE THAT ALSO 😎😎😎😎
    //   const user = await User.findOne({ email: email });                 //BUT KEEP THINGS SEPERATE IS GOOD PRACTICE😊😊😊
    //   if (!user) throw new Error("User not found!");
    //   const salt = user.salt;
    //   const hashedPassword = user.password;
    //   const userProvidedHash = createHmac("sha256", salt)
    //     .update(password)
    //     .digest("hex");
    //   if (hashedPassword !== userProvidedHash)
    //     throw new Error("Incorrect Password!");

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    res.status(400).render("signin", { error: "Incorrect Email or Password" }); //if error render error
  }
});

//render signup page

router.get("/signup", (req, res) => {
  return res.status(200).render("signup");
});

//post signup
router.post("/signup", async (req, res) => {
  const { fullname, email, password } = req.body;
  if (fullname.split(" ").length < 2) {
    return res
      .status(400)
      .render("signup", { fullnameErr: "Fullname Should Be 2 Characters!" });
  }
  try {
    // Create a new user
    const user = await User.create({ fullname, email, password });
    const token = createTokenForUser(user);
    return res.cookie("token", token).redirect("/");
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("Internal Server Error"); // Handle signup error
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
