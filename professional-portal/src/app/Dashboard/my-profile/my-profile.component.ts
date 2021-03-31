import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';
import csc from 'country-state-city'


@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit, OnDestroy {

  selectedTab = 0

  public user = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }

  public URL;

  public formData = new FormData()

  public myProfile = {
    picture: 'https://res.cloudinary.com/djploevtk/image/upload/v1615911106/qv1xintykmucsbsjlbs3.png',
    name: '',
    email: '',
    mobile_number: '',
    experience: null
  }

  maxFileToUpload = 3

  public profession = {
    title: '',
    description: '',
    work_image: [],
    price: null,
    location: {
      country: '',
      state: '',
      city: ''
    }
  }

  isSearchActive = false;

  passwordError = null
  uploadedWorkImages = []

  constructor(
    private generalService: GeneralService,
    private utilService: UtilsService,
    private cdr: ChangeDetectorRef
  ) { }

  countries = []
  states = []
  cities = []
  worksList = []
  searchString = ''

  ngOnInit(): void {
    const country = csc.getCountryByCode('CA')
    this.countries = [country]
    this.loadProfile()
    this.loadWorkProfile()
    if (window.sessionStorage.getItem('activeTab')) {
      this.selectedTab = Number(window.sessionStorage.getItem('activeTab'))
    }
  }

  ngOnDestroy() {
    window.sessionStorage.removeItem('activeTab')
  }


  addUpdateProfession() {
    if (this.profession.title === '' || !this.profession.title) {
      this.utilService.showMessage('error', 'Error', 'Please enter title')
      return true
    } else if (this.profession.description === '' || !this.profession.description) {
      this.utilService.showMessage('error', 'Error', 'Please enter description')
      return true
    } else if (this.profession.price === '' || !this.profession.price) {
      this.utilService.showMessage('error', 'Error', 'Please enter price')
      return true
    } else if (this.profession.work_image.length === 0) {
      this.utilService.showMessage('error', 'Error', 'Please upload at least one work image')
      return true
    } else if (this.profession.location.country === '') {
      this.utilService.showMessage('error', 'Error', 'Please select country location')
      return true
    } else if (this.profession.location.state === '') {
      this.utilService.showMessage('error', 'Error', 'Please select state location')
      return true
    } else if (this.profession.location.city === '') {
      this.utilService.showMessage('error', 'Error', 'Please select city location')
      return true
    }

    const requestBody = Object.assign({}, this.profession)
    requestBody['user_id'] = window.sessionStorage.getItem('_id')

    this.generalService.postAPICall('add_new_work', requestBody).subscribe((response: any) => {
      this.utilService.enableLoading = false;
      this.utilService.showMessage('success', 'Success', response.message || 'Work added successfully')
      this.worksList = [];
      this.loadProfile();
      this.loadWorkProfile();
      this.selectedTab = 1
      this.profession = {
        title: '',
        description: '',
        work_image: [],
        price: null,
        location: {
          country: '',
          state: '',
          city: ''
        }
      }
    }, (error: any) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  countrySelected(value) {
    this.profession.location.country = value
    this.states = csc.getStatesOfCountry(value)
    this.profession.location.state = ''
    this.profession.location.city = ''
  }

  stateSelected(value) {
    this.profession.location.state = value
    this.cities = csc.getCitiesOfState(this.profession.location.country, this.profession.location.state)
    this.profession.location.city = ''
  }

  citySelected(value) {
    this.profession.location.city = value
  }

  uploadWorkImage(file) {
    if (this.uploadedWorkImages.length + file.length > this.maxFileToUpload) {
      this.utilService.showMessage('error', 'Error', `You can not add more than ${this.maxFileToUpload} images`)
      return true
    }

    for (let elem of file) {
      this.formData.set('file', elem, file.name);
      this.generalService.postAPICall('upload_image', this.formData).subscribe((response: any) => {
        this.utilService.enableLoading = false;
        this.profession.work_image.push(response.data.url)
      }, (error: any) => {
        this.utilService.enableLoading = false;
        let msg = 'Something went wrong'
        if (error && error.error && error.error.message) msg = error.error.message
        this.utilService.showMessage('error', 'Error', msg)
      })
    }
  }

  loadProfile() {
    this.utilService.enableLoading = true;
    this.generalService.getAPICall('my_profile').subscribe((response) => {
      this.utilService.enableLoading = false;
      this.myProfile.picture = response.data.profile_picture
      this.myProfile.name = response.data.name
      this.myProfile.email = response.data.email
      this.myProfile.mobile_number = response.data.mobile_number
      this.myProfile.experience = response.data.experience
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  loadWorkProfile(searchStr: String = undefined) {
    this.utilService.enableLoading = true;
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    if(searchStr) requestBody['search_string'] = searchStr
    this.generalService.postAPICall('list_works', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      this.worksList = response.data
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
      mobile_number: this.myProfile.mobile_number,
      experience: this.myProfile.experience,
      user_type: this.utilService.constants.user_type,
      _id: window.sessionStorage.getItem('_id')
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

  onTabChange(event) {
    this.selectedTab = event.index
    window.sessionStorage.setItem('activeTab', (this.selectedTab).toString())
  }

  searchProfession() {
    this.isSearchActive = !this.isSearchActive
    this.loadWorkProfile(this.searchString)
  }

  clearSearch() {
    this.isSearchActive = !this.isSearchActive
    this.searchString = ''
    this.loadWorkProfile()
  }

  enableDisableJob(id, isDeleted) {
    // alert('this feature is under development ' +  id + ' ' + isDeleted)
    const requestPayload = {}
    requestPayload['_id'] = id
    requestPayload['is_deleted'] = !isDeleted
    this.generalService.postAPICall('update_work_status', requestPayload).subscribe((response: any) => {
      this.utilService.enableLoading = false;
      this.utilService.showMessage('success', 'Success', response.message || 'Profile Update successfully')
      this.loadWorkProfile()
    }, (error: any) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }
}
