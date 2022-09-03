import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import multer from "multer";

import { registerValidaton, loginValidaton, postCreateValidaton, commentCreateValidaton } from "./validations.js";

import {checkAuth, handleValidationErrors} from "./utils/index.js";
import { UserContoller, PostContoller, CommentContoller } from './controllers/index.js';

mongoose
    .connect('mongodb+srv://admin:123@cluster0.xohhhvc.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log("DB OKAY!"))
    .catch((err) => console.log("ERROR DB!", err));

const app = express();


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/login', loginValidaton, handleValidationErrors, UserContoller.login);
app.post('/register', registerValidaton, handleValidationErrors, UserContoller.register);
app.get('/me', checkAuth, UserContoller.getMe);

app.post('/uploads', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    });
});

app.get('/posts', PostContoller.getAll);
app.get('/posts/tags', PostContoller.getLastTags);
app.get('/tags', PostContoller.getLastTags);
app.get('/posts/:id', PostContoller.getOne);
app.post('/posts', checkAuth, postCreateValidaton, handleValidationErrors, PostContoller.create);
app.delete('/posts/:id', checkAuth, PostContoller.remove);
app.patch('/posts/:id', checkAuth, handleValidationErrors, PostContoller.update);

app.post('/comment', checkAuth, commentCreateValidaton, handleValidationErrors, CommentContoller.create);
app.get('/comment/:id', checkAuth, commentCreateValidaton, handleValidationErrors, CommentContoller.getCommentsOnePosts);
app.get('/comment', checkAuth, handleValidationErrors, CommentContoller.getAll);

app.listen(4444, (err) => {
    if (err){
        return console.log(err)
    }
    console.log('Server normal');
});

