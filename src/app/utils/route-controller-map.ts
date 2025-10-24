

// utilisation de regex
export const routeControllerMap = [
    
    { pattern: /^\/tableau-de-bord$/, controller: 'Controller', action: 'index' },
  
    // membres CRUD
    { pattern: /^\/membres$/, controller: 'MembresController', action: 'index' },
    { pattern: /^\/membres\/ajouter$/, controller: 'MembresController', action: 'create' },
    { pattern: /^\/membres\/details\/\d+$/, controller: 'MembresController', action: 'show' },
    { pattern: /^\/membres\/modifier\/\d+$/, controller: 'MembresController', action: 'edit' },
  
   
];  