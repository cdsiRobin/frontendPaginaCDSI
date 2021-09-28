import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OtherService} from './other.service';

@Injectable({
  providedIn: 'root'
})
export class ArfaccService {

  constructor(
    private http: HttpClient,
    private url: OtherService
  ) { }

}
