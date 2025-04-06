import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthInfo } from '../components/model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly apiUrl = `${environment.apiUrl}/auth`;

    constructor(public http: HttpClient) { }

    public login(payload: AuthInfo): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, payload);
    }

    public registration(payload: AuthInfo): Observable<AuthInfo> {
        return this.http.post<AuthInfo>(`${this.apiUrl}/registration`, payload);
    }
}