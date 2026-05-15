import { UserRole } from '../core/services/auth.service';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'layout-dashboard',
    roles: ['PATIENT', 'MEDECIN', 'ADMIN']
  },
  {
    label: 'Patients',
    path: '/patients',
    icon: 'users',
    roles: ['MEDECIN', 'ADMIN']
  },
  {
    label: 'Médecins',
    path: '/medecins',
    icon: 'stethoscope',
    roles: ['MEDECIN', 'ADMIN']
  },
  {
    label: 'Rendez-vous',
    path: '/rendez-vous',
    icon: 'calendar',
    roles: ['PATIENT', 'MEDECIN', 'ADMIN']
  },
  {
    label: 'Consultations',
    path: '/consultations',
    icon: 'notes',
    roles: ['MEDECIN', 'ADMIN']
  },
  {
    label: 'Factures',
    path: '/factures',
    icon: 'receipt',
    roles: ['PATIENT', 'ADMIN']
  }
];
