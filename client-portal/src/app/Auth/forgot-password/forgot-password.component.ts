import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public user = {
    email: ''
  }

  constructor(
    private router: Router,
    private utilService: UtilsService,
    private generalService: GeneralService
  ) { }

  ngOnInit(): void {
  }

  forgotPassword() {
    const validEmail = this.validateEmail(this.user.email)
    if (!validEmail) {
      this.utilService.showMessage('error', 'Error', 'Please enter a valid email')
      return true;
    }

    const registrationBody = Object.assign({}, this.user)
    registrationBody['user_type'] = this.utilService.constants.user_type

    this.generalService.postAPICall('forgot_password', registrationBody).subscribe((response: any) => {
      this.utilService.enableLoading = false;
      this.utilService.showMessage('success', 'Success', response.message || 'Please check your inbox.')
      this.user.email = ''
      this.router.navigate(['/login'])
    }, (error: any) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  validateEmail(email) {
    if (!email) return false
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  redirectUser(link) {
    this.router.navigate([link])
  }
}
