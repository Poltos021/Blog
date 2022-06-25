import { body } from 'express-validator'; 

export const registerValidaton = [
    body('email', 'Неверный формат почты!').isEmail(),
    body('password', 'Пароль должен содержать минимум 6 символов!').isLength({ min: 6 }), 
    body('fullName', 'Укажите Имя!').isLength({ min: 3 }), 
    body('avatarUrl', 'неверная ссылка на аватар!').optional().isURL(), 
];