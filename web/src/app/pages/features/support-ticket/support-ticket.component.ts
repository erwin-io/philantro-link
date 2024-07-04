import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
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
import { SupportTicketTableColumn } from 'src/app/shared/utility/table';
import { SupportTicketService } from 'src/app/services/support-ticket.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-support-ticket',
  templateUrl: './support-ticket.component.html',
  styleUrls: ['./support-ticket.component.scss'],
  host: {
    class: "page-component"
  }
})
export class SupportTicketComponent  {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    open: new MatTableDataSource<any>([]),
    active: new MatTableDataSource<any>([]),
    completed: new MatTableDataSource<any>([]),
    closed: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    open: 0,
    active: 0,
    completed: 0,
    closed: 0,
  };
  pageSize = {
    open: 10,
    active: 10,
    completed: 10,
    closed: 10,
  };
  total = {
    open: 0,
    active: 0,
    completed: 0,
    closed: 0,
  };
  order = {
    open: { supportTicketId: "ASC" },
    active: { supportTicketId: "ASC" },
    completed: { supportTicketId: "DESC" },
    closed: { supportTicketId: "DESC" },
  };

  filter = {
    open: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    active: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    completed: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    closed: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
  };
  pageAccess: AccessPages = {
    view: true,
    modify: false,
  };

  @ViewChild('supportTicketFormDialog') supportTicketFormDialogTemp: TemplateRef<any>;
  constructor(
    private elementRef: ElementRef,
    private supportTicketService: SupportTicketService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private titleService: Title,
    private _location: Location,
    public router: Router,) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      this.tabIndex = this.route.snapshot.data["tab"];
      if(this.route.snapshot.data) {
        // this.pageSupportTicket = {
        //   ...this.pageSupportTicket,
        //   ...this.route.snapshot.data["supportTicket"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
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
    this.getSupportTicketPaginated("open");
    this.getSupportTicketPaginated("active");
    this.getSupportTicketPaginated("completed");
    this.getSupportTicketPaginated("closed");

  }

  filterChange(supportTicket: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = supportTicket;
    this.getSupportTicketPaginated(table as any);
  }

  async pageChange(supportTicket: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = supportTicket.pageIndex;
    this.pageSize[table] = supportTicket.pageSize;
    await this.getSupportTicketPaginated(table as any);
  }

  async sortChange(supportTicket: { active: string, direction: string }, table: string) {
    const { active, direction } = supportTicket;
    const { apiNotation } = this.appConfig.config.tableColumns.supportTicket.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getSupportTicketPaginated(table as any)
  }

  async getSupportTicketPaginated(table: "open" | "active" | "completed" | "closed"){
    try{
      const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "status");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "status",
          "filter": table.toUpperCase(),
          "name": "status",
          "type": "text"
        });
      }

      this.isLoading = true;
      this.loaderService.show();
      await this.supportTicketService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('support-ticket', []))
      )
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              supportTicketCode: d.supportTicketCode,
              dateTimeSent: d.dateTimeSent.toString(),
              type: d.type,
              title: d.title,
              user: d.user?.name,
              url: `/support-ticket/${d.supportTicketCode}/details`,
            } as SupportTicketTableColumn
          });
          this.total[table] = res.data.total;
          this.dataSource[table] = new MatTableDataSource(data);
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

  showAddDialog() {
    this.dialog.open(this.supportTicketFormDialogTemp)
  }

  onSelectedTabChange({ index }, redirect = true) {
    if(index === 1) {
      if(redirect) {
        this._location.go("/support-ticket/active");
      }
      this.titleService.setTitle(`Active | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/support-ticket/completed");
      }
      this.titleService.setTitle(`Completed | ${this.appConfig.config.appName}`);
    } else if(index === 3) {
      if(redirect) {
        this._location.go("/support-ticket/closed");
      }
      this.titleService.setTitle(`Closed | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/support-ticket/open");
      }
      this.titleService.setTitle(`Open | ${this.appConfig.config.appName}`);
    }
  }
  onAnimationDone(): void {
    const inactiveTabs = this.elementRef.nativeElement.querySelectorAll(
        '.mat-mdc-tab-body-active .mat-mdc-tab-body-content > mat-card:not(:first-child)'
    );

    console.log(inactiveTabs);
    inactiveTabs.forEach(tab => tab.remove());
  }

  handleError<T>(operation = 'operation', result?: any) {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    return (error: any): Observable<any> => {
      return of(error.error as any);
    };
  }
}
