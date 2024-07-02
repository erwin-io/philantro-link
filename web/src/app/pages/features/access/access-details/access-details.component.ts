import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Access, AccessPages } from 'src/app/model/access.model';
import { AppConfigService } from 'src/app/services/app-config.service';
import { AccessService } from 'src/app/services/access.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertDialogModel } from 'src/app/shared/alert-dialog/alert-dialog-model';
import { AlertDialogComponent } from 'src/app/shared/alert-dialog/alert-dialog.component';
import { MyErrorStateMatcher } from 'src/app/shared/form-validation/error-state.matcher';
import { AccessFormComponent } from '../access-form/access-form.component';
import { MatTableDataSource } from '@angular/material/table';
import { AccessPagesTableComponent } from 'src/app/shared/access-pages-table/access-pages-table.component';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-access-details',
  templateUrl: './access-details.component.html',
  styleUrls: ['./access-details.component.scss'],
  host: {
    class: "page-component"
  }
})
export class AccessDetailsComponent {
  code;
  isNew = false;
  // pageAccess: Access = {
  //   view: true,
  //   modify: false,
  // };

  isReadOnly = true;

  error;
  isLoading = false;

  mediaWatcher: Subscription;
  matcher = new MyErrorStateMatcher();
  isProcessing = false;
  isLoadingRoles = false;

  @ViewChild('accessForm', { static: true}) accessForm: AccessFormComponent;
  @ViewChild('accessPagesTable', { static: true}) accessPagesTable: AccessPagesTableComponent;


  pageAccess: AccessPages = {
    view: true,
    modify: false,
  } as any;

  constructor(
    private accessService: AccessService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private appconfig: AppConfigService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder
  ) {
    const { isNew, edit } = this.route.snapshot.data;
    this.isNew = isNew;
    this.code = this.route.snapshot.paramMap.get('accessCode');
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
    // for(var right of this.pageAccess.rights) {
    //   rights[right] = this.pageAccess.modify;
    // }
    return rights;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.initDetails();
  }

  accessGridChange(event) {
    this.accessForm.form.controls["accessPages"].setValue(event);
    this.accessForm.form.markAllAsTouched();
    this.accessForm.form.markAsDirty();
  }

  initDetails() {
    this.loaderService.show();
    this.accessService.getByCode(this.code).subscribe(res=> {
      this.loaderService.hide();
      if (res.success) {
        this.accessForm.setFormValue(res.data);
        if(res.data.accessPages) {
          this.accessPagesTable.setDataSource(res.data.accessPages);
        }

        if (this.isReadOnly) {
          this.accessForm.form.disable();
        }
        if(!this.pageAccess.modify ) {
          this.router.navigate(['/acess/' + this.code]);
        }
      } else {
        this.error = Array.isArray(res.message) ? res.message[0] : res.message;
        this.snackBar.open(this.error, 'close', {
          panelClass: ['style-error'],
        });
      }
    });
  }
  compareFn(accessPages1: AccessPages, accessPages2: AccessPages) {
    return accessPages1 && accessPages2 ? accessPages1.page.toUpperCase() === accessPages1.page.toUpperCase() : accessPages1 === accessPages2;
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    return pass === confirmPass ? null : { notMatched: true };
  };

  onDelete() {
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Delete Access?';
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
        let res = await this.accessService.delete(this.code).toPromise();
        this.loaderService.hide();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/access/']);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
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

  onUpdate(formData) {
    formData = {
      ...formData,
      ...this.accessPagesTable.accessPagesData
    }
    const dialogData = new AlertDialogModel();
    dialogData.title = 'Confirm';
    dialogData.message = 'Update Access?';
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
        let res = await this.accessService.update(this.code, formData).toPromise();
        this.loaderService.hide();
        if (res.success) {
          this.snackBar.open('Saved!', 'close', {
            panelClass: ['style-success'],
          });
          this.router.navigate(['/access/' + res.data.accessCode]);
          this.isProcessing = false;
          dialogRef.componentInstance.isProcessing = this.isProcessing;
          dialogRef.close();
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
}
