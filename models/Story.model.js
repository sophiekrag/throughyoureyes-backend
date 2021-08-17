const { Schema, model } = require("mongoose");

const storySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    media: {
        type: String, 
    },
    creator: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    child: {
      type: [{ type: Schema.Types.ObjectId, ref: "Child" }]
    }
  },
  {
    timestamps: true,
  }
);

module.exports = model("Story", storySchema);
