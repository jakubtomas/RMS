import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";
//import {canActivate} from "@angular/fire/compat/auth-guard";

const routes: Routes = [

    {
        path: '',
        redirectTo: '/tabs/tab1',
        // redirectTo: 'signup',
        pathMatch: 'full'
    },

    {
        path: '',
        loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
    },
    /*{
     path: 'signup',
     loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule)
     },*/
    {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'registration',
        loadChildren: () => import('./pages/registration/registration.module').then(m => m.RegistrationPageModule)
    },


    {
        path: 'list-business',
        loadChildren: () => import('./pages/business/list-business/list-business.module').then(m => m.ListBusinessPageModule)
    },
    {
        path: 'register-business',
        loadChildren: () => import('./pages/business/register-business/register-business.module').then(m => m.RegisterBusinessPageModule),
        canActivate: [AuthGuard]
    },
    {
        path: 'detail-business',
        loadChildren: () => import('./pages/business/detail-business/detail-business.module').then(m => m.DetailBusinessPageModule)
    },

  {
    path: 'create-calendar',
    loadChildren: () => import('./pages/calendar/create-calendar/create-calendar.module').then( m => m.CreateCalendarPageModule)
  },  {
    path: 'search-business',
    loadChildren: () => import('./pages/business/search-business/search-business.module').then( m => m.SearchBusinessPageModule)
  },




];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
