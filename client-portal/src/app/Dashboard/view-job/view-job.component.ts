import {
  Component, OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/Core/general.service';
import { UtilsService } from 'src/app/Core/utils.service';
import * as moment from 'moment'

import { NgForm } from "@angular/forms"
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service'


@Component({
  selector: 'app-view-job',
  templateUrl: './view-job.component.html',
  styleUrls: ['./view-job.component.css']
})
export class ViewJobComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;

  public jobData
  public isLoggedIn: Boolean = false;
  public todaysDate = new Date()
  public selectedDate
  public bookMeetingClicked = false
  public stripe;
  public loading = false;
  public confirmation;
  public card: any;
  public cardHandler = this.onChange.bind(this);
  public error: string;
  public range: FormGroup

  constructor(
    private generalService: GeneralService,
    private utilService: UtilsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService
  ) { }

  ngOnInit(): void {

    this.range = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    })

    const loggedInFlag = window.sessionStorage.getItem('isLoggedIn')
    if (loggedInFlag && loggedInFlag === 'true') this.isLoggedIn = true

    const jobId = this.activatedRoute.snapshot.params['jobId']
    if (!jobId) {
      this.router.navigate(['/search'])
    }
    this.loadSingleJobData(jobId)
  }

  loadSingleJobData(jobId) {
    this.utilService.enableLoading = true;
    const requestBody = {}
    if (this.isLoggedIn) requestBody['_id'] = window.sessionStorage.getItem('_id')
    requestBody['work_id'] = jobId

    this.generalService.postAPICall('get_work_details', requestBody).subscribe((response) => {
      this.utilService.enableLoading = false;
      this.jobData = response.data
      if (!this.jobData) {
        this.utilService.showMessage('info', 'Info', 'Requested work is not available now. Please try again later')
        this.router.navigate(['/search'])
      }
    }, (error) => {
      this.utilService.enableLoading = false;
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  addToFav(jobId) {
    const requestBody = {}
    requestBody['_id'] = window.sessionStorage.getItem('_id')
    requestBody['work_id'] = jobId
    this.generalService.postAPICall('add_job_to_fav', requestBody).subscribe((response) => {
      this.jobData.is_fav = !this.jobData.is_fav
    }, (error) => {
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  bookMeeting() {
    this.bookMeetingClicked = true
  }

  processPaymentApiCall(data) {
    this.generalService.postAPICall('process_payment', data).subscribe((response) => {
      this.utilService.showMessage('success', 'Success', 'Meeting booked successfully')
      sessionStorage.setItem('selectedItem', '0')
      this.router.navigate(['/work/scheduled-work'])
    }, (error) => {
      let msg = 'Something went wrong'
      if (error && error.error && error.error.message) msg = error.error.message
      this.utilService.showMessage('error', 'Error', msg)
    })
  }

  ngAfterViewInit() {
    this.stripeService.setPublishableKey('pk_test_51IVLTOGi4s1Bmw9r321gEVn0BxpjgWNkNIj8r8EAyY2lyW5stxJ0gWeTa2oUWieOoBMsqmH72ZFmQe87GcigVCyA00jy7G4BJP').then(
      stripe => {
        this.stripe = stripe;
        const elements = stripe.elements();
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
      });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    if (!this.isLoggedIn) {
      this.utilService.showMessage('info', 'Info', 'To book a meeting, please login with your credentials.')
      this.router.navigate(['/login'])
      return true;
    }
    if (!this.selectedDate) {
      this.utilService.showMessage('error', 'Error', 'Please select date for service')
      return true
    }
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      this.utilService.showMessage('error', 'Error', 'Something went wrong while capturing payment')
      return true;
    }
    const json = {
      currency: 'usd',
      source: token.id,
      amount: Number(this.jobData.price) * 100,
      work_id: this.jobData._id,
      user: sessionStorage.getItem('_id'),
      selected_date: moment(this.selectedDate).startOf('day')
    }
    this.processPaymentApiCall(json)
  }
}
