import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

const BASE_URL = environment.apiBaseUrl;

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  async request<T>(endpoint: string, init: RequestInit, responseType: 'json' | 'text' = 'json'): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, init);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (responseType === 'text' ? response.text() : response.json()) as Promise<T>;
  }

  async get<T>(endpoint: string, responseType: 'json' | 'text' = 'json'): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, responseType);
  }

  async post<T>(endpoint: string, body: any, responseType: 'json' | 'text' = 'json'): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, responseType);
  }

  async put<T>(endpoint: string, body: any, responseType: 'json' | 'text' = 'json'): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }, responseType);
  }

  async delete<T>(endpoint: string, responseType: 'json' | 'text' = 'json'): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }, responseType);
  }
}
