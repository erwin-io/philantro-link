import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { AppConfigService } from 'src/app/services/app-config.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/model/users';
import { AccessPages } from 'src/app/model/access.model';
import { ApiResponse } from 'src/app/model/api-response.model';
import { MapBoxComponent } from 'src/app/shared/map-box/map-box.component';
import { TransactionsService } from 'src/app/services/transactions.service';
import { Transactions } from 'src/app/model/transactions.model';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-transactions-details',
  templateUrl: './transactions-details.component.html',
  styleUrls: ['./transactions-details.component.scss'],
  host: {
    class: "page-component transactions"
  }
})
export class TransactionsDetailsComponent {
  currentUserProfile:Users;
  transactionCode;
  isNew = false;
  isReadOnly = true;
  error;
  isLoading = true;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;
  canAddEdit = false;

  transaction: Transactions;

  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  constructor(
    private transactionsService: TransactionsService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    this.currentUserProfile = this.storageService.getLoginProfile();
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.transactionCode = this.route.snapshot.paramMap.get('transactionCode');
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
    } else {
      this.canAddEdit = true;
      this.isLoading = false;
    }
  }

  initDetails() {
    this.isLoading = true;
    try {
      this.loaderService.show();
      this.transactionsService.getByCode(this.transactionCode).subscribe(res=> {
        this.loaderService.hide();
        if (res.success) {
          this.transaction = res.data;
          this.isLoading = false;
        } else {
          this.isLoading = false;
          this.error = Array.isArray(res.message) ? res.message[0] : res.message;
          this.snackBar.open(this.error, 'close', {
            panelClass: ['style-error'],
          });
          this.router.navigate(['/transactions/']);
        }
      });
    } catch(ex) {
      this.loaderService.hide();
      this.error = Array.isArray(ex.message) ? ex.message[0] : ex.message;
      this.snackBar.open(this.error, 'close', {
        panelClass: ['style-error'],
      });
      this.router.navigate(['/transactions/']);
      this.isLoading = false;
    }
  }
}
