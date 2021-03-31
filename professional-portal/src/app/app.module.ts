import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterModule, ToasterService } from 'angular2-toaster'
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading'
import { HttpClientModule } from '@angular/common/http';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

// Material UI Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { FlexLayoutModule } from '@angular/flex-layout';



import { GeneralService } from './Core/general.service';
import { UtilsService } from './Core/utils.service';


import { LoginComponent } from './Auth/login/login.component';
import { RegistrationComponent } from './Auth/registration/registration.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { SearchProfessionalComponent } from './Dashboard/search-professional/search-professional.component';
import { HomeComponent } from './Dashboard/home/home.component';
import { MyProfileComponent } from './Dashboard/my-profile/my-profile.component';
import { UpcomingJobsComponent } from './Dashboard/upcoming-jobs/upcoming-jobs.component';
import { CompletedJobsComponent } from './Dashboard/completed-jobs/completed-jobs.component';
import { NewMeetingsComponent } from './Dashboard/new-meetings/new-meetings.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ForgotPasswordComponent,
    SearchProfessionalComponent,
    HomeComponent,
    MyProfileComponent,
    UpcomingJobsComponent,
    CompletedJobsComponent,
    NewMeetingsComponent
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
      primaryColour: '#0bb5af'
    }),
    HttpClientModule,
    MatFormFieldModule,
    MatTabsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatCarouselModule.forRoot(),
    NzButtonModule,
    NzEmptyModule,
    FlexLayoutModule
  ],
  exports: [MatInputModule],
  providers: [ToasterService, UtilsService, GeneralService],
  bootstrap: [AppComponent]
})
export class AppModule { }
