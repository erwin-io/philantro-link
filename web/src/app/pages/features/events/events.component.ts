import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
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
import { EventsTableColumn } from 'src/app/shared/utility/table';
import { OneSignalService } from 'src/app/services/one-signal.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  host: {
    class: "page-component"
  }
})
export class EventsComponent  {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  tabIndex = 0;
  currentUserProfile: Users;
  error:string;
  dataSource = {
    pending: new MatTableDataSource<any>([]),
    approved: new MatTableDataSource<any>([]),
    completed: new MatTableDataSource<any>([]),
    rejected: new MatTableDataSource<any>([]),
    cancelled: new MatTableDataSource<any>([]),
  }
  displayedColumns = [];
  isLoading = false;
  isProcessing = false;
  pageIndex = {
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
  };
  pageSize = {
    pending: 10,
    approved: 10,
    completed: 10,
    rejected: 10,
    cancelled: 10,
  };
  total = {
    pending: 0,
    approved: 0,
    completed: 0,
    rejected: 0,
    cancelled: 0,
  };
  order = {
    pending: { eventId: "ASC" },
    approved: { eventId: "ASC" },
    completed: { eventId: "DESC" },
    rejected: { eventId: "DESC" },
    cancelled: { eventId: "DESC" },
  };

  filter = {
    pending: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    approved: [] as {
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
    rejected: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[],
    cancelled: [] as {
      apiNotation: string;
      filter: string;
      name: string;
      type: string;
    }[]
  };
  pageAccess: AccessPages = {
    view: true,
    modify: false,
  };

  @ViewChild('eventFormDialog') eventFormDialogTemp: TemplateRef<any>;
  constructor(
    private elementRef: ElementRef,
    private eventService: EventsService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public appConfig: AppConfigService,
    private storageService: StorageService,
    private oneSignalService: OneSignalService,
    private route: ActivatedRoute,
    private titleService: Title,
    private _location: Location,
    public router: Router) {
      this.currentUserProfile = this.storageService.getLoginProfile();
      this.tabIndex = this.route.snapshot.data["tab"];
      if(this.route.snapshot.data) {
        // this.pageEvents = {
        //   ...this.pageEvents,
        //   ...this.route.snapshot.data["event"]
        // };
      }
      this.onSelectedTabChange({index: this.tabIndex}, false);
    }

  ngOnInit(): void {
    this.oneSignalService.data$.subscribe(res=> {
      console.log("changes!");
      this.getEventsPaginated("pending");
      this.getEventsPaginated("approved");
      this.getEventsPaginated("completed");
      this.getEventsPaginated("rejected");
      this.getEventsPaginated("cancelled");

    })
  }

  public ngOnDestroy(): void {
      // This aborts all HTTP requests.
      this.ngUnsubscribe.next();
      // This completes the subject properlly.
      this.ngUnsubscribe.complete();
  }

  ngAfterViewInit() {
    this.getEventsPaginated("pending");
    this.getEventsPaginated("approved");
    this.getEventsPaginated("completed");
    this.getEventsPaginated("rejected");
    this.getEventsPaginated("cancelled");

  }

  filterChange(event: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[], table: string) {
    this.filter[table] = event;
    this.getEventsPaginated(table as any);
  }

  async pageChange(event: { pageIndex: number, pageSize: number }, table: string) {
    this.pageIndex[table] = event.pageIndex;
    this.pageSize[table] = event.pageSize;
    await this.getEventsPaginated(table as any);
  }

  async sortChange(event: { active: string, direction: string }, table: string) {
    const { active, direction } = event;
    const { apiNotation } = this.appConfig.config.tableColumns.events.find(x=>x.name === active);
    this.order[table] = convertNotationToObject(apiNotation, direction === "" ? "ASC" : direction.toUpperCase());
    this.getEventsPaginated(table as any)
  }

  async getEventsPaginated(table: "pending" | "approved" | "completed" | "rejected" | "cancelled", showProgress = true){
    try{
      const findIndex = this.filter[table].findIndex(x=>x.apiNotation === "eventStatus");
      if(findIndex >= 0) {
        this.filter[table][findIndex] = {
          "apiNotation": "eventStatus",
          "filter": table.toUpperCase(),
          "name": "eventStatus",
          "type": "text"
        };
      } else {
        this.filter[table].push({
          "apiNotation": "eventStatus",
          "filter": table.toUpperCase(),
          "name": "eventStatus",
          "type": "text"
        });
      }

      this.isLoading = true;
      if(showProgress === true) {
        this.loaderService.show();
      }
      await this.eventService.getByAdvanceSearch({
        order: this.order[table],
        columnDef: this.filter[table],
        pageIndex: this.pageIndex[table],
        pageSize: this.pageSize[table]
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('event', []))
      )
      .subscribe(async res => {
        if(res.success){
          let data = res.data.results.map((d)=>{
            return {
              eventCode: d.eventCode,
              dateTime: d.dateTime.toString(),
              eventType: d.eventType,
              eventName: d.eventName,
              eventLocName: d?.eventLocName??"NA",
              user: d.user?.name,
              inProgress: d.inProgress,
              url: `/events/${d.eventCode}/details`,
            } as EventsTableColumn
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
    this.dialog.open(this.eventFormDialogTemp)
  }

  onSelectedTabChange({ index }, redirect = true) {
    if(index === 1) {
      if(redirect) {
        this._location.go("/events/approved");
      }
      this.titleService.setTitle(`Approved | ${this.appConfig.config.appName}`);
    } else if(index === 2) {
      if(redirect) {
        this._location.go("/events/completed");
      }
      this.titleService.setTitle(`Ccompleted | ${this.appConfig.config.appName}`);
    } else if(index === 3) {
      if(redirect) {
        this._location.go("/events/rejected");
      }
      this.titleService.setTitle(`Rejected | ${this.appConfig.config.appName}`);
    } else if(index === 4) {
      if(redirect) {
        this._location.go("/events/cancelled");
      }
      this.titleService.setTitle(`Cancelled | ${this.appConfig.config.appName}`);
    } else {
      if(redirect) {
        this._location.go("/events/pending");
      }
      this.titleService.setTitle(`Pending | ${this.appConfig.config.appName}`);
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
