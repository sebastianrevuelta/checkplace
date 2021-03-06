import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { API_URL } from '../app.constants';

@Injectable({
  providedIn: 'root'
})
export class BasicAuthenticationCredentialsService {

  constructor(public http:HttpClient) { }

  executeBasicAuthentication(username: string, password: string) {
    let basicAuthHeaderString = 'Basic ' + window.btoa(username + ":" + password)

    let header = new HttpHeaders({
      Authorization: basicAuthHeaderString
    })

    return this.http.get<AuthenticationBean>(`${API_URL}/basicauth`,
    {headers: header}).pipe(
      map(
        data => {
          sessionStorage.setItem('username',username);
          sessionStorage.setItem('token',basicAuthHeaderString);
          return data;
        }
      )
    )
  }

  executeJWTAuthentication(username: string, password: string) {
   console.log('username: ' + username);
   return this.http.post<any>(`${API_URL}/authenticate`,
   {username,password}).pipe(
      map(
        data => {
          sessionStorage.setItem('username',username);
          sessionStorage.setItem('token',`Bearer ${data.token}`);
          console.log(`token: ${data.token}`);
          return data;
        }
      )
    )
  }

  executeHardcodeAuthentication(username: string, password: string) {
    if (username === 'sebas' && password==='sebas') { 
      sessionStorage.setItem('username',username)
      return true;
    }
    return false;
  }

  getUserLogged() {
    return sessionStorage.getItem('username');
  }

  getUserToken() {
    if (this.getUserLogged())
      return sessionStorage.getItem('token');
    return null;
  }

  isUserLoggedIn() {
     let user = sessionStorage.getItem('username')
     return !(user === null)
  }

  logout() {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('token');
  }
}

export class AuthenticationBean {
   constructor(public message:string) {}
}