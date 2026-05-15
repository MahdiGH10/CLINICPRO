import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserContextService } from '../../core/services/user-context.service';
import { getRoleDefinition } from '../../core/config/role.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly userContext = inject(UserContextService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  readonly roleDefinition = computed(() =>
    getRoleDefinition(this.currentUser().role)
  );

  readonly visibleNavItems = computed(() => this.roleDefinition()?.nav ?? []);

  readonly workspaceTitle = computed(
    () => this.roleDefinition()?.workspaceTitle ?? 'ClinicPRO'
  );

  readonly roleLabel = computed(() => this.roleDefinition()?.label ?? '');

  logout(): void {
    this.userContext.reset();
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
