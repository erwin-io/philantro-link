import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'all',
        loadChildren: () => import('./all/all.module').then( m => m.AllPageModule)
      },
      {
        path: 'help',
        loadChildren: () => import('./help/help.module').then( m => m.HelpPageModule)
      },
      {
        path: 'donation',
        loadChildren: () => import('./donation/donation.module').then( m => m.DonationPageModule)
      },
      {
        path: 'charity',
        loadChildren: () => import('./charity/charity.module').then( m => m.CharityPageModule)
      },
      {
        path: 'volunteer',
        loadChildren: () => import('./volunteer/volunteer.module').then( m => m.VolunteerPageModule)
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all'
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
