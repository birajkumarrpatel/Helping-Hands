import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';

@Component({
  selector: 'app-completed-jobs',
  templateUrl: './completed-jobs.component.html',
  styleUrls: ['./completed-jobs.component.css']
})
export class CompletedJobsComponent implements OnInit {

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
    this.generalService.postAPICall('fetch_completed_data', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      if (response && response.data && response.data.length > 0) {
        this.isUpcomingDataFound = true;
        this.worksList = response.data
      }
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  remindForReview(meetingId, userId) {
    this.utilService.enableLoading = true;
    const requestBody = {}
    requestBody['user'] = userId
    requestBody['meeting_id'] = meetingId

    this.generalService.postAPICall('remind_for_review', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      this.utilService.showMessage('success', 'Success', 'We have send email to client for completing the meeting.')
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }
}
