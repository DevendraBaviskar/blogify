const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment = require("../models/comment");

//!Create multer storage & filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueSuffix);
  },
});
//!creating a multer
const upload = multer({ storage: storage });

//!router
//? get add-new route
router.get("/add-new", (req, res) => {
  console.log(req.user.id);
  return res.status(200).render("addBlog", { user: req.user });
});

//? post blog route
router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  await Blog.create({
    title,
    body,
    coverImageURL: `/uploads/${req.file.filename}`,
    createdBy: req.user.id,
  });
  return res.status(200).redirect(`/blog/${req.user.id}`);
});

router.post("/user", async (req, res) => {
  const { userId } = req.body;
  const blogs = await Blog.find({ createdBy: userId });
  const user = await User.findById(userId);
  console.log(user);
  return res.status(200).render("blog", {
    user: user,
    blogs: blogs,
  });
});

//? post comment

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user.id,
  });
  console.log(req.user);
  return res.status(200).redirect(`/blog/single/${req.params.blogId}`);
});

//? get blog by id/params
router.get("/:id", async (req, res) => {
  const blogs = await Blog.find({ createdBy: req.params.id });
  console.log(req.user, blogs);
  return res.status(200).render("blog", {
    user: req.user,
    blogs: blogs,
  });
});
//? get Single blog by clicking on view button on homePage.
router.get("/single/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  const user = await User.findById(req.user.id);
  const comments = await Comment.find({ blogId: req.params.id })
    .populate("createdBy")
    .exec();
  // console.log(comments);
  return res.status(200).render("singleBlog", {
    user: user,
    blog: blog,
    comments: comments,
  });
});

//?get all the post of that user which user id is , anyone will add the userId of any user and get their post

//!exports
module.exports = router;
