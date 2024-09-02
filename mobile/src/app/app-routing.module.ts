import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NavigationPage } from './navigation/navigation.page';
import { AuthGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: NavigationPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'my-events',
        loadChildren: () => import('./pages/my-events/my-events.module').then(m => m.MyEventsPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'message',
        loadChildren: () => import('./pages/message/message.module').then(m => m.MessagePageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/account.module').then(m => m.AccountPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
      },
    ]
  },
  {
    path: 'landing-page',
    loadChildren: () => import('./pages/landing-page/landing-page.module').then( m => m.LandingPagePageModule)
  },
  {
    path: 'my-events',
    loadChildren: () => import('./pages/my-events/my-events.module').then( m => m.MyEventsPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
