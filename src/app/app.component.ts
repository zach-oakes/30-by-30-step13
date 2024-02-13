import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "./service/authentication.service";
import {BehaviorSubject} from "rxjs";
import {SessionService} from "./service/session.service";
import CookieUtil from "./util/cookie-util";
import {UserService} from "./service/user.service";
import {User} from "./model/user";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
    title = 'Flight Tracker';
    isAuthenticated$: BehaviorSubject<boolean>;

    constructor(
        private router: Router,
        private authService: AuthenticationService,
        private sessionService: SessionService,
        private userService: UserService) {

        this.isAuthenticated$ = authService.getIsAuthenticated();
        this.isAuthenticated$.subscribe();
    }

    logout(): void {
        const id = CookieUtil.getIdFromCookie();

        if (id !== '') {
            // wipe the cookie and the kill the session
            CookieUtil.wipeCookie();
            this.sessionService.deleteSession(id);
        }

        this.authService.setIsAuthenticated(false);
        sessionStorage.setItem('username', '');
        this.userService.setLoggedInUser({} as User);

        this.router.navigate(['/login'])
            .then(() => {
                location.reload();
            });
    }
}
