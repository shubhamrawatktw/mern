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

const updateNote =asyncHandler(
  async(req,res) => {
    const {id,user,title,text ,completed} = req.body
    if(!id || !title || !text || !user || typeof completed !== "boolean"){
      return res.status(400).json({message:"All field req"})
    }
  
    const note = await Notes.findById(id).exec()
     if(!note){
      return res.status(400).json({message:"Note not found"})
     }

     const duplicate = await Notes.findOne({title}).lean().exec()

     if(duplicate && duplicate?._id.toString() !== id){
      return res.status(409).json({ message: 'Duplicate note title' })
     }

     note.user = user
     note.title = title
     note.text = text
     note.completed = completed

     const updateNote = await note.save()

     res.json(`${updateNote.title} updated`)

  }
) 


const deleteNote = asyncHandler (

  async(req,res) => {
   const {id} = req.body
   if (!id){
    return res.status(400).json({message:"Note id req"})
   }


   const note = await Notes.findById(id).exec()

   if(!note) {
    return res.status(400).json({message:"Note not found"})
   }

   const result = await note.deleteOne()

   const reply = `Note ${result.title} is deleted`

   res.json(reply)
   
  }
)

module.exports = {
  getAllNotes,
  createNewNote,
  updateNote,deleteNote
};
