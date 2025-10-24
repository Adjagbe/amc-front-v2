import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Departements } from '../../models/departements/departements';

@Injectable({
  providedIn: 'root',
})
export class DepartementsService {

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les départements disponibles
   * @returns Promise<Departements[]> Liste de tous les départements
   */
  async getAllDepartements(): Promise<Departements[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(environment.apiUrl + 'departements')
      );
      // L'API Laravel retourne les données dans response.data
      return response.data || response;
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      throw error;
    }
  }

  /**
   * Ajoute un nouveau département
   * @param data Données du département à créer
   * @returns Promise<Departements> Département créé
   */
  async addDepartement(data: any): Promise<Departements> {
    try {
      const response = await firstValueFrom(
        this.http.post<any>(environment.apiUrl + 'departements', data)
      );
      return response.data || response;
    } catch (error) {
      console.error('Erreur lors de l ajout du département:', error);
      throw error;
    }
  }

  /**
   * Récupère un département par son ID
   * @param id ID du département à récupérer
   * @returns Promise<Departements> Département trouvé
   */
  async getDepartementById(id: number): Promise<Departements> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(environment.apiUrl + `departements/${id}`)
      );
      return response.data || response;
    } catch (error) {
      console.error('Erreur lors de la récupération du département:', error);
      throw error;
    }
  }

  /**
   * Met à jour un département existant
   * @param id ID du département à mettre à jour
   * @param data Nouvelles données du département
   * @returns Promise<Departements> Département mis à jour
   */
  async UpdateDepartement(id: number, data: any): Promise<Departements> {
    try {
      const response = await firstValueFrom(
        this.http.put<any>(environment.apiUrl + `departements/${id}`, data)
      );
      return response.data || response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du département:', error);
      throw error;
    }
  }

  /**
   * Supprime un département
   * @param id ID du département à supprimer
   * @returns Promise<any> Résultat de la suppression
   */
  async deleteDepartement(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.delete<any>(environment.apiUrl + `departements/${id}`)
      );
      return response.data || response;
    } catch (error) {
      console.error('Erreur lors de la suppression du département:', error);
      throw error;
    }
  }
}
