import type { Request, Response } from 'express';
import Treatment from '../models/Tratamientos.ts';
import Inventary from '../models/Inventary.ts';

export const createTreatment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { treatmentName, treatmentDescription, treatmentCost } = req.body;

        const newTreatment = await Treatment.create({
            treatmentName,
            treatmentDescription,
            treatmentCost
        });

        return res.status(201).json({
            msg: "Tratamiento creado exitosamente por el Administrador",
            data: newTreatment
        });
    } catch (error: any) {
        return res.status(500).json({ msg: "Error al crear el tratamiento", error: error.message });
    }
};

export const createInventary = async (req: Request, res: Response): Promise<any> => {
    try {
        const { itemName, itemUseDescription, itemCost, itemQuantity } = req.body;

        const newItem = await Inventary.create({
            itemName,
            itemUseDescription,
            itemCost,
            itemQuantity
        });

        return res.status(201).json({
            msg: "Material agregado al inventario exitosamente",
            data: newItem
        });
    } catch (error: any) {
        return res.status(500).json({ msg: "Error al registrar insumo en el inventario", error: error.message });
    }
};