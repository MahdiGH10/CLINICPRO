import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  password: string;
  dateNaissance: string;
  tel: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  role: UserRole;
  message: string;
}

export type UserRole = 'PATIENT' | 'MEDECIN' | 'ADMIN';

export interface CurrentUser {
  email: string | null;
  role: UserRole | null;
}

export interface MeResponse {
  email: string;
  role: UserRole;
  idPatient: number | null;
  idMedecin: number | null;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userSignal = signal<CurrentUser>(this.getStoredUser());

  token = this.tokenSignal.asReadonly();
  currentUser = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.tokenSignal());

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token) {
      this.tokenSignal.set(token);
    }
    if (user.email) {
      this.userSignal.set(user);
    }
  }

  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private getStoredUser(): CurrentUser {
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : { email: null, role: null };
    } catch {
      return { email: null, role: null };
    }
  }

  private persistSession(response: LoginResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(
      this.USER_KEY,
      JSON.stringify({
        email: response.email,
        role: response.role
      })
    );

    this.tokenSignal.set(response.token);
    this.userSignal.set({
      email: response.email,
      role: response.role
    });
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.apiBaseUrl}/auth/login`,
          credentials
        )
      );

      this.persistSession(response);
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  getMe() {
    return this.http.get<MeResponse>(`${environment.apiBaseUrl}/auth/me`);
  }

  async register(data: RegisterRequest): Promise<LoginResponse> {
    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(
          `${environment.apiBaseUrl}/auth/register`,
          data
        )
      );

      this.persistSession(response);
      return response;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.tokenSignal.set(null);
    this.userSignal.set({ email: null, role: null });
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  hasRole(roles: string | string[]): boolean {
    const userRole = this.userSignal().role;
    if (!userRole) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(userRole);
  }
}
