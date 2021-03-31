import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from '../../Core/utils.service'


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public user = {
    name: '',
    email: '',
    password: ''
  }

  constructor(
    private router: Router,
    private utilService: UtilsService,
    private generalService: GeneralService
  ) { }

  ngOnInit(): void {

  }

  redirectUser(path) {
    this.router.navigate([path])

  }


  registration() {
    const validEmail = this.validateEmail(this.user.email)
    if (!validEmail || !this.user.name || !this.user.password || this.user.password.length === 0) {
      this.utilService.showMessage('error', 'Error', 'Please enter a valid name, email and password')
      return true;
    }

    const registrationBody = Object.assign({}, this.user)
    registrationBody['user_type'] = this.utilService.constants.user_type

    this.generalService.postAPICall('register', registrationBody).subscribe((response: any) => {
      this.utilService.enableLoading = false;
      this.utilService.showMessage('success', 'Success', response.message || 'You are registered successfully')
      this.redirectUser('/login')
      this.user.name = ''
      this.user.email = ''
      this.user.password = ''
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

}
