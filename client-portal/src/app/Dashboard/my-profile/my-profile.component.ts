import { Component, OnInit } from '@angular/core';
import { UrlSerializer } from '@angular/router';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  public user = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  public formData = new FormData()

  public myProfile = {
    picture: 'https://res.cloudinary.com/djploevtk/image/upload/v1615911106/qv1xintykmucsbsjlbs3.png',
    name: '',
    email: '',
    mobile_number: '',
    address: ''
  }

  passwordError = null

  constructor(
    private generalService: GeneralService,
    private utilService: UtilsService
  ) { }

  ngOnInit(): void {
    this.loadProfile()
  }

  loadProfile() {
    this.utilService.enableLoading = true;
    this.generalService.getAPICall('my_profile').subscribe((response) => {
      this.utilService.enableLoading = false;
      this.myProfile.picture = response.data.profile_picture
      this.myProfile.name = response.data.name
      this.myProfile.email = response.data.email
      this.myProfile.mobile_number = response.data.mobile_number
      this.myProfile.address = response.data.address
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  changePassword() {
    if (!this.user.currentPassword || this.user.currentPassword === '') {
      this.passwordError = 'Please enter current password'
      return true
    }
    if (!this.user.newPassword || this.user.newPassword === '') {
      this.passwordError = 'Please enter new password'
      return true
    }
    if (!this.user.confirmPassword || this.user.confirmPassword === '') {
      this.passwordError = 'Please enter confirm password'
      return true
    }
    if (this.user.newPassword !== this.user.confirmPassword) {
      this.passwordError = 'New password and confirm password are not matching!'
      return true
    }
    this.passwordError = null
    this.utilService.enableLoading = true;

    const registrationBody = Object.assign({}, this.user)
    delete registrationBody.confirmPassword
    registrationBody['_id'] = window.sessionStorage.getItem('_id')

    this.user.newPassword = ''
    this.user.confirmPassword = ''
    this.user.currentPassword = ''

    this.generalService.postAPICall('change_password', registrationBody).subscribe((response: any) => {
      this.utilService.enableLoading = false;
      this.utilService.showMessage('success', 'Success', response.message || 'You are registered successfully')
    }, (error: any) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }
  changeProfile() {
    if (!this.myProfile.name) {
      this.utilService.showMessage('error', 'Error', 'Please enter valid name')
      return true
    }

    const registrationBody = {
      name: this.myProfile.name,
      user_type: this.utilService.constants.user_type,
      _id: window.sessionStorage.getItem('_id'),
      mobile_number: this.myProfile.mobile_number,
      address: this.myProfile.address
    }
    this.generalService.postAPICall('update_profile', registrationBody).subscribe((response: any) => {
      this.utilService.enableLoading = false;
      this.utilService.showMessage('success', 'Success', response.message || 'Profile Update successfully')
    }, (error: any) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  uploadProfilePicture(file) {
    if (!file) { return true }
    this.utilService.enableLoading = true;
    this.formData.set('file', file[0], file.name);

    this.generalService.postAPICall('change_profile_picture', this.formData).subscribe((response) => {
      this.formData.delete('file')
      this.myProfile.picture = response.data
      this.utilService.enableLoading = false;
      this.loadProfile()
    }, (error) => {
      this.formData.delete('file')
      this.utilService.enableLoading = false;
    })
  }

}
