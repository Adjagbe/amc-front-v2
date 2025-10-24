import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Role } from '../../models/fonctionnalite';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }

  async getAllRoles(): Promise<Role[]> {
    const response: any = await firstValueFrom(
      this.http.get(`${environment.apiUrl}roles`, { headers: environment.headers })
    );
    return response.roles;
  }

  async getRole(id: number): Promise<Role> {
    const response: any = await firstValueFrom(
      this.http.get(`${environment.apiUrl}roles/${id}`, { headers: environment.headers })
    );
    return response.role;
  }

  async createRole(role: Partial<Role>): Promise<any> {
    const response: any = await firstValueFrom(
      this.http.post(`${environment.apiUrl}roles`, role, { headers: environment.headers })
    );
    return response;
  }

  async updateRole(id: number, role: Partial<Role>): Promise<any> {
    const response: any = await firstValueFrom(
      this.http.put(`${environment.apiUrl}roles/${id}`, role, { headers: environment.headers })
    );
    return response;
  }

  async deleteRole(id: number): Promise<any> {
    const response: any = await firstValueFrom(
      this.http.delete(`${environment.apiUrl}roles/${id}`, { headers: environment.headers })
    );
    return response;
  }

  async assignFonctionnalites(roleId: number, fonctionnaliteIds: number[]): Promise<any> {
    const response: any = await firstValueFrom(
      this.http.post(
        `${environment.apiUrl}roles/${roleId}/assign-fonctionnalites`,
        { fonctionnalites: fonctionnaliteIds },
        { headers: environment.headers }
      )
    );
    return response;
  }
}
