import {Component} from '@angular/core';
import {UserService} from "../service/user.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../service/authentication.service";
import {v4} from "uuid";
import {Session} from "../model/session";
import {SessionService} from "../service/session.service";
import CookieUtil from "../util/cookie-util";

@Component({
    selector: 'app-login-screen',
    templateUrl: './login-screen.component.html',
    styleUrl: './login-screen.component.css'
})
export class LoginScreenComponent {
    hidePassword = true;
    username = '';
    password = '';
    loginFailed = false;

    constructor(private userService: UserService,
                private authService: AuthenticationService,
                private sessionService: SessionService,
                private router: Router) {
    }

    login(): void {
        this.loginFailed = false;

        const user = this.userService.findUserAccount({
            username: this.username,
            password: this.password,
        });

        // If user does not exist that means they haven't created their Account yet. Fail the login.
        if (!user) {
            this.loginFailed = true;
            return;
        }

        this.userService.setLoggedInUser(user);

        // Create session and store cookie
        const id = v4();
        const session: Session = {id, username: this.username, createTimestamp: new Date().toUTCString()};
        this.sessionService.createSession(session);

        CookieUtil.createCookie(id);
        this.authService.setIsAuthenticated(true);
        this.router.navigate(['/dashboard']);
    }

    get isDisabled(): boolean {
        return this.username === '' ||
            this.username === undefined ||
            this.password === '' ||
            this.password === undefined;
    }
}

