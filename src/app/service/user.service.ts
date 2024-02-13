import {Injectable} from '@angular/core';
import { v4 } from 'uuid'
import {User} from "../model/user";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userAccounts : User[] = [];
  private loggedInUser$: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);

  loggedInUser(): BehaviorSubject<User> {
    return this.loggedInUser$;
  }

  createUserAccount(username: string, password: string): void {
    const id = v4();

    this.userAccounts.push({id, username, password});

    // Set a redundant copy in session storage so we don't lose the data on a refresh
    sessionStorage.setItem(username, password);
  }

  findUserAccount(toFind: User): User | null {
    const found = this
        .userAccounts
        .find(u => u.username === toFind.username && u.password === toFind.password);

    if (found) {
      return found;
    }

    // check session storage
    const localPassword = sessionStorage.getItem(toFind.username);
    if (localPassword && localPassword === toFind.password) {
      return {
        username: toFind.username,
        password: localPassword,
      }
    }

    return null;
  }

  setLoggedInUser(user: User): void {
    this.loggedInUser$.next(user);
    sessionStorage.setItem('username', user.username);
  }
}
