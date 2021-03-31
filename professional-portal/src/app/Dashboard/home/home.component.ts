import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public selectedTab: Number = 0;
  public isUpcomingDataFound: Boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const loggedInFlag = window.sessionStorage.getItem('isLoggedIn')
    if (!loggedInFlag || loggedInFlag === 'false') {
      this.router.navigate(['/login'])
    }
  }

  onTabChange(event) {
    this.selectedTab = event.index
  }

}
