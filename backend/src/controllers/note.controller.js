import Note from "../models/note.js";

export const createNote = async (req, res) => {
    try {
       const note = await Note.create({
        title: req.body.title,
        content: req.body.content,
         category: req.body.category || "General",
      tags: req.body.tags || [],
        user: req.user.id, //logged-in user
       });
       res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all notes of logged-in user
// export const getNotes = async (req, res) => {
//   const {
//     search = "",          // substring or keywords
//     page = 1,             // 1-based
//     limit = 10,           // per page
//     sortBy = "createdAt", // any allowed field
//     order = "desc",       // asc | desc
//   } = req.query;

//   const pageNum = Math.max(parseInt(page, 10) || 1, 1);
//   const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
//   const skip = (pageNum - 1) * limitNum;

//   // search query
//   let query = { user: req.user.id };
//   if (search) {
//     // simple regex OR text search fallback
//     query.$or = [
//       { title:   { $regex: search, $options: "i" } },
//       { content: { $regex: search, $options: "i" } },
//     ];
//   }

//   // sorting
//   const sortDir = order.toLowerCase() === "asc" ? 1 : -1;
//   const sort = { [sortBy]: sortDir };

//   try {
//     const [items, total] = await Promise.all([
//       Note.find(query).sort(sort).skip(skip).limit(limitNum),
//       Note.countDocuments(query),
//     ]);

//     res.json({
//       items,
//       page: pageNum,
//       limit: limitNum,
//       total,
//       totalPages: Math.ceil(total / limitNum),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get all notes (with search & pagination)
export const getNotes = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "" } = req.query;

    const query = {
      user: req.user.id,
      $or: [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ],
    };

    const notes = await Note.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Note.countDocuments(query);

    res.json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};


// get single note 
export const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update note
export const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note || note.user.toString() !== req.user.id) {
    return res.status(404).json({ message: "Note not found" });
  }

  note.title = req.body.title || note.title;
  note.content = req.body.content || note.content;
  note.category = req.body.category || note.category;
  note.tags = req.body.tags || note.tags;

  await note.save();
  res.json(note);
};

// delete note 
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    await note.deleteOne();
    res.json({ message: "Note Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
