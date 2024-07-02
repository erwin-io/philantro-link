import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes }   from '@angular/router';

import { AppComponent } from './app.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material/material.module';
import { CommonModule } from '@angular/common';
import { FeaturesComponent } from './pages/features/features.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthComponent } from './auth/auth.component';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { AppConfigService } from './services/app-config.service';
import { AlertDialogComponent } from './shared/alert-dialog/alert-dialog.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { CustomHttpInterceptor } from './interceptors/custom-http.interceptors';
import { OptionSheetComponent } from './shared/option-sheet/option-sheet.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter } from './shared/utility/app-date-adapter';
import { NotificationWindowComponent } from './shared/notification-window/notification-window.component';
import { TimeagoClock, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { Observable, interval } from 'rxjs';
import { ImageUploadDialogComponent } from './shared/image-upload-dialog/image-upload-dialog.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { WebcamModule } from 'ngx-webcam';
import { ImageViewerDialogComponent } from './shared/image-viewer-dialog/image-viewer-dialog.component';
import { SelectUserDialogComponent } from './shared/select-user-dialog/select-user-dialog.component';
import { FlexLayoutModule } from '@angular/flex-layout';
export class MyClock extends TimeagoClock {
  tick(then: number): Observable<number> {
    return interval(1000);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    FeaturesComponent,
    ProfileComponent,
    AuthComponent,
    AlertDialogComponent,
    PageNotFoundComponent,
    OptionSheetComponent,
    NoAccessComponent,
    NotificationWindowComponent,
    ImageUploadDialogComponent,
    ImageViewerDialogComponent,
    SelectUserDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule,
    ReactiveFormsModule,
    ImageCropperModule,
    WebcamModule,
    FlexLayoutModule,
    TimeagoModule.forRoot({
      formatter: {provide: TimeagoClock, useClass: MyClock },
    })
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500} },
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [AppConfigService],
      useFactory : (config : AppConfigService) =>  () => config.loadAppConfig()
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    },
    {provide: DateAdapter, useClass: AppDateAdapter},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
