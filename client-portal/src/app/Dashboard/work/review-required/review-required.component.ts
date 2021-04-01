import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-review-required',
  templateUrl: './review-required.component.html',
  styleUrls: ['./review-required.component.css']
})
export class ReviewRequiredComponent implements OnInit {

  public isUpcomingDataFound: Boolean = false;
  public worksList

  constructor(
    private generalService: GeneralService,
    private utilService: UtilsService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadData()
  }

  loadData() {
    this.utilService.enableLoading = true;
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    requestBody['type'] = 'review_required'

    this.generalService.postAPICall('meetings_list', requestBody).subscribe((response) => {
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

  openReviewDialog(job): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '550px',
      data: job
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadData();
    });
  }

}


@Component({
  selector: 'review-dialog',
  templateUrl: 'review-dialog.html',
  styleUrls: ['./review-rating.css']
})
export class DialogOverviewExampleDialog {

  public rating = 1
  public inputName = 'Vipul'
  public incomingData
  public feedback = '';

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private generalService: GeneralService,
    private utilService: UtilsService) {
    this.incomingData = data
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(rating: number): void {
    this.rating = rating;
  }

  submitReview() {
    const requestBody = {
      _id: window.sessionStorage.getItem('_id'),
      meeting_id: this.incomingData._id,
      professional_id: this.incomingData.professional_id._id,
      work_id: this.incomingData.work_id._id,
      work_rate: this.rating
    }


    this.generalService.postAPICall('submit_review', requestBody).subscribe((response) => {
      this.utilService.showMessage('success', 'Success', 'Review Submitted Successfully')
      this.utilService.enableLoading = false;
      this.dialogRef.close();
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }
}