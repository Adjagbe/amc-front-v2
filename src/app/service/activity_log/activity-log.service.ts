import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { routeControllerMap } from '../../utils/route-controller-map';
import { ActivityLogs } from '../../models/activity-logs/activity-logs';

@Injectable({
  providedIn: 'root'
})
export class ActivityLogService {

  constructor(private http: HttpClient) { }

  async addLogActivity(path: string): Promise<any> {

    const mapping = routeControllerMap.find(m => m.pattern.test(path));

    if (mapping) {
      const response = firstValueFrom(this.http.post(environment.apiUrl + 'activity',
        { route: path, controller: mapping.controller, action: mapping.action }))
      return response
    }

  }

  async getActivityLogs(): Promise<ActivityLogs[]> {
    const response = await firstValueFrom(this.http.get<ActivityLogs[]>(environment.apiUrl + 'activity'))
    return response
  }

}
