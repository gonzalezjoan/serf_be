import type { Request, Response } from 'express';
import Appointment from '../models/Appointment.ts';
import User from '../models/User.ts';
import DoctorProfile from '../models/Doctor.ts';
import Treatment from '../models/Tratamientos.ts';
import { Op } from 'sequelize';

export const handleAppointmentEndpoint = async (req: Request, res: Response): Promise<any> => {
    const userRole = (req as any).user.role; // Obtenido desde tu authenticateToken
    const userId = (req as any).user.id;

    try {
        // =================================================================
        // ESTRATEGIA SADMIN: Ver todas las citas globales del sistema
        // =================================================================
        if (userRole === 'sysadmin') {
            const allAppointments = await Appointment.findAll({
                include: [
                    { model: User, as: 'patient', attributes: ['firstName', 'lastName', 'email'] },
                    { 
                        model: DoctorProfile, 
                        as: 'doctor', 
                        include: [{ model: User, attributes: ['firstName', 'lastName'] }] 
                    },
                    { model: Treatment, as: 'treatment', attributes: ['treatmentName'] }
                ]
            });
            return res.status(200).json({ msg: "Listado maestro de citas (Modo Sysadmin)", data: allAppointments });
        }

        // =================================================================
        // ESTRATEGIA DOCTOR: Ver sus propias citas agendadas y gestionarlas
        // =================================================================
        if (userRole === 'doctor') {
            // Buscamos el perfil de doctor del usuario logueado para tener su doctorProfile.id
            const doctorProfile = await DoctorProfile.findOne({ where: { userId } });
            if (!doctorProfile) {
                return res.status(404).json({ msg: "Perfil médico no encontrado." });
            }

            const doctorAppointments = await Appointment.findAll({
                where: { doctorId: doctorProfile.id },
                include: [
                    { model: User, as: 'patient', attributes: ['firstName', 'lastName', 'email'] },
                    { model: Treatment, as: 'treatment', attributes: ['treatmentName'] }
                ]
            });
            return res.status(200).json({ msg: "Tus citas asignadas", data: doctorAppointments });
        }

        // =================================================================
        // ESTRATEGIA PACIENTE: Ver doctores y disponibilidad (Filtro por mes)
        // =================================================================
        if (userRole === 'patient') {
            const { doctorId, year, month } = queryParamsExtractor(req);

            if (!doctorId || !year || !month) {
                return res.status(400).json({ 
                    msg: "Para ver disponibilidad como paciente, provee: doctorId, year, month en la URL" 
                });
            }

            // Calculamos rango del mes seleccionado para el calendario
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);

            // Buscamos las citas que ya tiene el doctor en ese mes para pintar las ocupadas en el calendario
            const busySlots = await Appointment.findAll({
                where: {
                    doctorId,
                    appointmentDate: {
                        [Op.between]: [startDate, endDate]
                    }
                },
                attributes: ['appointmentDate', 'status']
            });

            return res.status(200).json({
                msg: `Disponibilidad del doctor ID: ${doctorId} para el mes ${month}/${year}`,
                calendarConfig: {
                    info: "Las siguientes fechas/horas ya se encuentran reservadas en este mes",
                    busySlots
                }
            });
        }

        return res.status(403).json({ msg: "Rol no autorizado para interactuar con este flujo" });

    } catch (error: any) {
        return res.status(500).json({ msg: "Error en el ecosistema de citas", error: error.message });
    }
};

// =====================================================================
// CONTROLADOR PARA ACCIÓN DEL DOCTOR: APROBAR O MOVER CITA + NOTIFICACIÓN
// =====================================================================
export const updateAppointmentStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { appointmentId, statusId, newDate } = req.body; // Postman enviará statusId: 2 o 3
        
        console.log(`--> Intentando actualizar Cita ID: ${appointmentId} a statusId: ${statusId}`);

        const appointment = await Appointment.findByPk(appointmentId);

        if (!appointment) {
            return res.status(404).json({ msg: "Cita no encontrada" });
        }

        // CORRECCIÓN LÍNEA 110 (Aprobar Cita)
        if (Number(statusId) === 2) { 
            appointment.statusId = 2; // <-- ASIGNACIÓN NUMÉRICA CORRECTA (Asigna el ID 2 de la tabla)
            await appointment.save();
            
            console.log(`\n📧 [EMAIL SENT] Notificación de aprobación enviada (StatusId: 2)\n`);
        } 
        
        // CORRECCIÓN LÍNEA 121 (Mover Cita)
        else if (Number(statusId) === 3) { 
            if (!newDate) {
                return res.status(400).json({ msg: "Debe enviar la nueva fecha (newDate)" });
            }
            
            appointment.statusId = 3; // <-- ASIGNACIÓN NUMÉRICA CORRECTA (Asigna el ID 3 de la tabla)
            appointment.appointmentDate = new Date(newDate);
            await appointment.save();
            
            console.log(`\n📧 [EMAIL SENT] Notificación de cambio de fecha enviada (StatusId: 3)\n`);
        } else {
            return res.status(400).json({ msg: "El statusId proporcionado no es válido para esta operación (Debe ser 2 o 3)" });
        }

        return res.status(200).json({ 
            msg: "Estado de la cita actualizado con éxito en la tabla relacional.", 
            data: appointment 
        });

    } catch (error: any) {
        return res.status(500).json({ msg: "Error al actualizar la cita", error: error.message });
    }
};

// Helper rápido para limpiar parámetros de consulta
const queryParamsExtractor = (req: Request) => {
    return {
        doctorId: req.query.doctorId as string,
        year: req.query.year as string,
        month: req.query.month as string
    };
};


// =====================================================================
// CONTROLADOR EXCLUSIVO PARA CREAR CITA
// =====================================================================
export const createNewAppointment = async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, doctorId, treatmentId, appointmentDate } = req.body;

        const newAppointment = await Appointment.create({
            userId,
            doctorId,
            treatmentId,
            appointmentDate,
            statusId: 1 // Forzamos que nazca con el ID 1 física ('pending')
        });

        return res.status(201).json({
            msg: "Cita solicitada exitosamente bajo control de llave foránea.",
            data: newAppointment
        })
        
    } catch (error: any) {
        return res.status(500).json({ msg: "Error al registrar la cita", error: error.message });
    }
};