import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Pass } from "../entity/Passes";


export class PassController {

    // Solicitud de todos los pases de salida
    static getAll = async (req: Request, res: Response) => {
        const passRepository = getRepository(Pass);
        let passes

        try {
            passes = await passRepository.find();
        } catch (error) {
            res.status(404).json({message: 'Algo a salido mal!'})
        }

        if (passes.length > 0) {
            res.send(passes);
        } else {
            res.status(404).json({message: 'No encontrados'});
        }
    };

    // Solicitud de pases por ID
    static getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        const passRepository = getRepository(Pass);

        try {
            const pass = await passRepository.findOneOrFail(id);
            res.send(pass);
        } catch (error) {
            res.status(404).json({message: 'Sin Resultados'});
        }
    };

    // Inserta un nuevo pase a la BD
    static newPass = async (req: Request, res: Response) => {
        const { id_solict, hotel, name_razon, temporalidad, fecha_retorno, direccion_solici, articulos_name, descripcion, cant_arti, procedencia_area, motivo_salida, status } = req.body;
        const pass = new Pass();

        pass.id_solict = id_solict;
        pass.hotel = hotel;
        pass.name_razon = name_razon;
        pass.temporalidad = temporalidad;
        pass.fecha_retorno = fecha_retorno;
        pass.direccion_solici = direccion_solici;
        pass.articulos_name = articulos_name;
        pass.descripcion = descripcion;
        pass.cant_arti = cant_arti;
        pass.procedencia_area = procedencia_area;
        pass.motivo_salida = motivo_salida;
        pass.status = status;

        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(pass, validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        const passRepository = getRepository(Pass)
        try {
            await passRepository.save(pass);
        } catch (error) {
            return res.status(400).json({message: 'Algo ha salido mal con el guardado'});
        }

        res.status(200).json({message: 'Pase creado'});
    };

    // Edita el pase para cambiar el Estatus
    static editPass = async (req: Request, res: Response) => {
        let pass;
        const { id } = req.params;
        const { id_solict, hotel, name_razon, temporalidad, fecha_retorno, direccion_solici, articulos_name, descripcion, cant_arti, procedencia_area, motivo_salida, status } = req.body;

        const passRepository = getRepository(Pass);

        // Valores para editar toda la informacion - Cambiar a solo editar el Status
        try {
            pass = await passRepository.findOneOrFail(id);
            pass.id_solict = id_solict;
            pass.hotel = hotel;
            pass.name_razon = name_razon;
            pass.temporalidad = temporalidad;
            pass.fecha_retorno = fecha_retorno;
            pass.direccion_solici = direccion_solici;
            pass.articulos_name = articulos_name;
            pass.descripcion = descripcion;
            pass.cant_arti = cant_arti;
            pass.procedencia_area = procedencia_area;
            pass.motivo_salida = motivo_salida;
            pass.status = status;
        } catch (error) {
            return res.status(404).json({message: 'Pase no encontrado'});
        }

        const validationOpt = { validationError: { target: false, value: false } };
        const errors = await validate(pass, validationOpt);
        if (errors.length > 0) {
            return res.status(400).json(errors);
        }

        try {
            await passRepository.save(pass);
        } catch (error) {
            return res.status(409).json({message: 'Algo ha ido mal al intentar actualizar'});
        }

        res.status(200).json({message: 'Status actualizado'});
    };

    // Elimina el pase de forma Individual (Aplicar borrado OnDeleteCascade)
    static deletePass = async (req: Request, res: Response) => {
        const { id } = req.params;
        const passRepository = getRepository(Pass);
        let pass : Pass;

        try {
            pass = await passRepository.findOneOrFail(id);
        } catch (error) {
            return res.status(404).json({message: 'Pase no encontrado'});
        }

        passRepository.delete(id);
        res.status(200).json({message: 'Pase eliminado'})
    };
}

export default PassController;