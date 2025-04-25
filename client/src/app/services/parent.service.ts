import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PostOfficeInfo } from '../components/model';

@Injectable({ providedIn: 'root' })
export class ParentService {

    constructor() { }

    public getData(): Observable<any> {
        const data1: any = {
            'jan' : [1, 2, 3, 4, 5],
            'feb': [6, 7, 8, 9, 10],
            'mart': [11, 12, 13, 14, 15]
          }
       
        return of(data1);
    }

    
}