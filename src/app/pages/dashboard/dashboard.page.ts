import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(
      private router: Router,
      private authService: AuthService,
  //    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }


  logout(): void {
    console.log("function logout dashbouard.page .ts ");
    this.authService.signOut();
  }

}
