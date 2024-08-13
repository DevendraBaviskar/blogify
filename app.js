//!Packages
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
//!routes
const { connectToMongoDB } = require("./connection");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
//!middleware routes
const Blog = require("./models/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");
const User = require("./models/user");
//!mongoDB Connection
connectToMongoDB(process.env.MONGO_URL);
// const PORT = 3000; //port

//!middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); //it means server statically which are in public folder so we can render our blog image easily simple

// app.use(checkForAuthenticationCookie("token"));

//!view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

//!routes
app.get("/", checkForAuthenticationCookie("token"), async (req, res) => {
  const allBlogs = await Blog.find().populate("createdBy").exec(); //-1 get newly blog first with ascending order
  const user = await User.findOne({ email: req.user.email });
  return res.status(200).render("home", { blogs: allBlogs, user: user }); //pass blogs to map over it
});
//!Router routes
app.use("/user", userRoute);
app.use("/blog", checkForAuthenticationCookie("token"), blogRoute);

// console.log("My name is", process.env.myname);
const PORT = process.env.PORT || 3000;

//!server listening port
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
