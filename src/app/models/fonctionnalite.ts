export interface Fonctionnalite {
  id?: number;
  libelle: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

export interface Role {
  id?: number;
  libelle: string;
  fonctionnalites?: Fonctionnalite[];
  created_at?: string;
  updated_at?: string;
}

export interface RoleFonctionnalite {
  role_id: number;
  fonctionnalite_id: number;
}
