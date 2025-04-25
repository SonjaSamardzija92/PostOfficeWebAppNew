import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransformService {

    constructor() { }

    public transformData(data: any): Observable<any[]>  {
        const keys = Object.keys(data);
        const length = data[keys[0]].length;

        const transformedData = Array.from({ length }, (_, i) => {
            const entry: any = {};
            for (const key of keys) {
                entry[key] = data[key][i];
            }
            return entry;
        });

        return of(transformedData)
    }


}