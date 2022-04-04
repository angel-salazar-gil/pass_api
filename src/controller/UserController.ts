import {getRepository} from "typeorm";
import {Request, Response} from "express";
import {User} from "../entity/User";
import { validate } from "class-validator";

export class UserController {

    static getAll = async(req: Request, res: Response) => {
        const userRepository = getRepository(User);
        let users

        try {
            users = await userRepository.find();
        } catch (e) {
            res.status(404).json({message: 'something goes wrong!'});
        }

        if (users.length > 0){
            res.send(users);
        } else {
            res.status(404).json({message: 'No Encontrado'});
        }
    };

    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.findOneOrFail(id);
            res.send(user);
        } catch (e) {
            res.status(404).json({ message: 'Sin Resultado' });
        }
    };

    // Modificar a los datos del Registro en produccion
    static newUser = async (req: Request, res: Response) => {
        const { username, apaterno, amaterno, nemployee, departmend, email, password, role } = req.body;
        const user = new User();

        // Valores entrantes del registro
        user.username = username;
        user.apaterno = apaterno;
        user.amaterno = amaterno;
        user.nemployee = nemployee;
        user.departmend = departmend;
        user.email = email;
        user.password = password;
        user.role = role;

        // Validate
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        //TODO: HASH PASSWORD
        const userRepository = getRepository(User);
        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({message: 'El Email ya existe'});
        }

        // All ok
        res.status(200).json({message: 'User creado'});
    };

    static editUser = async (req: Request, res: Response) => {
        let user;
        const {id} = req.params;
        const {username, apaterno, amaterno, nemployee, departmend, email, role} = req.body;

        const userRepository = getRepository(User);

        //Try get user
        try {
            user = await userRepository.findOneOrFail(id);
            user.username = username;
            user.apaterno = apaterno;
            user.amaterno = amaterno;
            user.nemployee = nemployee;
            user.departmend = departmend;
            user.email = email;
            user.role = role;
        } catch (e) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        // Try to save user
        try {
            await userRepository.save(user);
        } catch (e) {
            return res.status(409).json({ message:'El Username ya existe en la base de datos' });
        }

        res.status(200).json({ message:'Usuario actualizado' });
    };

    static deleteUser =async (req: Request, res: Response) => {
        const {id} = req.params;
        const userRepository = getRepository(User);
        let user : User;

        try {
            user = await userRepository.findOneOrFail(id);
        } catch (e) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }

        // Remove user
        userRepository.delete(id);
        res.status(200).json({ message:'Usuario eliminado' });
    };

}

export default UserController;