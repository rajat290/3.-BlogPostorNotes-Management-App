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

// ✅ Get all notes with search + pagination + sorting
export const getNotes = async (req, res) => {
  const {
    search = "",          // substring or keywords
    page = 1,             // 1-based
    limit = 10,           // per page
    sortBy = "createdAt", // any allowed field
    order = "desc",       // asc | desc
  } = req.query;

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
  const skip = (pageNum - 1) * limitNum;

  // search query
  let query = { user: req.user.id };
  if (search) {
    // simple regex OR text search fallback
    query.$or = [
      { title:   { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];
    // If you created the text index, you could alternatively use:
    // query = { user: req.user.id, $text: { $search: search } };
  }

  // sorting
  const sortDir = order.toLowerCase() === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortDir };

  const [items, total] = await Promise.all([
    Note.find(query).sort(sort).skip(skip).limit(limitNum),
    Note.countDocuments(query),
  ]);

  res.json({
    items,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
};

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
