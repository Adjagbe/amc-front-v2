import { Departements } from "./departements/departements"

// Interface moderne pour les membres avec support des départements multiples
export interface Membres {
    id: number;
    nom: string;
    prenom: string;
    email?: string;
    portable?: string;
    adresse?: string;
    birthday?: Date | string;
    portable2?: string;
    
    // Support des départements multiples
    departements?: number[];  // Array des IDs des départements sélectionnés
    departementsDetails?: Departements[];  // Array des objets départements complets (reçu du backend)
    
    // Compatibilité avec l'ancien système (à conserver pour l'existant)
    // department?: Departements;
    
    // Timestamps
    created_at?: string;
    updated_at?: string;
}
