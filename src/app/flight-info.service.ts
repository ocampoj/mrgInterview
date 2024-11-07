import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { FlightInfoPayload } from './models/FlightInfoPayload';

@Injectable({
  providedIn: 'root'
})
export class FlightInfoService {
  private apiUrl = 'https://us-central1-crm-sdk.cloudfunctions.net/flightInfoChallenge';

  constructor(private http: HttpClient) {}

  submitFlightInfo(payload: FlightInfoPayload): Observable<boolean> {
    const headers = new HttpHeaders({
      token: 'WW91IG11c3QgYmUgdGhlIGN1cmlvdXMgdHlwZS4gIEJyaW5nIHRoaXMgdXAgYXQgdGhlIGludGVydmlldyBmb3IgYm9udXMgcG9pbnRzICEh',
      candidate: 'Juan Ocampo Padilla'
    });

    return this.http.post<boolean>(this.apiUrl, payload, { headers }).pipe(
      map((response: boolean) => {
        console.log(response, 'response')
        // Handle valid true/false response directly since I believe the endpoint just returns true or false
        if (response === true) {
          console.log(response, 'Submission successful');
          return true;
        } else if (response === false) {
          console.warn('Submission failed as per server response');
          return false;
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Unexpected response format');
        }
      }),
      catchError(error => {
        console.log(error, 'error')
        console.error('Error submitting flight information:', error.message);
        return throwError(() => new Error(error.message || 'Server error occurred. Please try again.'));
      })
    );
  }
}
