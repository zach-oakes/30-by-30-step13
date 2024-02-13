import {Component} from '@angular/core';
import {UserService} from "../service/user.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  username: string | null = '';
  constructor(private userService: UserService) {
    this.userService.loggedInUser().subscribe(u => {
      this.username = u.username ?? sessionStorage.getItem('username');
    });
  }
}
