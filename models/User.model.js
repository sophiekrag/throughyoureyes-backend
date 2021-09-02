const { Schema, model } = require("mongoose")

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        children: {
            type: [{ type: Schema.Types.ObjectId, ref: "Child"}],
        },
        stories: {
            type: [{ type: Schema.Types.ObjectId, ref: "Story"}],
        },    
    },
        {
        timestamps: true,
        },
)

module.exports = model("User", userSchema)