import { Injectable } from '@angular/core';
import { Loan } from '../models/model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private apiLoanUrl = '/api/loans';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Loan[]> {
    return this.http.get<Loan[]>(this.apiLoanUrl);
  }

  getByUserId(id: number): Observable<Loan | undefined> {
    return this.getAll().pipe(map((loans) => loans.find((l) => l.id_utilisateur === id)));
  }
}
