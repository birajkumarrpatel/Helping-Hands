import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';

@Component({
  selector: 'app-upcoming-jobs',
  templateUrl: './upcoming-jobs.component.html',
  styleUrls: ['./upcoming-jobs.component.css']
})
export class UpcomingJobsComponent implements OnInit {

  public isUpcomingDataFound: Boolean = false;
  public worksList

  constructor(
    private generalService: GeneralService,
    private utilService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.utilService.enableLoading = true;
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    this.generalService.postAPICall('fetch_upcoming_data', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      if (response && response.data && response.data.length > 0) {
        this.isUpcomingDataFound = true;
        this.worksList = response.data
      } else {
        this.isUpcomingDataFound = false;
        this.worksList = []
      }
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  markAsCompleted(workId) {
    this.utilService.enableLoading = true;
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    requestBody['meeting_id'] = workId
    this.generalService.postAPICall('complete_meeting', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      this.loadData()
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    }) 
  }

}
