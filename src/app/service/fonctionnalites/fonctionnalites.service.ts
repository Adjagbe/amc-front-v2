import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Fonctionnalite, Role } from '../../models/fonctionnalite';

@Injectable({
  providedIn: 'root'
})
export class FonctionnalitesService {

  constructor(private http: HttpClient) { }

  async getAllFonctionnalites(): Promise<Fonctionnalite[]> {
    const response: any = await firstValueFrom(
      this.http.get(`${environment.apiUrl}fonctionnalites`, { headers: environment.headers })
    );
    return response.fonctionnalites;
  }

  async getPaginateFonctionnalites(page: number, pageSize: number, searchTerm: string = ''): Promise<any> {
    const response: any = await firstValueFrom(
      this.http.get(
        `${environment.apiUrl}fonctionnalites/paginate?page=${page}&take=${pageSize}&search=${searchTerm}`,
        { headers: environment.headers }
      )
    );
    return response;
  }

  async getFonctionnalite(id: number): Promise<Fonctionnalite> {
    return await firstValueFrom(
      this.http.get<Fonctionnalite>(`${environment.apiUrl}fonctionnalites/${id}`, { headers: environment.headers })
    );
  }

  async createFonctionnalite(fonctionnalite: Partial<Fonctionnalite>): Promise<any> {
    return await firstValueFrom(
      this.http.post(`${environment.apiUrl}fonctionnalites`, fonctionnalite, { headers: environment.headers })
    );
  }

  async updateFonctionnalite(id: number, fonctionnalite: Partial<Fonctionnalite>): Promise<any> {
    return await firstValueFrom(
      this.http.put(`${environment.apiUrl}fonctionnalites/${id}`, fonctionnalite, { headers: environment.headers })
    );
  }

  async deleteFonctionnalite(id: number): Promise<any> {
    return await firstValueFrom(
      this.http.delete(`${environment.apiUrl}fonctionnalites/${id}`, { headers: environment.headers })
    );
  }



 

  // Méthode pour vérifier si l'utilisateur a une fonctionnalité
  hasFonctionnalite(fonctionnalite: string): boolean {
    const session = localStorage.getItem('session');
    if (!session) return false;

    const data = JSON.parse(session);
    const fonctionnalites = data.fonctionnalites || [];
    return fonctionnalites.includes(fonctionnalite);
  }

  // Méthode pour vérifier plusieurs fonctionnalités (OU logique)
  hasAnyFonctionnalite(fonctionnalites: string[]): boolean {
    return fonctionnalites.some(f => this.hasFonctionnalite(f));
  }

  // Méthode pour vérifier toutes les fonctionnalités (ET logique)
  hasAllFonctionnalites(fonctionnalites: string[]): boolean {
    return fonctionnalites.every(f => this.hasFonctionnalite(f));
  }
}
