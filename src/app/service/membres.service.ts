import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Membres } from '../models/membres';

@Injectable({
  providedIn: 'root'
})
export class MembresService {

 constructor( private http : HttpClient ) { }

  async getallMembre() : Promise<any> {
    const response = await firstValueFrom(this.http.get(environment.apiUrl+'membres'))
    return response
  }

  async addMembre(data : any): Promise<any>{
    const response = await firstValueFrom(this.http.post(environment.apiUrl+'membres', data ))
    return response
  }

  async getMembresById(id:any): Promise<any>{
    const response = await firstValueFrom(this.http.get<any>(environment.apiUrl + `membres/${id}`))
    return response
  }

  async UpdateMembre(id: any, data: any) :Promise<any> {

    const response = await firstValueFrom(this.http.put<any>(environment.apiUrl + `membres/${id}`, data))
    return response 
  }

  async getPaginateMembre(page = 1, take = 8, search = '') :Promise<any[]>{
    const response = await firstValueFrom(this.http.get<Membres[]>(environment.apiUrl + 'membres/paginate',
      {
        params: {
          page: page,
          per_page: take,
          search: search.trim()
        }
      }))
    return response
  }

  /**
   * Compte le nombre de membres par département
   * @param departementId ID du département
   * @returns Nombre de membres dans ce département
   */
  async countMembresByDepartement(departementId: number): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.http.get<{count: number}>(environment.apiUrl + `membres/count-by-departement/${departementId}`)
      );
      return response.count;
    } catch (error) {
      console.error('Erreur lors du comptage des membres:', error);
      return 0;
    }
  }

  /**
   * Récupère le comptage de tous les départements en une seule fois
   * @returns Objet avec les IDs des départements comme clés et les comptages comme valeurs
   */
  async getAllDepartementsCount(): Promise<{[departementId: number]: number}> {
    try {
      const response = await firstValueFrom(
        this.http.get<{[departementId: number]: number}>(environment.apiUrl + 'membres/count-all-departements')
      );
      return response;
    } catch (error) {
      console.error('Erreur lors du comptage des départements:', error);
      return {};
    }
  }

  /**
   * Récupère tous les membres d'un département spécifique
   * @param departementId ID du département
   * @returns Liste des membres et comptage
   */
  async getMembresByDepartement(departementId: number): Promise<{membres: Membres[], count: number}> {
    try {
      const response = await firstValueFrom(
        this.http.get<{membres: Membres[], count: number}>(environment.apiUrl + `membres/by-departement/${departementId}`)
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des membres du département:', error);
      return { membres: [], count: 0 };
    }
  }

  /**
   * Récupère les membres d'un département avec pagination
   * @param departementId ID du département
   * @param page Numéro de la page
   * @param pageSize Nombre d'éléments par page
   * @param searchTerm Terme de recherche
   * @returns Données paginées
   */
  async getPaginateMembresByDepartement(departementId: number, page: number, pageSize: number, searchTerm: string): Promise<any> {
    return await firstValueFrom(
      this.http.get(`${environment.apiUrl}membres/paginate-by-departement/${departementId}?page=${page}&per_page=${pageSize}&search=${searchTerm}`)
    );
  }

  /**
   * Supprime un membre
   * @param id ID du membre à supprimer
   * @returns Message de confirmation
   */
  async deleteMembre(id: number): Promise<{message: string}> {
    try {
      const response = await firstValueFrom(
        this.http.delete<{message: string}>(environment.apiUrl + `membres/${id}`)
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression du membre:', error);
      throw error;
    }
  }
}
