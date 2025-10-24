import { HttpHeaders } from "@angular/common/http";

export const environment = {
  production : false,
  // authUrl : 'http:///localhost:5000/api/Auth/login/',

  //apiUrl : 'https://amc-api.aurorewe.com/api/',
   apiUrl : 'http://localhost:8000/api/',
  // indigoUrl : 'https://operasedvregional.edv-ops.com/api/indigotgps',
  // indigotelmpUrl : 'https://operasedvregional.edv-ops.com/api/indigotgps_telemetry',
  headers : new HttpHeaders({
    'Content-Type': 'application/json'
  })
};