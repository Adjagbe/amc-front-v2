import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  /**
   * Récupère tous les utilisateurs
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}users`, { headers: environment.headers })
      );
      return response.users || response;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  /**
   * Récupère les utilisateurs avec pagination
   */
  async getPaginateUsers(page: number, pageSize: number, searchTerm: string = ''): Promise<any> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(
          `${environment.apiUrl}users/paginate?page=${page}&per_page=${pageSize}&search=${searchTerm}`,
          { headers: environment.headers }
        )
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs paginés:', error);
      throw error;
    }
  }

  /**
   * Récupère un utilisateur par son ID
   */
  async getUser(id: number): Promise<User> {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${environment.apiUrl}users/${id}`, { headers: environment.headers })
      );
      return response.user || response;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Crée un nouvel utilisateur
   */
  async createUser(userData: CreateUserRequest): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.post(`${environment.apiUrl}users`, userData, { headers: environment.headers })
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Met à jour un utilisateur
   */
  async updateUser(id: number, userData: UpdateUserRequest): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.put(`${environment.apiUrl}users/${id}`, userData, { headers: environment.headers })
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Supprime un utilisateur
   */
  async deleteUser(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.delete(`${environment.apiUrl}users/${id}`, { headers: environment.headers })
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Archive/Désarchive un utilisateur
   */
  async toggleArchiveUser(id: number): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.patch(`${environment.apiUrl}users/${id}/toggle-archive`, {}, { headers: environment.headers })
      );
      return response;
    } catch (error) {
      console.error('Erreur lors de l\'archivage de l\'utilisateur:', error);
      throw error;
    }
  }

  /**
   * Change le mot de passe d'un utilisateur
   */
  async changePassword(id: number, passwordData: { password: string, password_confirmation: string }): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.patch(`${environment.apiUrl}users/${id}/change-password`, passwordData, { headers: environment.headers })
      );
      return response;
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }
}
