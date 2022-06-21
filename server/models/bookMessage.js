import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    price: String,
    location: String,
    name: String,
    college: String,
    year: String,
    branch: String,
    creator: String,
    tags: [String],
    selectedFile: String,
    likes: { type: [String], default: [] },
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

var BookMessage = mongoose.model('BookMessage', bookSchema);

export default BookMessage;