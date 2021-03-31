import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';


@Component({
  selector: 'app-new-meetings',
  templateUrl: './new-meetings.component.html',
  styleUrls: ['./new-meetings.component.css']
})
export class NewMeetingsComponent implements OnInit {
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
    this.generalService.postAPICall('fetch_new_data', requestBody).subscribe((response) => {
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

  markAsCompleted(workId, action) {
    this.utilService.enableLoading = true;
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    requestBody['meeting_id'] = workId
    requestBody['action'] = action
    console.log('requestBody', requestBody)

    this.generalService.postAPICall('approve_meeting', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      this.loadData()
      if (action === 'reject') {
        this.utilService.showMessage('success', 'Success', 'Meeting rejected successfully')
      } else {
        this.utilService.showMessage('success', 'Success', 'Meeting accepted successfully')
      }
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

}
