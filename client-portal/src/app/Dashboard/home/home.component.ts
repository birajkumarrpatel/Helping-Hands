import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public selectedTab;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('selectedItem')) {
      this.selectedTab = Number(sessionStorage.getItem('selectedItem'))
    } else {
      this.selectedTab = 0
    }
  }

  onTabChange(event) {
    this.selectedTab = event.index
    sessionStorage.setItem('selectedItem', event.index)
    if (event.index === 0) {
      this.redirectTo('/work/scheduled-work')
    }
    if (event.index === 2) {
      this.redirectTo('/work/completed')
    }
    if (event.index === 1) {
      this.redirectTo('/work/review-requiring')
    }
  }

  redirectTo(path) {
    this.router.navigate([path])
  }

}
