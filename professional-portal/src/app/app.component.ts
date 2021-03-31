import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToasterConfig } from 'angular2-toaster';
import { UtilsService } from './Core/utils.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'client-portal';

  dynamicIcon = 'login'
  dynamicTitle = 'Login'
  showSearchInput = false
  public innerWidth: any;

  search_professional_string = null
  public isMobileDevice = false;
  public toggleMenus = false;
  mySubscription: any;

  public config: ToasterConfig = new ToasterConfig({
    showCloseButton: false,
    tapToDismiss: true,
    timeout: 3000,
    limit: 3,
    positionClass: 'toast-bottom-right'
  });

  // Container Possion:
  // 'toast-top-full-width', 'toast-bottom-full-width', 'toast-center',
  // 'toast-top-left', 'toast-top-center', 'toast-top-right',
  // 'toast-bottom-left', 'toast-bottom-center', 'toast-bottom-right'

  constructor(
    public router: Router,
    public utilsService: UtilsService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      const isLoggedIn = window.sessionStorage.getItem('isLoggedIn')
      if (isLoggedIn && ['true', true].includes(isLoggedIn)) {
        this.dynamicIcon = 'account_circle'
        this.dynamicTitle = 'Profile'
      }
    });
  }

  ngOnInit() {
    const isLoggedIn = window.sessionStorage.getItem('isLoggedIn')
    if (isLoggedIn && ['true', true].includes(isLoggedIn)) {
      this.dynamicIcon = 'account_circle'
      this.dynamicTitle = 'Profile'
    }
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.isMobileDevice = true
      this.toggleMenus = false;
    }
    else {
      this.isMobileDevice = false
      this.toggleMenus = true;
    }
  }

  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  logMeOut() {
    window.sessionStorage.clear()
    this.dynamicIcon = 'login'
    this.dynamicTitle = 'Login'
    this.router.navigate(['/login'])
  }

  profileLoginClick() {
    if (this.dynamicIcon === 'account_circle') this.router.navigate(['/my-profile'])
    if (this.dynamicIcon !== 'account_circle') this.router.navigate(['/login'])
  }

  toggleSearchInput() {
    this.showSearchInput = !this.showSearchInput
    if (this.showSearchInput) this.toggleMenus = false;
  }

  toggleMenuItems() {
    if (this.isMobileDevice) {
      this.toggleMenus = !this.toggleMenus
    }
  }

  searchProfessional() {
    if (!this.search_professional_string) {
      this.toggleSearchInput()
      return;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth <= 768) {
      this.isMobileDevice = true
      this.toggleMenus = false;
    }
    else {
      this.isMobileDevice = false
      this.toggleMenus = true;
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login'])
  }

}
