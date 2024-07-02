import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';
import { convertNotationToObject } from 'src/app/shared/utility/utility';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { Title } from '@angular/platform-browser';
import { Users } from 'src/app/model/users';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { Location } from '@angular/common';
import { Observable, Subject, catchError, of, takeUntil } from 'rxjs';
import { AccessPages } from 'src/app/model/access.model';
import { TransactionsTableColumn } from 'src/app/shared/utility/table';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  host: {
    class: "page-component"
  }
})
export class TransactionsComponent  {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  currentUserProfile: Users;
  error:string;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order: { transactionId: "ASC" };

  filter: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]= [];
  pageAccess: AccessPages = {
    view: true,
    modify: false,
  };

  @ViewChild('transactionFormDialog') transactionFormDialogTemp: TemplateRef<any>;
  constructor(
    private elementRef: ElementRef,
    private loaderService: LoaderService,
    private transactionService: TransactionsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private titleService: Title,
    private _location: Location,
    public router: Router,) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      if(this.route.snapshot.data) {
        // this.pageTransactions = {
        //   ...this.pageTransactions,
        //   ...this.route.snapshot.data["transaction"]
        // };
      }
    }

  ngOnInit(): void {
  }

  public ngOnDestroy(): void {
      // This aborts all HTTP requests.
      this.ngUnsubscribe.next();
      // This completes the subject properlly.
      this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    this.getTransactionsPaginated();

  }

  filterChange(transaction: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]) {
    this.filter = transaction;
    this.getTransactionsPaginated();
  }

  async pageChange(transaction: { pageIndex: number, pageSize: number }) {
    this.pageIndex = transaction.pageIndex;
    this.pageSize = transaction.pageSize;
    await this.getTransactionsPaginated();
  }

  async sortChange(transaction: { active: string, direction: string }) {
    const { active, direction } = transaction;
    const { apiNotation } = this.appConfig.config.tableColumns.transactions.find(x=>x.name === active);
    this.order = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getTransactionsPaginated()
  }

  async getTransactionsPaginated(showProgress = true){
    try{

      this.isLoading = true;
      if(showProgress === true) {
        this.loaderService.show();
      }
      await this.transactionService.getByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('transaction', []))
      )
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              transactionCode: d.transactionCode,
              dateTime: d.dateTime.toString(),
              amount: d.amount,
              paymentType: d.paymentType,
              accountNumber: d.accountNumber,
              accountName: d.accountName,
              url: `/transactions/${d.transactionCode}/details`,
            } as TransactionsTableColumn
          });
          this.total = res.data.total;
          this.dataSource = new MatTableDataSource(data);
          this.isLoading = false;
          this.loaderService.hide();
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
          this.loaderService.hide();
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
        this.loaderService.hide();
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading = false;
      this.loaderService.hide();
    }

  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => {
      return of(error.error as any);
    };
  }
}
