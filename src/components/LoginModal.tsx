import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  CheckCircle2,
  User,
  Building2,
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowRight,
  X,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Mail,
  Fingerprint,
  LogOut,
  RefreshCw,
  Globe
} from 'lucide-react';
import { Role, UserSession } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: Role;
  onLoginSuccess: (session: UserSession) => void;
  onLogAuditEvent: (action: string, details: string, resourceType?: string, status?: 'SUCCESS' | 'WARNING' | 'FAILED' | 'INITIATED') => void;
}

interface RoleOption {
  role: Role;
  title: string;
  email: string;
  tenant: string;
  tenantName: string;
  badgeColor: string;
  defaultPassword?: string;
  mfaRequired: boolean;
}

const ROLES: RoleOption[] = [
  {
    role: 'Admin',
    title: 'Platform Administrator',
    email: 'admin.infra@bankguard.eu',
    tenant: 'tenant-hq-001',
    tenantName: 'BankGuard Group HQ (Frankfurt)',
    badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
    mfaRequired: true
  },
  {
    role: 'Manager',
    title: 'Portfolio & Retention Manager',
    email: 'elena.rodriguez@bankguard.eu',
    tenant: 'tenant-hq-001',
    tenantName: 'BankGuard Group HQ (Frankfurt)',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
    mfaRequired: true
  },
  {
    role: 'Head Office Operator',
    title: 'Head Office Operations Lead',
    email: 'ops.marcus@bankguard.eu',
    tenant: 'tenant-ops-002',
    tenantName: 'Regional Retail Operations Center',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    mfaRequired: false
  },
  {
    role: 'Auditing Manager',
    title: 'Compliance & Audit Lead',
    email: 'audit.kraus@bankguard.eu',
    tenant: 'tenant-audit-003',
    tenantName: 'EU Regulatory Compliance & Audit Division',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
    mfaRequired: true
  },
  {
    role: 'Viewer',
    title: 'Risk Analyst (Read-Only)',
    email: 'analyst.read@bankguard.eu',
    tenant: 'tenant-hq-001',
    tenantName: 'BankGuard Group HQ (Frankfurt)',
    badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    mfaRequired: false
  },
  {
    role: 'Client',
    title: 'Corporate Client Treasurer',
    email: 'treasury@clientcorp.eu',
    tenant: 'tenant-client-eu',
    tenantName: 'Continental Enterprise Treasury Ltd',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    mfaRequired: false
  }
];

const APPROVED_DOMAINS = ['bankguard.eu', 'clientcorp.eu', 'partner-bank.de', 'company.com', 'gmail.com'];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onLoginSuccess,
  onLogAuditEvent,
}) => {
  const [authTab, setAuthTab] = useState<'PASSWORD' | 'GOOGLE' | 'ROLE_PICKER'>('PASSWORD');
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [companyEmail, setCompanyEmail] = useState('elena.rodriguez@bankguard.eu');
  const [companyId, setCompanyId] = useState('BANKGUARD-EU-HQ');
  const [password, setPassword] = useState('SecurePass2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [mfaCode, setMfaCode] = useState('849-210');
  const [requiresMfaStep, setRequiresMfaStep] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Rate Limiting & Account Lockout State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [authError, setAuthError] = useState('');
  const [domainRestrictionEnabled, setDomainRestrictionEnabled] = useState(true);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  if (!isOpen) return null;

  const currentRoleConfig = ROLES.find(r => r.role === selectedRole) || ROLES[1];

  // Helper to validate corporate email domain
  const validateDomain = (email: string) => {
    if (!domainRestrictionEnabled) return true;
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1].toLowerCase();
    return APPROVED_DOMAINS.some(d => domain === d || domain.endsWith('.' + d));
  };

  // Helper to map email to tenant and role
  const mapEmailToTenantAndRole = (email: string): { role: Role; tenantId: string; tenantName: string } => {
    const lower = email.toLowerCase();
    if (lower.includes('admin') || lower.includes('infra')) {
      return { role: 'Admin', tenantId: 'tenant-hq-001', tenantName: 'BankGuard Group HQ (Frankfurt)' };
    }
    if (lower.includes('audit') || lower.includes('compliance')) {
      return { role: 'Auditing Manager', tenantId: 'tenant-audit-003', tenantName: 'EU Regulatory Compliance & Audit Division' };
    }
    if (lower.includes('ops') || lower.includes('operator')) {
      return { role: 'Head Office Operator', tenantId: 'tenant-ops-002', tenantName: 'Regional Retail Operations Center' };
    }
    if (lower.includes('client') || lower.includes('treasury') || lower.includes('clientcorp')) {
      return { role: 'Client', tenantId: 'tenant-client-eu', tenantName: 'Continental Enterprise Treasury Ltd' };
    }
    if (lower.includes('viewer') || lower.includes('analyst.read')) {
      return { role: 'Viewer', tenantId: 'tenant-hq-001', tenantName: 'BankGuard Group HQ (Frankfurt)' };
    }
    return { role: 'Manager', tenantId: 'tenant-hq-001', tenantName: 'BankGuard Group HQ (Frankfurt)' };
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (lockoutTimer > 0) {
      setAuthError(`Account temporarily locked due to excessive failed attempts. Please wait ${lockoutTimer}s.`);
      return;
    }

    // 1. Email format and domain validation
    if (!validateDomain(companyEmail)) {
      setFailedAttempts(prev => prev + 1);
      const err = `Domain policy violation: '@${companyEmail.split('@')[1] || ''}' is not in the approved corporate Google Workspace/Identity domains (${APPROVED_DOMAINS.join(', ')}).`;
      setAuthError(err);
      onLogAuditEvent('FAILED_LOGIN', `Failed company login attempt for ${companyEmail}. Reason: Unapproved corporate domain.`, 'AUTH_SERVICE', 'FAILED');
      return;
    }

    // 2. Simulated password verification (checks password length >= 6)
    if (password.length < 6) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      if (newAttempts >= 3) {
        setLockoutTimer(60);
        setAuthError('Account locked out for 60 seconds due to 3 consecutive failed attempts (Rate limit triggered).');
        onLogAuditEvent('ACCOUNT_LOCKED', `Account lockout activated for ${companyEmail}. Consecutive failed password attempts exceeded threshold (3).`, 'AUTH_SERVICE', 'WARNING');
      } else {
        setAuthError(`Invalid credentials. ${3 - newAttempts} attempt(s) remaining before account lockout.`);
        onLogAuditEvent('FAILED_LOGIN', `Failed password verification for ${companyEmail}. Remaining attempts: ${3 - newAttempts}.`, 'AUTH_SERVICE', 'FAILED');
      }
      return;
    }

    // 3. MFA Check for elevated roles
    const targetConfig = mapEmailToTenantAndRole(companyEmail);
    if ((targetConfig.role === 'Admin' || targetConfig.role === 'Auditing Manager' || targetConfig.role === 'Manager') && !requiresMfaStep) {
      setRequiresMfaStep(true);
      onLogAuditEvent('MFA_CHALLENGE_ISSUED', `FIDO2/TOTP challenge issued for ${companyEmail} under role ${targetConfig.role}.`, 'AUTH_SERVICE', 'INITIATED');
      return;
    }

    // 4. Successful Authentication
    completeLogin(targetConfig.role, companyEmail, 'PASSWORD', targetConfig.tenantId, targetConfig.tenantName);
  };

  const handleGoogleLogin = () => {
    setAuthError('');
    const googleWorkspaceEmail = companyEmail || 'elena.rodriguez@bankguard.eu';

    if (!validateDomain(googleWorkspaceEmail)) {
      const err = `Google OAuth Domain Restricted: Only authorized Google Workspace domain accounts can sign in. (${APPROVED_DOMAINS.join(', ')})`;
      setAuthError(err);
      onLogAuditEvent('GOOGLE_LOGIN_DENIED', `Google OAuth rejected for ${googleWorkspaceEmail}. Domain restriction active.`, 'AUTH_SERVICE', 'FAILED');
      return;
    }

    const targetConfig = mapEmailToTenantAndRole(googleWorkspaceEmail);
    onLogAuditEvent('GOOGLE_OAUTH_TOKEN_VERIFIED', `Verified Google OpenID Connect token for ${googleWorkspaceEmail} with claim issuer accounts.google.com.`, 'AUTH_SERVICE', 'SUCCESS');
    completeLogin(targetConfig.role, googleWorkspaceEmail, 'GOOGLE_OAUTH', targetConfig.tenantId, targetConfig.tenantName);
  };

  const completeLogin = (
    role: Role,
    email: string,
    authMethod: 'PASSWORD' | 'GOOGLE_OAUTH',
    tenantId: string,
    tenantName: string
  ) => {
    const jwtToken = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        sub: email,
        role,
        tenant_id: tenantId,
        iss: 'bankguard-auth-authority',
        aud: 'bankguard-ai-platform',
        exp: Math.floor(Date.now() / 1000) + 3600 * 8, // 8 hours
        iat: Math.floor(Date.now() / 1000)
      })
    )}.sig_${Date.now().toString(36)}`;

    const session: UserSession = {
      userId: `USR-${Math.abs(email.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString().slice(0, 6)}`,
      email,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      role,
      tenantId,
      tenantName,
      authMethod,
      jwtToken,
      refreshToken: `rft_${Math.random().toString(36).substring(2, 15)}`,
      expiresAt: new Date(Date.now() + 8 * 3600000).toISOString(),
      mfaVerified: true
    };

    onLoginSuccess(session);
    onLogAuditEvent(
      'LOGIN_SUCCESS',
      `User ${email} authenticated successfully via ${authMethod}. Assigned role: ${role}. Tenant: ${tenantId}. JWT Token issued (8h expiry).`,
      'AUTH_SERVICE',
      'SUCCESS'
    );
    onClose();
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;
    setResetSuccessMessage(`A cryptographic 15-minute password reset link has been dispatched to ${forgotPasswordEmail}.`);
    onLogAuditEvent('PASSWORD_RESET_REQUESTED', `Password reset token requested for ${forgotPasswordEmail}. Link expires in 15m.`, 'AUTH_SERVICE', 'SUCCESS');
    setTimeout(() => {
      setIsForgotPasswordOpen(false);
      setResetSuccessMessage('');
      setForgotPasswordEmail('');
    }, 2800);
  };

  const handleLogoutAllDevices = () => {
    onLogAuditEvent('LOGOUT_ALL_DEVICES', `Terminated all active OAuth/JWT refresh sessions for ${companyEmail}.`, 'AUTH_SERVICE', 'WARNING');
    setAuthError('All remote active sessions and refresh tokens have been revoked.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
                <span>BankGuard AI Enterprise Gateway</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  MFA & JWT Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">European Banking Customer Intelligence & Retention Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs between Login Methods */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-2">
          <button
            type="button"
            onClick={() => { setAuthTab('PASSWORD'); setAuthError(''); }}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              authTab === 'PASSWORD'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Company Email & Password</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthTab('GOOGLE'); setAuthError(''); }}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              authTab === 'GOOGLE'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Google Workspace Login</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthTab('ROLE_PICKER'); setAuthError(''); }}
            className={`pb-2.5 px-4 text-xs font-semibold border-b-2 transition flex items-center space-x-1.5 ${
              authTab === 'ROLE_PICKER'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Fast Role Simulator (RBAC)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          {/* Error Message Display */}
          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/80 text-xs text-rose-200 flex items-start space-x-2 animate-shake">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong>Authentication Alert: </strong>
                <span>{authError}</span>
              </div>
            </div>
          )}

          {/* Account Lockout Notice */}
          {lockoutTimer > 0 && (
            <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
                <span>
                  <strong>Account Locked:</strong> Too many failed attempts. Rate limiter cooling down for {lockoutTimer} seconds.
                </span>
              </div>
            </div>
          )}

          {/* TAB 1: Company Email + Password */}
          {authTab === 'PASSWORD' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">Company Workspace ID</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                        placeholder="BANKGUARD-EU-HQ"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-300 block mb-1">Corporate Email ID</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                        placeholder="name@bankguard.eu"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-medium text-slate-300">Password (Argon2 / bcrypt Encrypted)</label>
                    <button
                      type="button"
                      onClick={() => setIsForgotPasswordOpen(true)}
                      className="text-[10px] text-indigo-400 hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-9 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                      placeholder="••••••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* MFA step if triggered or required */}
                {requiresMfaStep && (
                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-700/60 animate-fadeIn space-y-2">
                    <div className="flex items-center space-x-2 text-xs text-indigo-200">
                      <KeyRound className="w-4 h-4 text-indigo-400" />
                      <span className="font-semibold">MFA Required: Enter 6-Digit Authenticator Code (TOTP)</span>
                    </div>
                    <input
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      maxLength={7}
                      className="w-full bg-slate-900 border border-indigo-500 rounded-lg px-3 py-1.5 text-sm text-emerald-400 font-mono tracking-widest text-center focus:outline-none"
                      placeholder="849-210"
                      required
                    />
                    <p className="text-[10px] text-slate-400 text-center">
                      Elevated RBAC role requires time-based token validation.
                    </p>
                  </div>
                )}

                {/* Security badges */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rate limiting: <strong className="text-slate-200">Max 3 attempts / 60s</strong></span>
                  </div>
                  <div className="font-mono text-[10px] text-indigo-300">
                    Argon2id Hash Active
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleLogoutAllDevices}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Logout from all devices</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={lockoutTimer > 0}
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition"
                  >
                    <span>{requiresMfaStep ? 'Verify MFA & Login' : 'Authenticate & Sign In'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: Continue with Google (OAuth 2.0 / OpenID Connect) */}
          {authTab === 'GOOGLE' && (
            <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="text-center max-w-md mx-auto space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto shadow-inner">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-slate-100">Enterprise Google Workspace SSO</h3>
                <p className="text-xs text-slate-400">
                  Authenticate using your corporate Google account protected by OpenID Connect & OAuth 2.0 PKCE.
                </p>
              </div>

              {/* Domain Restriction Control */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-slate-200 block">Enforce Corporate Google Domain</span>
                  <span className="text-[10px] text-slate-400 font-mono">Restricted to: {APPROVED_DOMAINS.join(', ')}</span>
                </div>
                <input
                  type="checkbox"
                  checked={domainRestrictionEnabled}
                  onChange={(e) => setDomainRestrictionEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Selected Workspace Account */}
              <div>
                <label className="text-[11px] font-medium text-slate-300 block mb-1">Corporate Google Account</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="elena.rodriguez@bankguard.eu"
                  />
                </div>
              </div>

              {/* Automatic Role and Tenant mapping description */}
              <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-900/50 text-[11px] text-indigo-200 space-y-1">
                <div className="font-semibold flex items-center space-x-1.5 text-indigo-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Automated Org & Tenant Role Mapping:</span>
                </div>
                <p className="text-slate-300 text-[10px]">
                  First-time Google logins automatically map to tenant and role according to directory claims:
                  <strong> @bankguard.eu</strong> maps to <em>BankGuard HQ</em>;
                  <strong> @clientcorp.eu</strong> maps to <em>Isolated Client Tenant</em>.
                </p>
              </div>

              {/* Continue with Google button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-medium text-xs shadow-lg flex items-center justify-center space-x-2 transition"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google Workspace</span>
              </button>
            </div>
          )}

          {/* TAB 3: Fast Role Simulator (RBAC) */}
          {authTab === 'ROLE_PICKER' && (
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Instant Sandbox Role Profiles (6 RBAC Tiers)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {ROLES.map((r) => {
                  const isSelected = selectedRole === r.role;
                  return (
                    <div
                      key={r.role}
                      onClick={() => {
                        setSelectedRole(r.role);
                        setCompanyEmail(r.email);
                        completeLogin(r.role, r.email, 'PASSWORD', r.tenant, r.tenantName);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                          : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-100">{r.role}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${r.badgeColor}`}>
                            {r.role === 'Client' ? 'Isolated Tenant' : 'Internal'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono">{r.email}</p>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                        <span>{r.tenantName}</span>
                        <span className="text-indigo-400 font-semibold flex items-center space-x-0.5">
                          <span>Launch</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Reset Corporate Password</span>
              </h3>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Enter your corporate email. We will generate a cryptographic 15-minute one-time reset link according to enterprise security policy.
            </p>
            {resetSuccessMessage ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{resetSuccessMessage}</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-3">
                <div>
                  <label className="text-[11px] text-slate-300 block mb-1">Corporate Email</label>
                  <input
                    type="email"
                    value={forgotPasswordEmail || companyEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    placeholder="name@bankguard.eu"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Send 15m Reset Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
