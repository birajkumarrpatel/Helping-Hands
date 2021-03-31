import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component'
import { SearchProfessionalComponent } from './Dashboard/search-professional/search-professional.component'
import { HomeComponent } from './Dashboard/home/home.component'
import { RegistrationComponent } from './Auth/registration/registration.component';
import { ForgotPasswordComponent } from './Auth/forgot-password/forgot-password.component';
import { MyProfileComponent } from './Dashboard/my-profile/my-profile.component';
import { UpcomingJobsComponent } from './Dashboard/upcoming-jobs/upcoming-jobs.component';
import { CompletedJobsComponent } from './Dashboard/completed-jobs/completed-jobs.component';



const routes: Routes = [
  {
    path: '', component: HomeComponent
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
    path: 'upcoming', component: UpcomingJobsComponent
  },
  {
    path: 'completed', component: CompletedJobsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
