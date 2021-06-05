import Express from "express";
import mongoose from "mongoose";
import enviroment from "dotenv";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
enviroment.config();

import Post from "./models/Post.js";

dayjs.extend(relativeTime);

const app = Express();
app.set("view engine", "ejs");
app.use(Express.static("public"));
app.use(Express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.error(err));

app.get("/home", async (_, res) => {
  const posts = await Post.find();

  res.render("home", {
    posts: posts.map(({ id, title, body, postedOn }) => ({
      id,
      title: title.length < 100 ? title : title.substr(0, 100).trim() + "...",
      body: body.length < 500 ? body : body.substr(0, 400).trim() + "...",
      postedOn: dayjs().to(dayjs(postedOn)),
    })),
  });
});

app.get("/add", (_, res) => {
  res.render("add");
});

app.post("/add", async (req, res) => {
  const { title, body } = req.body;

  try {
    await Post.create({ title, body });
  } catch (error) {
    console.log(error);
  }

  res.redirect("/home");
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, body, postedOn } = await Post.findById(id);

  res.render("post", {
    id,
    post: {
      id,
      title: title.length < 100 ? title : title.substr(0, 100).trim() + "...",
      body: body.length < 500 ? body : body.substr(0, 400).trim() + "...",
      postedOn: dayjs().to(dayjs(postedOn)),
    },
  });
});

const { PORT = 3000 } = process.env;
