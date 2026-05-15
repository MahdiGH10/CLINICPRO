import { UserRole } from '../services/auth.service';

export interface RoleNavItem {
  label: string;
  path: string;
  icon: string;
  description?: string;
}

export interface RoleDefinition {
  label: string;
  workspaceTitle: string;
  homeRoute: string;
  nav: RoleNavItem[];
}

/** Parcours métier par rôle — interfaces séparées */
export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  ADMIN: {
    label: 'Administrateur',
    workspaceTitle: 'Espace admin',
    homeRoute: '/dashboard',
    nav: [
      {
        label: 'Tableau de bord',
        path: '/dashboard',
        icon: 'layout-dashboard',
        description: 'Vue globale : patients, RDV, revenus'
      },
      {
        label: 'Patients',
        path: '/patients/list',
        icon: 'users',
        description: 'Gestion des dossiers patients'
      },
      {
        label: 'Médecins',
        path: '/medecins/list',
        icon: 'stethoscope',
        description: 'Équipe médicale et création de comptes'
      },
      {
        label: 'Planning RDV',
        path: '/rendez-vous/planning',
        icon: 'calendar',
        description: 'Tous les rendez-vous de la clinique'
      },
      {
        label: 'Factures',
        path: '/factures/list',
        icon: 'receipt',
        description: 'Facturation globale'
      }
    ]
  },
  MEDECIN: {
    label: 'Médecin',
    workspaceTitle: 'Espace medecin',
    homeRoute: '/dashboard',
    nav: [
      {
        label: 'Mon tableau de bord',
        path: '/dashboard',
        icon: 'layout-dashboard',
        description: 'Agenda du jour et prochains RDV'
      },
      {
        label: 'Mon agenda',
        path: '/rendez-vous/planning',
        icon: 'calendar',
        description: 'Rendez-vous et saisie de consultation'
      },
      {
        label: 'Patients',
        path: '/patients/list',
        icon: 'users',
        description: 'Dossiers médicaux et consultations'
      }
    ]
  },
  PATIENT: {
    label: 'Patient',
    workspaceTitle: 'Espace patient',
    homeRoute: '/dashboard',
    nav: [
      {
        label: 'Mon espace',
        path: '/dashboard',
        icon: 'home',
        description: 'Résumé de vos rendez-vous'
      },
      {
        label: 'Prendre RDV',
        path: '/rendez-vous/nouveau',
        icon: 'calendar-plus',
        description: 'Réserver avec vérification des créneaux'
      },
      {
        label: 'Mes rendez-vous',
        path: '/rendez-vous/mes-rdv',
        icon: 'calendar',
        description: 'Historique et prochains RDV'
      },
      {
        label: 'Mes factures',
        path: '/factures/mes-factures',
        icon: 'receipt',
        description: 'Factures après consultation'
      },
      {
        label: 'Nos médecins',
        path: '/medecins/list',
        icon: 'stethoscope',
        description: 'Spécialités et disponibilités'
      }
    ]
  }
};

export function getRoleDefinition(role: UserRole | null): RoleDefinition | null {
  if (!role) {
    return null;
  }
  return ROLE_DEFINITIONS[role];
}

export function getHomeRouteForRole(role: UserRole | null): string {
  return getRoleDefinition(role)?.homeRoute ?? '/auth/login';
}
