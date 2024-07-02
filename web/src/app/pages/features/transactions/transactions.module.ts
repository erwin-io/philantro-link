import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { TransactionsComponent } from './transactions.component';
import { TransactionsDetailsComponent } from './transactions-details/transactions-details.component';


export const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent,
    pathMatch: 'full',
    data: { title: "Transactions" }
  },
  {
    path: ':transactionCode/details',
    component: TransactionsDetailsComponent,
    data: { title: "Transactions", details: true }
  },
]

@NgModule({
  declarations: [
    TransactionsComponent,
    TransactionsDetailsComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ]
})
export class TransactionsModule { }
