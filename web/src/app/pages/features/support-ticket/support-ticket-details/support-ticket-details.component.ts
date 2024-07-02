import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, Subscription, catchError, debounceTime, distinctUntilChanged, map, of, takeUntil } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/model/users';
import { AccessPages } from 'src/app/model/access.model';
import { SupportTicket, SupportTicketMessage } from 'src/app/model/support-ticket.model';
import { SupportTicketService } from 'src/app/services/support-ticket.service';
import { ApiResponse } from 'src/app/model/api-response.model';
import { MapBoxComponent } from 'src/app/shared/map-box/map-box.component';
import { SupportTicketTableColumn } from 'src/app/shared/utility/table';
import { OneSignalService } from 'src/app/services/one-signal.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-support-ticket-details',
  templateUrl: './support-ticket-details.component.html',
  styleUrls: ['./support-ticket-details.component.scss'],
  host: {
    class: "page-component support-ticket"
  }
})
export class SupportTicketDetailsComponent {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  currentUserProfile:Users;
  supportTicketCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  sending = false;
  isProcessing = false;
  isLoadingRoles = false;
  canAddEdit = false;

  userMessage = new FormControl();

  supportTicket: SupportTicket;

  @ViewChild(MapBoxComponent, { static: true}) mapBox: MapBoxComponent;

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;


  pageIndex = 0;
  pageSize = 10;
  total = 0;
  order = { dateTimeSent: "DESC" };

  filter: {
    apiNotation: string;
    filter: string;
    name: string;
    type: string;
  }[]= [];

  supportTicketMessages: SupportTicketMessage[] = [];

  constructor(
    private supportTicketService: SupportTicketService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private oneSignalService: OneSignalService
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.supportTicketCode = this.route.snapshot.paramMap.get('supportTicketCode');
    this.isReadOnly = !edit && !isNew;
    if (this.route.snapshot.data) {
      this.pageAccess = {
        ...this.pageAccess,
        ...this.route.snapshot.data['access'],
      };
    }
  }

  get pageRights() {
    let rights = {};
    for(var right of this.pageAccess.rights) {
      rights[right] = this.pageAccess.modify;
    }
    return rights;
  }

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    // await Promise.all([
    // ])
    if(!this.isNew) {
      this.canAddEdit = !this.isReadOnly;
      this.initDetails();
      this.filter = [{
        apiNotation: "supportTicket.supportTicketCode",
        filter: this.supportTicketCode,
        name: "supportTicket",
        type: "precise"
      }];
      this.supportTicketMessages = [];
      this.initMessage();
    } else {
      this.canAddEdit = true;
      this.isLoading = false;
    }
    this.oneSignalService.data$.subscribe((res: { notification: any})=> {
      if(res.notification) {
        console.log("changes!");
        this.initMessage();
        this.snackBar.open("New message!", "Close", {
          panelClass: "app-notification-primary",
          verticalPosition: "top"
        });
      }

    })
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.loaderService.show();
      this.supportTicketService.getByCode(this.supportTicketCode).subscribe(res=> {
        this.loaderService.hide();
        if (res.success) {
          this.supportTicket = res.data;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/support-ticket/']);
        }
      });
    } catch(ex) {
      this.loaderService.hide();
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/support-ticket/']);
      this.isLoading = false;
    }
  }

  async initMessage(showProgress = true) {
    try{

      this.isLoading = true;
      await this.supportTicketService.getMessageByAdvanceSearch({
        order: this.order,
        columnDef: this.filter,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).pipe(
        takeUntil(this.ngUnsubscribe),
        catchError(this.handleError('support-ticket-message', []))
      )
      .subscribe(async res => {
        if(res.success){
          this.supportTicketMessages = [
            ...res.data.results.filter((data: SupportTicketMessage) =>
              !this.supportTicketMessages.some((message) => message.supportTicketMessageId === data.supportTicketMessageId)
            ),
            ...this.supportTicketMessages
          ];
          this.total = res.data.total;
          this.isLoading = false;
        }
        else{
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
          this.isLoading = false;
        }
      }, async (err) => {
        this.error = Array.isArray(err.message) ? err.message[0] : err.message;
        this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
        this.isLoading = false;
      });
    }
    catch(e){
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {panelClass: ['style-error']});
      this.isLoading = false;
    }
  }

  updateStatus(status: "ACTIVE" | "COMPLETED" | "CLOSED") {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    if(status === "CLOSED") {
      dialogData.message = 'Are you sure you want to closed this support ticket?';
    } else if (status === "COMPLETED") {
      dialogData.message = 'Are you sure you want to complete this support ticket?';
    } else {
      dialogData.message = 'Are you sure you want to mark this support ticket as active?';
    }
    dialogData.confirmButton = {
      visible: true,
      text: 'yes',
      color: 'primary',
    };
    dialogData.dismissButton = {
      visible: true,
      text: 'cancel',
    };
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: '400px',
      closeOnNavigation: true,
    });
    dialogRef.componentInstance.alertDialogConfig = dialogData;


    dialogRef.componentInstance.conFirm.subscribe(async (data: any) => {

    this.isProcessing = true;
    dialogRef.componentInstance.isProcessing = this.isProcessing;
    try {
      this.loaderService.show();
      let res = await this.supportTicketService.updateStatus(this.supportTicketCode, { status, assignedAdminUserCode: this.currentUserProfile.userCode }).toPromise();
      this.loaderService.hide();
      if (res.success) {
        this.snackBar.open('Successfully updated!', 'close', {
          panelClass: ['style-success'],
        });
        this.router.navigate(['/support-ticket/' + this.supportTicketCode + '/details']);
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        await this.ngAfterViewInit();
        dialogRef.close();
        this.dialog.closeAll();
      } else {
        this.isProcessing = false;
        dialogRef.componentInstance.isProcessing = this.isProcessing;
        this.error = Array.isArray(res.message)
          ? res.message[0]
          : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
        dialogRef.close();
      }
    } catch (e) {
      this.loaderService.hide();
      this.isProcessing = false;
      dialogRef.componentInstance.isProcessing = this.isProcessing;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      dialogRef.close();
    }
    });
  }

  async postMessage(message: string) {
    this.userMessage.setValue("");
    try {
      this.isProcessing = true;
      this.sending = true;
      let res = await this.supportTicketService
        .postMessage({
          supportTicketCode: this.supportTicketCode,
          message ,
          userCode: this.currentUserProfile.userCode
        })
        .toPromise();
      if (res.success) {
        this.isProcessing = false;
        this.sending = false;
        this.initMessage();
        this.snackBar.open('Successfully sent!', 'close', {
          panelClass: ['style-success'],
        });
      } else {
        this.isProcessing = false;
        this.sending = false;
        this.error = Array.isArray(res.message)
          ? res.message[0]
          : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
      }
    } catch (e) {
      this.isProcessing = false;
      this.sending = false;
      this.error = Array.isArray(e.message) ? e.message[0] : e.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
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
