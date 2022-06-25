import express  from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator"; 

import { registerValidaton } from "./validations/auth.js";
import UserModel from "./models/User.js";

mongoose
    .connect('db')
    .then(() => console.log("DB OKAY!"))
    .catch((err) => console.log("ERROR DB!", err));

const app = express();

app.use(express.json());

app.post('/login', async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});

        if (!user){
            return req.status(404).json({
                message: '~Error Login!~'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return req.status(404).json({
                message: '~Error Login or Password!~'
            });
        }

        const token = jwt.sign({
            _id: user._id,
        }, 'b562da53652ed82e645dcac1d2630c3e', {
            expiresIn: '30d',
        });
        
        const { passwordHash, ...userData } = user._doc;

        res.json({
            success: true,
            token,
        });

    } catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Не удача входа!',
        });
    }
});

app.post('/register', registerValidaton, async (req, res) => {
   try {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const Hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
        email: req.body.email,
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        passwordHash: Hash,
        });

    const user = await doc.save();
    const token = jwt.sign({
        _id: user._id,
    }, 'b562da53652ed82e645dcac1d2630c3e', {
        expiresIn: '30d',
    });

    const { passwordHash, ...userData } = user._doc;

    res.json({
        ...userData,
        token,
    });
   } catch (err){
    console.log(err);
        res.status(500).json({
            message: 'Не удача',
        });
   }
});

app.listen(4444, (err) => {
    if (err){
        return console.log(err)
    }

    console.log('OK');
});

