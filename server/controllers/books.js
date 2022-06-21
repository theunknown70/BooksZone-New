import express from 'express';
import mongoose from 'mongoose';

import BookMessage from '../models/bookMessage.js';

const router = express.Router();

export const getBooks = async (req, res) => {
    const { page } = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    
        const total = await BookMessage.countDocuments({});
        const books = await BookMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.json({ data: books, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT)});
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
}

export const getBooksBySearch = async (req, res) => {
    const { branchQuery, yearQuery, tags } = req.query;
    if (branchQuery !== 'none' && yearQuery !== 'none' && tags) {
    try {
        const branch = new RegExp(branchQuery, "i");

        const books = await BookMessage.find({ $and: [ { branch }, { year: yearQuery }, { tags: { $in: tags.split(',') } } ]});

        res.json({ data: books });
    } catch (error) {    
        res.status(404).json({ message: error.message });
    }
    }
    else if (branchQuery == 'none' && yearQuery == 'none' && tags) {
        try {
            const branch = new RegExp(branchQuery, "i");
            
            const books = await BookMessage.find({ $or: [ { branch }, { tags: { $in: tags.split(',') } } ]});
    
            res.json({ data: books });
        } catch (error) {    
            res.status(404).json({ message: error.message });
        }
    }
    else if (!tags) {
        try {
            const branch = new RegExp(branchQuery, "i");
            
            const books = await BookMessage.find({ $and: [ { branch }, { year: yearQuery } ]});
    
            res.json({ data: books });
        } catch (error) {    
            res.status(404).json({ message: error.message });
        }
    }
}

export const getBook = async (req, res) => { 
    const { id } = req.params;

    try {
        const book = await BookMessage.findById(id);
        
        res.status(200).json(book);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createBook = async (req, res) => {
    const book = req.body;

    const newBookMessage = new BookMessage({ ...book, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        await newBookMessage.save();

        res.status(201).json(newBookMessage);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const updateBook = async (req, res) => {
    const { id } = req.params;
    const { price, location, creator, selectedFile, tags, college, year, branch } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No book with id: ${id}`);

    const updatedBook = { creator, price, location, tags, selectedFile, college, year, branch, _id: id };

    await BookMessage.findByIdAndUpdate(id, updatedBook, { new: true });

    const updatedBookFull = await BookMessage.findById(id);

    res.json(updatedBookFull);
}

export const deleteBook = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No book with id: ${id}`);

    await BookMessage.findByIdAndRemove(id);

    res.json({ message: "Book deleted successfully." });
}

export const likeBook = async (req, res) => {
    const { id } = req.params;

    if (!req.userId) {
        return res.json({ message: "Unauthenticated" });
      }

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No book with id: ${id}`);
    
    const book = await BookMessage.findById(id);

    const index = book.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      book.likes.push(req.userId);
    } else {
      book.likes = book.likes.filter((id) => id !== String(req.userId));
    }
    const updatedBook = await BookMessage.findByIdAndUpdate(id, book, { new: true });
    res.status(200).json(updatedBook);
}



export default router;