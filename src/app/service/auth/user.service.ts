import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {



  private isBrowser: boolean;

  constructor(private http: HttpClient) {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async login(data: any) : Promise<any>{
    const response: any = await firstValueFrom(this.http.post(environment.apiUrl +`login`, data, {headers: environment.headers}))

    const session = {
      token : response.token,
      as_js: {
        name_user: response.user.name + ' ' + response.user.last_name, 
        acces: response.user.id_role,
      },
      fonctionnalites: response.fonctionnalites || [],
      lastLogin: new Date().toISOString()
    };
    localStorage.setItem('session', JSON.stringify(session));

    return response;
  }




  getUser() {
    if (!this.isBrowser) return null;
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session).user : null;
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    const session = localStorage.getItem('session');
    return session ? JSON.parse(session).token : null;
  }
}
