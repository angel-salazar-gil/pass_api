import { getRepository } from "typeorm";
import { Request, response, Response } from "express";
import { User } from "../entity/User";
//import { config } from "process";
import * as jwt from 'jsonwebtoken';
import config from "../config/config";
import { validate } from "class-validator";
import { transporter } from './../config/mailer';

class AuthController {
    static login = async (req: Request, res: Response) => {
        const {email, password} = req.body;

        // Verification of data login
        if( !(email && password)){
            return res.status(400).json({ message: 'El Username & Password son requridos' });
        }

        const userRepository = getRepository(User);
        let user: User;

        try{
            user = await userRepository.findOneOrFail({where:{email}});
        }catch (e) {
            return res.status(400).json({message:'El nombre de usuario es incorrecto'})
        }

        // Check password
        if (!user.checkPassword(password)) {
            return res.status(400).json({message:'La contraseña es incorrecta'});
        }

        const token = jwt.sign({userId: user.id, email: user.email}, config.jwtSecret, {expiresIn: '60m'});
        const refreshToken = jwt.sign({userId: user.id, email: user.email}, config.jwtSecretRefresh, {expiresIn: '86400'});

        //Asignacion del refreshToken
        user.refreshToken = refreshToken;
        
        try {
            await userRepository.save(user);
        } catch (error) {
            return res.status(400).json({ message: 'Algo ha ido mal {Token}' });
        }

        res.json({ message: 'OK', token, refreshToken,/* userId: user.id,*/ role: user.role});
    };

    static changePassword = async (req:Request, res:Response) => {
        const { userId } = res.locals.jwtPayload;
        const { oldPassword, newPassword } = req.body;

        if (!(oldPassword && newPassword)) {
            res.status(400).json({ message: 'Old password & new password are required' });
        }

        const userRepository = getRepository(User);
        let user: User;

        try {
            user = await userRepository.findOneOrFail(userId);
        } catch (e) {
            res.status(400).json({ message: 'Something goes wrong!' });
        }

        if (!user.checkPassword(oldPassword)) {
            return res.status(401).json({ message: 'Chech your old password' });
        }
        user.password = newPassword;
        const validationOps = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOps);

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        // Hash password
        user.hashPassword();
        userRepository.save(user);

        res.json({ message: 'Password change!' });
    };

    // Reestablecimiemto de contraseña: Envio del Email
    static forgotPassword = async (req: Request, res: Response) => {
        const {email} = req.body;

        //Recupera el email
        if (!(email)) {
            return res.status(400).json({message: '¡El correo es requerido!'});
        }

        const message = 'Se le a enviado un correo para que pueda reestablecer su contraseña.';
        let verificationLink;
        let emailStatus = 'OK';

        const userRepository = getRepository(User);
        let user: User;

        // Recupera el email de la base de datos
        try {
            user = await userRepository.findOneOrFail({ where: { email } });
            const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecretReset, { expiresIn: '10m' });
            verificationLink = `http://localhost:3000/new-password/${token}`; // URL Enviado al e mail para la verificacion 
            user.resetToken = token;
        } catch (error) {
            return res.json({ message });
        }

        // TODO: Send Email PASS: wwvbiverxqwdklje
        try {
            // send mail with defined transport object
            await transporter.sendMail({
                from: '"Reestablecimiento de contraseña 👻" <angel9982224351@gmail.com>', // sender address
                to: user.email, // list of receivers
                subject: "Reestablecimiento de contraseña ✔", // Subject line
                //text: "Hello world?", // plain text body
                html: `
                    <b> Porfavor haga click sobre el link para conpletar el reestablecimiento de la contraseña</b>
                    <a href="${verificationLink}">Haga click aquí</a>
                `, // html body
            });
        } catch (error) {
            emailStatus = error;
            return res.status(400).json({ message: '¡Algo ha ido mal!' });
        }

        try {
            await userRepository.save(user);
        } catch (error) {
            emailStatus = error;
            return res.status(400).json({ message: 'Algo ha ido mal' });
        }

        res.json({ message, info: emailStatus, test: verificationLink });
    }

    // Reestablecimiento de contraseña: Cambio de contraseña
    static createNewPassword = async (req: Request, res: Response) => {
        const { newPassword } = req.body;
        const resetToken = req.headers.reset as string;

        if (!(resetToken && newPassword)) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
        }

        const userRepository = getRepository(User);
        let jwtPayload;
        let user:User;

        try {
            jwtPayload = jwt.verify(resetToken, config.jwtSecretReset);
            user = await userRepository.findOneOrFail({ where: { resetToken } });
        } catch (error) {
            return res.status(401).json({ message: 'Algo ha ido mal' });
        }

        user.password = newPassword;
        const validationOps = { validationError: { target: false, value: false } };
        const errors = await validate(user, validationOps);

        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        // Encriptamiento de la nueva contraseña
        try {
            user.hashPassword();
            await userRepository.save(user);
        } catch (error) {
            return res.status(401).json({ message: 'Algo ha salido mal' })
        }

        res.json({ message: 'La contraseña ha sido reestablecida' });
    }

    // Refresh Token
    static refreshToken = async (req: Request, res: Response) => {
        const refreshToken = req.headers.refresh as string;

        if (!(refreshToken)) {
            res.status(400).json({ message: 'Algo ha ido mal.!' });
        }

        const userRepository = getRepository(User);
        let user: User;

        try {
            const verifyResult = jwt.verify(refreshToken, config.jwtSecretRefresh);
            const { email } = verifyResult as User;
            user = await userRepository.findOneOrFail({ where: { email } });
        } catch (error) {
            return res.status(400).json({ message: 'Algo ha ido mal..!' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, {expiresIn: '120'});
        res.json({ message: 'OK', token });

    }
}
export default AuthController;