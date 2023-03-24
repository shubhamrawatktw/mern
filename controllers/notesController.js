const Notes = require("../models/Notes");
const User = require("../models/User");

const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Notes.find().lean();
  if (!notes?.length) {
    return res.status(400).json({ message: "No Notes found" });
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();

      return { ...note, user: username };
    })
  );

  res.json(notesWithUser);
});

const createNewNote = asyncHandler(async (req, res) => {
  const { user, title, text } = req.body;

  if (!user || !title || !text) {
    return res.status(400).json({ message: "All fields req" });
  }

  const duplicate = await Notes.findOne({ title }).lean().exec();
  if (duplicate) {
    return res.status(400).json({ message: "Duplicate note title" });
  }

  const note = Note.create({user,title,text})
  if(note){
    return res.status(200).json({message:"New Note created"})
  }else{
    return res.status(400).json({message:"Invalid note data recieve"})
  }
});

module.exports = {
  getAllNotes,
  createNewNote
};
