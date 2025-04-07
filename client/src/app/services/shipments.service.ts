import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Shipment, ShipmentFilters } from '../components/model';

@Injectable({ providedIn: 'root' })
export class ShipmentService {
    private readonly apiUrl = `${environment.apiUrl}/shipments`;

    constructor(public http: HttpClient) { }

    public createShipment(data: Shipment): Observable<any> {
        return this.http.post<Shipment>(this.apiUrl, data);
    }

    public getShipments(filters?: ShipmentFilters): Observable<Shipment[]> {
        let params = new HttpParams();
        if (filters) {
            params = this.setFilters(params, filters);
        }
        return this.http.get<Shipment[]>(this.apiUrl, { params });
    }

    public deleteShipment(shipmentNumber: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${shipmentNumber}`);
    }

    public getShipmentByID(shipmentNumber: string): Observable<Shipment> {
        return this.http.get<Shipment>(`${this.apiUrl}/${shipmentNumber}`);
    }

    public updateShipment(
        id: string,
        shipment: Partial<Shipment>,
    ): Observable<Shipment> {
        return this.http.put<Shipment>(`${this.apiUrl}/${id}`, shipment);
    }

    private setFilters(params: HttpParams, filters: ShipmentFilters): HttpParams {
        const filterKeys: (keyof ShipmentFilters)[] = [
            'status',
            'weightCategory',
            'originZipCode',
            'destinationZipCode',
            'shipmentNumber',
        ];

        filterKeys.forEach((key) => {
            if (filters[key]) {
                params = params.set(key, filters[key]);
            }
        });

        return params;
    }
}