import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(
    private http: HttpClient
  ) { }

  generateLink(host, url, port) {
    return `${host}:${port}${url}`
  }

  setHeaderWithToken() {
    const token = sessionStorage.getItem('token') || ""
    const userCode = sessionStorage.getItem('_id') || ""
    const sF = sessionStorage.getItem('sF') || ""
    let header = new HttpHeaders();
    header = header.set('Authorisation', 'Bearer ' + token)
    header = header.set('user_code', userCode)
    header = header.set('sF', sF)
    return { headers: header }
  }

  postAPICall(baseLinkKey, body) {
    const link = this.generateLink(environment.host, environment[baseLinkKey], environment.port)
    return this.http.post(link, body, this.setHeaderWithToken()).pipe(map(res => {
      return Object(res);
    }))
  }
  
  getAPICall(baseLinkKey) {
    const link = this.generateLink(environment.host, environment[baseLinkKey], environment.port)
    return this.http.get(link, this.setHeaderWithToken()).pipe(map(res => {
      return Object(res);
    }))
  }
}
