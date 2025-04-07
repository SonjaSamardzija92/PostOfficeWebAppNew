import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PostOfficeInfo } from '../components/model';

@Injectable({ providedIn: 'root' })
export class PostOfficeService {
    private readonly apiUrl = `${environment.apiUrl}/post-offices`;

    constructor(public http: HttpClient) { }

    public createNewPostOffice(psInfo: PostOfficeInfo): Observable<any> {
        return this.http.post<PostOfficeInfo>(this.apiUrl, psInfo);
    }

    public getPostOffices(zipCode?: string): Observable<PostOfficeInfo[]> {
        let params = new HttpParams();
        if (zipCode) {
            params = params.set('zipCode', zipCode);
        }
        return this.http.get<PostOfficeInfo[]>(this.apiUrl, { params });
    }

    public deletePostOffice(zipCode: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${zipCode}`);
    }

    public updatePostOffice(
        id: string,
        postOffice: Partial<PostOfficeInfo>,
      ): Observable<PostOfficeInfo> {
        return this.http.put<PostOfficeInfo>(`${this.apiUrl}/${id}`, postOffice);
      }

      public getPostOfficeByZipCode(zipCode: string): Observable<PostOfficeInfo> {
        return this.http.get<PostOfficeInfo>(`${this.apiUrl}/${zipCode}`);
    }
}