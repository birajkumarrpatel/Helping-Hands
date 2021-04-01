import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component'
import { SearchProfessionalComponent } from './Dashboard/search-professional/search-professional.component'
import { HomeComponent } from './Dashboard/home/home.component'
import { RegistrationComponent } from './Auth/registration/registration.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { MyProfileComponent } from './Dashboard/my-profile/my-profile.component';
import { ViewJobComponent } from './Dashboard/view-job/view-job.component';
import { ScheduledWorkComponent } from './Dashboard/work/scheduled-work/scheduled-work.component';
import { ReviewRequiredComponent } from './Dashboard/work/review-required/review-required.component';
import { CompletedMeetingsComponent } from './Dashboard/work/completed-meetings/completed-meetings.component';



const routes: Routes = [
  {
    path: '', component: SearchProfessionalComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegistrationComponent
  },
  {
    path: 'forgot-password', component: ForgotPasswordComponent
  },
  {
    path: 'search', component: SearchProfessionalComponent
  },
  {
    path: 'my-profile', component: MyProfileComponent
  },
  {
    path: 'job/:jobId', component: ViewJobComponent
  },
  {
    path: 'work', component: HomeComponent, children: [
      { path: '', redirectTo: 'scheduled-work', pathMatch: 'full' },
      { path: 'scheduled-work', component: ScheduledWorkComponent, pathMatch: 'full' },
      { path: 'review-requiring', component: ReviewRequiredComponent, pathMatch: 'full' },
      { path: 'completed', component: CompletedMeetingsComponent, pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
