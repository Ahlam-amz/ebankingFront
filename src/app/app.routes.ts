import { Routes } from '@angular/router';
import { AgentWorkspaceComponent } from './modules/clients/agent-workspace/agent-workspace.component';
import { ClientListComponent } from './modules/clients/client-list/client-list.component';
import { ClientDetailsComponent } from './modules/clients/client-details/client-details.component';
import { ClientEnrollementForm } from './modules/clients/client-enrollement-form/client-enrollement-form.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { TransactionFormComponent } from './modules/transactions/components/transaction-form/transaction-form.component';
import { TransactionListComponent } from './modules/transactions/components/transaction-list/transaction-list.component';
import { TransactionDetailsComponent } from './modules/transactions/components/transaction-details/transaction-details.component';
import { StandingOrderFormComponent } from './modules/transactions/components/standing-order-form/standing-order-form.component';
import { TransactionTypeSelectorComponent } from './modules/transactions/pages/transaction-type-selector/transaction-type-selector.component';
import { LoginComponent } from './modules/auth/login/login.component';
import { RoleListComponent } from './components/role-list/role-list.component';
import { CurrencyListComponent } from './components/currency-list/currency-list.component';
import { CurrencyFormComponent } from './components/currency-form/currency-form.component';
import { ExchangeRatesComponent } from './components/exchange-rates/exchange-rates.component';
import { AgencyListComponent } from './components/agency-list/agency-list.component';
import { AgencyFormComponent } from './components/agency-form/agency-form.component';
import { AgencyDetailsComponent } from './components/agency-details/agency-details.component';
import { AuditLogListComponent } from './components/audit-log-list/audit-log-list.component';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { RoleFormComponent } from './components/role-form/role-form.component';
import { RoleDetailComponent } from './components/role-detail/role-detail.component';
import { PermissionDetailComponent } from './components/permission-detail/permission-detail.component';
import { PermissionFormComponent } from './components/permission-form/permission-form.component';
import { PermissionListComponent } from './components/permission-list/permission-list.component';
import { AdminWorkComponent } from './components/adminwork/adminwork.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
export const routes: Routes = [




{
    path: 'transactions',
    children: [
      {
        path: '',
        component: TransactionListComponent,
        title: 'Transactions'
      },
      {
        path: 'new',
        component: TransactionTypeSelectorComponent,
        title: 'New Transaction'
      },
      {
      path: 'new/:type',
      component: TransactionFormComponent,
      title: 'New Transaction'
      },

      {
        path: 'standing-order',
        component: StandingOrderFormComponent,
        title: 'Create Standing Order'
      },

      {
        path: ':id',
        component: TransactionDetailsComponent,
        title: 'Transaction Details'
      }
    ]
  },



  


  // Workspace (main agent interface)
  {
    path: 'workspace',
    component: AgentWorkspaceComponent
  },

  // Clients management
  {
    path: 'clients',
    children: [
      { path: 'all', component: ClientListComponent },
      { path: 'enroll', component: ClientEnrollementForm },
      { path: ':id', component: ClientDetailsComponent }
    ]
  },

  // Dashboard (analytics view)
  {
    path: 'dashboard',
    component: DashboardComponent
  },

  //work admin
  {
    path: 'adminwork',
    component: AdminWorkComponent
  },

  { path: 'login', component: LoginComponent },
  
  //{ path: '', redirectTo: '/login', pathMatch: 'full' },
  //{ path: '**', redirectTo: '/login' },

  // Fallback route (404 handling)
  

  //---------------ilhams routes---------------------


  //{ path: '', redirectTo: '/currencies', pathMatch: 'full' },
  
  // Routes pour les devises
  { path: 'currencies', component: CurrencyListComponent },
  { path: 'currencies/create', component: CurrencyFormComponent },
  { path: 'currencies/edit/:id', component: CurrencyFormComponent },
  
  // Routes pour les taux de change
  { path: 'exchange-rates', component: ExchangeRatesComponent },
  
  // Routes pour les agences
  { path: 'agencies', component: AgencyListComponent },
  { path: 'agencies/create', component: AgencyFormComponent },
  { path: 'agencies/edit/:id', component: AgencyFormComponent },
  { path: 'agencies/:id', component: AgencyDetailsComponent },
  
  // Routes pour le journal d'audit
  { path: 'audit-logs', component: AuditLogListComponent },
  
  // Routes pour les utilisateurs
  { path: 'users', component: UserListComponent },
  { path: 'users/create', component: UserFormComponent },
  { path: 'users/edit/:id', component: UserFormComponent },
  { path: 'users/:id', component: UserDetailComponent },
  
  // Routes pour les rôles
  { path: 'roles', component: RoleListComponent },
  { path: 'roles/create', component: RoleFormComponent },
  { path: 'roles/edit/:id', component: RoleFormComponent },
  { path: 'roles/:id', component: RoleDetailComponent },
  
  // Routes pour les permissions
  { path: 'permissions', component: PermissionListComponent },
  { path: 'permissions/create', component: PermissionFormComponent },
  { path: 'permissions/edit/:id', component: PermissionFormComponent },
  { path: 'permissions/:id', component: PermissionDetailComponent },
  { path: 'chatbot', component: ChatbotComponent },


  { 
    path: '**',
    redirectTo: 'login' 
  },
  
  // Default route (redirects to workspace)
  { 
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  
  // Route par défaut
  //{ path: '**', redirectTo: '/currencies' }
];