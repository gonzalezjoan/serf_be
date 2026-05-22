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
        const { appointmentId, status, newDate } = req.body; // status: 'approved' o 'moved'
        
        const appointment = await Appointment.findByPk(appointmentId, {
            include: [{ model: User, as: 'patient', attributes: ['firstName', 'email'] }]
        });

        if (!appointment) {
            return res.status(404).json({ msg: "Cita no encontrada" });
        }

        if (status === 'approved') {
            appointment.status = 'approved';
            await appointment.save();

            // MOCK LOG DE CORREO ELECTRÓNICO (Simulación del requerimiento)
            console.log(`\n📧 [EMAIL SENT] To: ${(appointment as any).patient.email}`);
            console.log(`Estimado/a ${(appointment as any).patient.firstName}, su cita ha sido APROBADA con éxito para la fecha ${appointment.appointmentDate}.\n`);
        } 
        
        else if (status === 'moved') {
            if (!newDate) return res.status(400).json({ msg: "Si mueve la cita, debe enviar la nueva fecha (newDate)" });
            
            appointment.status = 'moved';
            appointment.appointmentDate = new Date(newDate);
            await appointment.save();

            // MOCK LOG DE CORREO ELECTRÓNICO
            console.log(`\n📧 [EMAIL SENT] To: ${(appointment as any).patient.email}`);
            console.log(`Estimado/a ${(appointment as any).patient.firstName}, su cita ha sido REAGENDADA. Nueva fecha asignada: ${newDate}.\n`);
        }

        return res.status(200).json({ msg: `Cita actualizada a estado: ${status} y notificación enviada.`, data: appointment });

    } catch (error: any) {
        return res.status(500).json({ msg: "Error al gestionar la cita", error: error.message });
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