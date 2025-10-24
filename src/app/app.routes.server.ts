import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  
  {
    path: 'membres/details/:id',
    renderMode: RenderMode.Server
  },  
  {
    path:'membres/modifier/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Server
  },
];
