const { Router } = require("express");

const router = new Router();

const Child = require("../models/Child.model");
const User = require("../models/User.model");
const Story = require("../models/Story.model");

//------Get my children------
router.get("/api/myChildren", async (req, res) => {
  try {
    const result = await User.findById(req.session.user._id).populate(
      "children"
    );
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting data. Please try again later");
  }
});

//------Create story------
router.post("/api/createStory", async (req, res) => {
  console.log("Connected to createStory");
  const {
    storyData: { title, description, media },
    childId,
  } = req.body;
  try {
    if (!title || !description) {
      return res.status(422).json("Title or description is missing");
    }
    const newStory = await Story.create({
      title,
      description,
      media,
      creator: req.session.user._id,
      child: req.body.childId
    });
    await Child.findByIdAndUpdate(
      { _id: childId },
      { $push: { stories: newStory._id } }
    );
    await User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { $push: { stories: newStory._id } }
    );
    res.status(201).send("New story is created");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating story. Please try again later");
  }
});

//------Get my stories------
router.get("/api/myStories", async (req, res) => {
  try {
    const result = await User.findById(req.session.user._id).populate(
      "stories",
    );
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting data. Please try again later");
  }
});

//------Details story------
router.get("/api/storyDetails/:id", async (req, res) => {
  const { id } = req.params
  try {
    const result = await Story.findById(id).populate("child")
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting data. Please try again later");
  }
});

//------Edit story------
router.post("/api/editStory", async (req, res) => {
  const {storyData: {input, media: mediaUrl}, storyId} = req.body;
  console.log(mediaUrl)
  try {
    const newData = await Story.findByIdAndUpdate(storyId, {input, media: mediaUrl }, {new: true})
    res.status(200).json(newData)
  } catch (error) {
    console.error(error);
    res.status(500).send("Error edeting story. Please try again later");
  }
})

module.exports = router;
