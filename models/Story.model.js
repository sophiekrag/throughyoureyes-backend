const { Schema, model } = require("mongoose")

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
        mediaUrl: {
            type: String,
        },
        creator: {
            type: [{ type: Schema.Types.ObjectId, ref: "User"}],
        },
        timestamp: true,
    }
)

module.exports = model("Story", storySchema)