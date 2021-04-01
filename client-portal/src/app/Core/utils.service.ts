import { Injectable } from '@angular/core';
import { ToasterService } from 'angular2-toaster';
import { constants } from './constants'


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public constants = constants

  constructor(
    public toasterService: ToasterService
  ) { }

  public enableLoading = false;

  showMessage(type, subject, msg) {
    return this.toasterService.popAsync(type, subject, msg)
  }
}
