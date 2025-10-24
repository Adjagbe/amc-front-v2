import { Membres } from "../membres";

export class Departements {
    id!:number;
    libelle!:string;
    id_responsable?: Membres | null | any;
    id_responsable2?: Membres | null | any;
}
 