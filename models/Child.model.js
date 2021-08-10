const { Schema, model } = require("mongoose")

const childSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        creator: {
            type: [{ type: Schema.Types.ObjectId, ref: "User"}],
        },
        stories: {
            type: [{ type: Schema.Types.ObjectId, ref: "Story"}],
        },
    },
    {
        timestamps: true,
    }, 
)

module.exports = model("Child", childSchema)