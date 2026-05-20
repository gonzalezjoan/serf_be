export interface ModuleConfig {
    name: string;
    path: string;
    icon: string;
}

// Mapeamos los módulos EXACTOS que definiste para cada rol
export const ROLE_MODULES: Record<string, ModuleConfig[]> = {
    sysadmin: [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard-icon' },
        { name: 'Modules', path: '/config/modules', icon: 'modules-icon' },
        { name: 'Medical Treatments', path: '/config/treatments', icon: 'treatments-icon' },
        { name: 'Costs', path: '/config/costs', icon: 'costs-icon' },
        { name: 'Manage Finance', path: '/admin/accounting', icon: 'accounting-icon' },
        { name: 'Global Calendar', path: '/calendar/all', icon: 'calendar-icon' }
    ],
    doctor: [
        { name: 'Medical Calendar', path: '/calendar/mine', icon: 'calendar-icon' }
        // Nota: Mover/Confirmar citas son acciones de este módulo
    ],
    patient: [
        { name: 'Appointment Date', path: '/appointments/book', icon: 'book-icon' },
        { name: 'Medical History', path: '/medical-history', icon: 'history-icon' }
    ]
};