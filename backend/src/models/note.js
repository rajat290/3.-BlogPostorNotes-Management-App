import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "General"
    }, // ek single category
    tags: [{ type: String }], // multiple tags
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })




const Note = mongoose.model('Note', noteSchema)
noteSchema.index({ title: "text", content: "text" });

export default Note