export const PERMISSIONS = {
  ARTIST_CREATE: 'artist.create',
  ARTIST_EDIT: 'artist.edit',
  ARTIST_DELETE: 'artist.delete',
  ARTIST_VIEW: 'artist.view',
  LEAD_VIEW: 'lead.view',
  LEAD_UPDATE: 'lead.update',
  SETTINGS_MANAGE: 'settings.manage',
} as const;

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

export type Permission = (typeof ALL_PERMISSIONS)[number];

export const DEFAULT_ROLES = [
  {
    name: 'Admin',
    roleName: 'Admin',
    permissions: [
      PERMISSIONS.ARTIST_CREATE,
      PERMISSIONS.ARTIST_EDIT,
      PERMISSIONS.ARTIST_VIEW,
      PERMISSIONS.LEAD_VIEW,
      PERMISSIONS.LEAD_UPDATE,
    ],
  },
  {
    name: 'Sales Manager',
    roleName: 'Sales Manager',
    permissions: [PERMISSIONS.ARTIST_VIEW, PERMISSIONS.LEAD_VIEW, PERMISSIONS.LEAD_UPDATE],
  },
  {
    name: 'Viewer',
    roleName: 'Viewer',
    permissions: [PERMISSIONS.ARTIST_VIEW, PERMISSIONS.LEAD_VIEW],
  },
];
