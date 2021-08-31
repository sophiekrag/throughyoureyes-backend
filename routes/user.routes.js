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
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting data. Please try again later" });
  }
});

//------Create story------
router.post("/api/createStory", async (req, res) => {
  console.log("Connected to createStory");
  const { title, description, media, childId } = req.body;
  try {
    if (!title || !description) {
      return res
        .status(422)
        .json({ message: "Title or description is missing" });
    }
    const newStory = await Story.create({
      title,
      description,
      media,
      creator: req.session.user._id,
      child: req.body.childId,
    });
    await Child.findByIdAndUpdate(
      { _id: childId },
      { $push: { stories: newStory._id } }
    );
    await User.findByIdAndUpdate(
      { _id: req.session.user._id },
      { $push: { stories: newStory._id } }
    );
    res.status(200).json({ message: "New story is created" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating story. Please try again later" });
  }
});

//------Get my stories------
router.get("/api/myStories", async (req, res) => {
  try {
    const result = await User.findById(req.session.user._id).populate(
      "stories"
    );
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting data. Please try again later" });
  }
});

//------Details story------
router.get("/api/storyDetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Story.findById(id).populate("child");
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error getting data. Please try again later" });
  }
});

//------Edit story------
router.post("/api/editStory/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, media } = req.body;

  try {
    const newData = await Story.findByIdAndUpdate(
      id,
      { title, description, media },
      {
        new: true,
      }
    );
    res.status(200).json({ message: "Your story has been updated" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error editing story. Please try again later" });
  }
});

//------Delete story------
router.post("/api/deleteStory/:id", async (req, res) => {
  const { id } = req.params;
  const { childId } = req.body;
  try {
    await User.findByIdAndUpdate(req.session.user._id, {
      $pull: { stories: id },
    });
    await Child.findByIdAndUpdate(childId, {
      $pull: { stories: id },
    });
    await Story.findByIdAndDelete(id);
    res.status(200).json({ message: "Succesfully deleted story" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error deleting data. Please try again later" });
  }
});
module.exports = router;
