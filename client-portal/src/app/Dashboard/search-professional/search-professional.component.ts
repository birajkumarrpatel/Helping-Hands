import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';


@Component({
  selector: 'app-search-professional',
  templateUrl: './search-professional.component.html',
  styleUrls: ['./search-professional.component.css']
})
export class SearchProfessionalComponent implements OnInit {

  public worksList = [];
  public searchString: String = '';
  public isLoggedIn: Boolean = false;

  constructor(
    private generalService: GeneralService,
    private utilService: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const loggedInFlag = window.sessionStorage.getItem('isLoggedIn')
    if (loggedInFlag && loggedInFlag === 'true') this.isLoggedIn = true
    this.loadWorkProfile()
  }

  loadWorkProfile(searchStr: String = undefined) {
    this.utilService.enableLoading = true;
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    if(searchStr) requestBody['search_string'] = searchStr
    this.generalService.postAPICall('load_works', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      this.worksList = response.data
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  searchJobs() {
    this.loadWorkProfile(this.searchString)
  }

  clearSearch() {
    this.searchString = '';
    this.loadWorkProfile();
  }

  addToFav(jobId, index) {
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    requestBody['work_id'] = jobId
    this.generalService.postAPICall('add_job_to_fav', requestBody).subscribe((response) => {
      this.worksList[index].is_fav = !this.worksList[index].is_fav
    }, (error) => {
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  viewJob(jobId) {
    this.router.navigate(['/job', jobId])
  }
}
