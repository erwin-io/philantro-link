import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { NavigationPageModule } from './navigation/navigation.module';
import { AppConfigService } from './services/app-config.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PageLoaderModule } from './shared/page-loader/page-loader.module';
import { TokenInterceptor } from './shared/interceptors/token.interceptors';
import { Device } from '@capacitor/device';
import { EventDetailsModule } from './shared/event-details/event-details.module';
import { DonateFormModule } from './shared/donate-form/donate-form.module';
import { EditEventFormModule } from './shared/edit-event-form/edit-event-form.module';
import { CreateEventFormModule } from './shared/create-event-form/create-event-form.module';
import { DatePickerModule } from './shared/date-picker/date-picker.module';
import { LocationPickerModule } from './shared/location-picker/location-picker.module';
import { EventTypePickerModule } from './shared/event-type-picker/event-type-picker.module';
import { EventThumbnailModule } from './shared/event-thumbnail/event-thumbnail.module';
import { EventNotificationsModule } from './shared/event-notifications/event-notifications.module';
import { ResetPasswordModule } from './shared/reset-password/reset-password.module';
import { HelpSupportModule } from './shared/help-support/help-support.module';
import { CreateSupportTicketModule } from './shared/create-support-ticket/create-support-ticket.module';
import { SupportTicketDetailsModule } from './shared/support-ticket-details/support-ticket-details.module';
import { DonationListModule } from './shared/donation-list/donation-list.module';
import { DonationDetailsModule } from './shared/donation-details/donation-details.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CommonModule,
    NavigationPageModule,
    HttpClientModule,
    PageLoaderModule,
    EventDetailsModule,
    CreateEventFormModule,
    EditEventFormModule,
    DonateFormModule,
    DatePickerModule,
    LocationPickerModule,
    EventTypePickerModule,
    EventThumbnailModule,
    EventNotificationsModule,
    ResetPasswordModule,
    HelpSupportModule,
    CreateSupportTicketModule,
    SupportTicketDetailsModule,
    DonationListModule,
    DonationDetailsModule,
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en_PH' },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide : APP_INITIALIZER,
      multi : true,
      deps : [AppConfigService],
      useFactory : (config: AppConfigService) =>  () => config.loadAppConfig()
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
