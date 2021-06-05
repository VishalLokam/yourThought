import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  postedOn: {
    type: Date,
    default: new Date().getTime(),
  },
});

const PostModel = model("Post", PostSchema);

export default PostModel;
