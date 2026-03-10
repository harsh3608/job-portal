import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, CurrentUser } from '../models/auth.models';

const USER_KEY = 'jp_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private readonly apiUrl = `${environment.apiBaseUrl}/auth/api/auth`;

    private _currentUser = signal<CurrentUser | null>(this.loadUser());
    currentUser = this._currentUser.asReadonly();
    isAuthenticated = computed(() => !!this._currentUser());

    register(request: RegisterRequest) {
        return this.http.post<{ userId: number; message: string }>(`${this.apiUrl}/register`, request);
    }

    login(request: LoginRequest) {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
            tap(response => this.storeUser(response))
        );
    }

    logout() {
        localStorage.removeItem(USER_KEY);
        this._currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    getToken(): string | null {
        return this._currentUser()?.token ?? null;
    }

    private storeUser(response: AuthResponse): void {
        localStorage.setItem(USER_KEY, JSON.stringify(response));
        this._currentUser.set(response);
    }

    private loadUser(): CurrentUser | null {
        try {
            const stored = localStorage.getItem(USER_KEY);
            if (!stored) return null;
            const user: CurrentUser = JSON.parse(stored);
            if (new Date(user.expiresAt) <= new Date()) {
                localStorage.removeItem(USER_KEY);
                return null;
            }
            return user;
        } catch {
            return null;
        }
    }
}
