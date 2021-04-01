import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterModule, ToasterService } from 'angular2-toaster'
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading'
import { HttpClientModule } from '@angular/common/http';

// Material UI Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

// Services
import { UtilsService } from './Core/utils.service';
import { GeneralService } from './Core/general.service';

// Components
import { LoginComponent } from './Auth/login/login.component';
import { RegistrationComponent } from './Auth/registration/registration.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { SearchProfessionalComponent } from './Dashboard/search-professional/search-professional.component';
import { HomeComponent } from './Dashboard/home/home.component';
import { MyProfileComponent } from './Dashboard/my-profile/my-profile.component';
import { ViewJobComponent } from './Dashboard/view-job/view-job.component';
import { ScheduledWorkComponent } from './Dashboard/work/scheduled-work/scheduled-work.component';
import { ReviewRequiredComponent } from './Dashboard/work/review-required/review-required.component';
import { CompletedMeetingsComponent } from './Dashboard/work/completed-meetings/completed-meetings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    SearchProfessionalComponent,
    HomeComponent,
    MyProfileComponent,
    ViewJobComponent,
    ScheduledWorkComponent,
    ReviewRequiredComponent,
    CompletedMeetingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatSidenavModule,
    ToasterModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: 'rgba(0,0,0,0.1)',
      primaryColour: '#1991b5'
    }),
    HttpClientModule,
    MatFormFieldModule,
    MatTabsModule,
    FlexLayoutModule,
    MatCarouselModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ],
  providers: [ToasterService, UtilsService, GeneralService],
  bootstrap: [AppComponent]
})
export class AppModule { }
