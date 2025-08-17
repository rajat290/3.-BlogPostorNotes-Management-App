import Note from "../models/note.js";

export const createote = async (req, res) => {
    try {
       const  note = await Note.create ({
        title: req.body.title,
        content : req.body.cotent,
        user: req.user.id, //logged-in user
       });
       res.status (201).json (note);
    } catch (error) {
        res.status(400).json({ message: err.message })
    }
};
// Get all notes of logged-in user\

export const getNotes = async ( req, res) => {
    const notes = await Note.find( { user: req.user.id});
    res.json(notes);
}

// get single note 

export const getNote = async ( req, res ) => {
    const notes = await Note.find ({ user: req.user.id });
    res.json(notes);
}

//  update note

export const updateNote = async (req, res) =>{
    const note = await Note.findById (req.params.id);
    if (!note || note.user.tostring() !== req.used.id) {
        return res.status(404).json ({ message: "Note not found"})
    }
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;
    await note.save();
    res.json(note);
};

// delete note 

export const deleteNote = async (req, res ) => {
    const note = await Note.findById(req. params.id);
    if (!note || note.user.tostring() !== req.user.id) {
        return res.status(404). json ({ message: "note not found" })
    }
    await note.deleteOne();
    res.json({ message: "Note Deleted "});
}
