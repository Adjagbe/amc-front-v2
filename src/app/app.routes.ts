import { Routes } from '@angular/router';
import { MembresComponent } from './pages/membres/membres.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AjouterComponent } from './pages/membres/ajouter/ajouter.component';
import { DetailsComponent } from './pages/membres/details/details.component';
import { ModifierComponent } from './pages/membres/modifier/modifier.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { ConnexionComponent } from './pages/auth/connexion/connexion.component';
import { authGuard } from './guards/auth.guard';
import { AllowGuard } from './guards/allow.guard';
import { LogsActivityComponent } from './pages/logs-activity/logs-activity.component';
import { DepartementComponent } from './pages/departement/All/liste/departement.component';
import { FinanceComponent } from './pages/finance/finance.component';
import { AjouterDepartementComponent } from './pages/departement/All/ajouter-departement/ajouter-departement.component';
import { DetailsDepartementComponent } from './pages/departement/All/details-departement/details-departement.component';
import { ModifierDepartementComponent } from './pages/departement/All/modifier-departement/modifier-departement.component';
import { EnfantComponent } from './pages/departement/enfant/enfant.component';
import { AdolescentsComponent } from './pages/departement/adolescents/adolescents.component';
import { JeunesseComponent } from './pages/departement/jeunesse/jeunesse.component';
import { AuxiliaireLydieComponent } from './pages/departement/auxiliaire-lydie/auxiliaire-lydie.component';
import { AuxiliaireJeunesFillesComponent } from './pages/departement/auxiliaire-jeunes-filles/auxiliaire-jeunes-filles.component';
import { ServiceSocialComponent } from './pages/departement/service-social/service-social.component';
import { ChoraleComponent } from './pages/departement/chorale/chorale.component';
import { ServiceOrdreComponent } from './pages/departement/service-ordre/service-ordre.component';
import { ServiceMultimediaComponent } from './pages/departement/service-multimedia/service-multimedia.component';
import { RayonSoleilComponent } from './pages/departement/rayon-soleil/rayon-soleil.component';
import { UnionFemmesMissionnairesComponent } from './pages/departement/union-femmes-missionnaires/union-femmes-missionnaires.component';
import { UnionHommesMissionnairesComponent } from './pages/departement/union-hommes-missionnaires/union-hommes-missionnaires.component';
import { FonctionnalitesComponent } from './pages/parametrage/fonctionnalites/fonctionnalites.component';
import { RolesComponent } from './pages/parametrage/roles/roles.component';
import { PermissionsComponent } from './pages/parametrage/roles/permissions/permissions.component';
import { AjouterComponent as AjouterRoleComponent } from './pages/parametrage/roles/ajouter/ajouter.component';
import { ModifierComponent as ModifierRoleComponent } from './pages/parametrage/roles/modifier/modifier.component';
import { AjouterComponent as AjouterFonctionnaliteComponent } from './pages/parametrage/fonctionnalites/ajouter/ajouter.component';
import { ModifierComponent as ModifierFonctionnaliteComponent } from './pages/parametrage/fonctionnalites/modifier/modifier.component';


export const routes: Routes = [

    { path: '', redirectTo:'tableau-de-bord', pathMatch:'full'},

    {
        path:'connexion', component: AuthLayoutComponent,
        children : [
            {path:'', component: ConnexionComponent}
        ]
    },

    {
        path:'tableau-de-bord',
        canActivate: [authGuard],
        component:MainLayoutComponent,
        children:[
            { path: '', component: DashboardComponent }
        ]
    },
    {
        path: 'activity',
        canActivate: [authGuard],
        component: MainLayoutComponent,
        children: [
            { path: 'logs', component: LogsActivityComponent, canActivate: [AllowGuard] }
        ]
    },
    {
        path:'membres',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: MembresComponent, canActivate: [AllowGuard] },
            { path: 'ajouter', component: AjouterComponent, canActivate: [AllowGuard] },
            { path: 'details/:id', component: DetailsComponent, canActivate: [AllowGuard] },
            { path: 'modifier/:id', component: ModifierComponent, canActivate: [AllowGuard] }
        ]
    },
    {
        path:'departement',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: DepartementComponent, canActivate: [AllowGuard] },
            { path: 'ajouter', component: AjouterDepartementComponent, canActivate: [AllowGuard] },
            { path: 'details/:id', component: DetailsDepartementComponent, canActivate: [AllowGuard] },
            { path: 'modifier/:id', component: ModifierDepartementComponent, canActivate: [AllowGuard] }
        ]
    },
    {
        path:'departement/enfants',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: EnfantComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/adolescents',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: AdolescentsComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/jeunesse',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: JeunesseComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/auxiliaire-lydie',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: AuxiliaireLydieComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/auxiliaire-jeunes-filles',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: AuxiliaireJeunesFillesComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/service-social',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: ServiceSocialComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/chorale',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: ChoraleComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/service-ordre',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: ServiceOrdreComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/service-multimedia',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: ServiceMultimediaComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/rayon-soleil',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: RayonSoleilComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/union-femmes-missionnaires',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: UnionFemmesMissionnairesComponent, canActivate: [AllowGuard] },
        ]
    },
    {
        path:'departement/union-hommes-missionnaires',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: UnionHommesMissionnairesComponent, canActivate: [AllowGuard] },
        ]
    },
    
    {
        path:'finance',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: FinanceComponent, canActivate: [AllowGuard] },
            // { path: 'ajouter', component: AjouterComponent, canActivate: [AllowGuard] },
        ]
    },

    {
        path:'parametrage/roles',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: RolesComponent, canActivate: [AllowGuard] },
            { path: 'ajouter', component: AjouterRoleComponent, canActivate: [AllowGuard] },
            { path: 'modifier/:id', component: ModifierRoleComponent, canActivate: [AllowGuard] },
            { path: ':id/permissions', component: PermissionsComponent, canActivate: [AllowGuard] },
        ]
    },

    {
        path:'parametrage/fonctionnalites',
        component:MainLayoutComponent,
        canActivate: [authGuard],
        children:[
            { path: '', component: FonctionnalitesComponent, canActivate: [AllowGuard] },
            { path: 'ajouter', component: AjouterFonctionnaliteComponent, canActivate: [AllowGuard] },
            { path: 'modifier/:id', component: ModifierFonctionnaliteComponent, canActivate: [AllowGuard] },
        ]
    },

    {
        path: '**', /** Nimporte quelle route qui n'est pas reconnu  */
        redirectTo: 'tableau-de-bord'
      },
];
