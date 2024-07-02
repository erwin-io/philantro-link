import { AccessPagesTableComponent } from '../../../shared/access-pages-table/access-pages-table.component';
import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule, NgFor } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DataTableModule } from "../../../shared/data-table/data-table.module";
import { UsersComponent } from './users.component';
import { AccessPagesTableModule } from 'src/app/shared/access-pages-table/access-pages-table.module';
import { ChangePasswordComponent } from './user-details/change-password/change-password.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: UsersComponent,
    data: { title: "Users"}
  },
  {
    path: 'add',
    component: UserDetailsComponent,
    data: { title: "New User", details: true, isNew: true}
  },
  {
    path: ':userCode',
    component: UserDetailsComponent,
    data: { title: "Users", details: true }
  },
  {
    path: ':userCode/edit',
    component: UserDetailsComponent,
    data: { title: "Users", details: true, edit: true }
  },
];

@NgModule({
    declarations: [UsersComponent, UserDetailsComponent, ChangePasswordComponent],
    imports: [
        CommonModule,
        FlexLayoutModule,
        MaterialModule,
        NgxSkeletonLoaderModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        DataTableModule,
        NgFor,
        AsyncPipe,
        AccessPagesTableModule
    ]
})
export class UsersModule { }
