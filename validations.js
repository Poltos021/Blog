import { body } from 'express-validator'; 

export const loginValidaton = [
    body('email', 'Неверный формат почты!').isEmail(),
    body('password', 'Пароль должен содержать минимум 6 символов!').isLength({ min: 6 }), 
];

export const registerValidaton = [
    body('email', 'Неверный формат почты!').isEmail(),
    body('password', 'Пароль должен содержать минимум 6 символов!').isLength({ min: 6 }), 
    body('fullName', 'Укажите Имя!').isLength({ min: 3 }), 
    body('avatarUrl', 'неверная ссылка на аватар!').optional().isURL(), 
];

export const postCreateValidaton = [
    body('title', 'Введите заголовок статьи').isLength( { min: 3 }).isString(),
    body('text', 'Текст должен содержать минимум 5 символов!').isLength({ min: 5 }).isString(), 
    body('tags', 'Укажите верный массив тэгов!').optional().isArray(), 
    body('imgUrl', 'неверная ссылка на аватар!').optional().isString(), 
];