# Email OTP Migration Plan

**Status:** In Progress
**Created:** 2024-12-19
**Priority:** High

## Context & Problem

The Lexa Chrome extension currently uses Supabase magic link authentication, but this approach has critical issues:

1. **Chrome blocks direct navigation** to `chrome-extension://` URLs from external domains (like Supabase's auth domain)
2. **Gmail link handling** causes additional complications with magic link clicks
3. **User experience** is poor - users get "ERR_BLOCKED_BY_CLIENT" errors when clicking magic links
4. **Reliability issues** across different email clients and browsers

## Solution: Email OTP with 6-Digit Codes

We're migrating to Supabase's built-in Email OTP system using 6-digit codes with:

- **1-hour TTL** for OTP codes (security)
- **Long-lived sessions** once authenticated (convenience)
- **Simple UX** familiar to users from other apps

## Alternatives Considered & Rejected

### 1. Web-Based Landing Page ❌

- **Approach:** Redirect magic links to a web page that communicates with extension
- **Why rejected:** Requires hosting external domain, adds complexity, still has potential reliability issues

### 2. Manual Token Entry ❌

- **Approach:** Users manually copy/paste tokens from magic link URLs
- **Why rejected:** Poor UX, error-prone, confusing for users

### 3. Custom URL Scheme ❌

- **Approach:** Use `lexa://auth/callback` URLs
- **Why rejected:** Requires OS-level registration, platform-specific implementation

### 4. Phone SMS OTP ❌

- **Approach:** Use Supabase SMS OTP instead of email
- **Why rejected:** Requires phone numbers, SMS costs, not all users have phones

## Implementation Plan

### Phase 1: Supabase Configuration

- [ ] **1.1** Enable Email OTP in Supabase Dashboard
  - [ ] Go to Authentication → Settings → Auth Providers
  - [ ] Ensure "Email" provider is enabled
  - [ ] Configure OTP expiry to 3600 seconds (1 hour)
- [ ] **1.2** Update JWT Settings for Long Sessions
  - [ ] Set JWT expiry to 30 days (2592000 seconds)
  - [ ] Enable refresh token rotation
  - [ ] Configure refresh token reuse interval
- [ ] **1.3** Customize Email Template
  - [ ] Update OTP email template for Lexa branding
  - [ ] Add clear instructions for Chrome extension usage
  - [ ] Test email delivery across providers

### Phase 2: Frontend Implementation

- [ ] **2.1** Update Auth Queries (`src/queries/auth.ts`)
  - [ ] Replace `useSignInWithOtp` with email OTP version
  - [ ] Add `useSignInWithEmailOtp` hook
  - [ ] Add `useVerifyEmailOtp` hook
  - [ ] Keep existing session management unchanged
- [ ] **2.2** Update Login Flow (`src/components/LoginForm.tsx`)
  - [ ] Implement two-step process (email → code)
  - [ ] Add loading states and error handling
  - [ ] Add "resend code" functionality
- [ ] **2.3** Create OTP Input Component
  - [ ] Build 6-digit code input component
  - [ ] Implement auto-focus and auto-advance
  - [ ] Add paste functionality
  - [ ] Show countdown timer for expiry
  - [ ] Add resend button with rate limiting
- [ ] **2.4** Remove Magic Link Dependencies
  - [ ] Delete `src/pages/auth/confirm.tsx`
  - [ ] Delete `src/pages/auth/manual-token.tsx`
  - [ ] Update routing configuration
  - [ ] Remove magic link references

### Phase 3: Extension-Specific Updates

- [ ] **3.1** Clean Up External Messaging
  - [ ] Remove `externally_connectable` from manifest.json
  - [ ] Remove external message handlers from background.ts
  - [ ] Delete `public/extension-callback.html`
  - [ ] Remove `AuthCallbackMessage` type and handlers
- [ ] **3.2** Verify Storage Strategy
  - [ ] Test Chrome storage adapter with long sessions
  - [ ] Verify session persistence across browser restarts
  - [ ] Test token refresh in background script

### Phase 4: UX & Error Handling

- [ ] **4.1** Email Validation
  - [ ] Add proper email validation before OTP send
  - [ ] Show clear feedback when OTP is sent
  - [ ] Handle email provider delays
- [ ] **4.2** Error Handling
  - [ ] Handle expired codes gracefully
  - [ ] Clear error messages for invalid codes
  - [ ] Rate limiting feedback
  - [ ] Network error handling
- [ ] **4.3** Accessibility
  - [ ] Add ARIA labels for OTP inputs
  - [ ] Implement keyboard navigation
  - [ ] Add screen reader announcements

### Phase 5: Testing & Validation

- [ ] **5.1** Cross-Platform Testing
  - [ ] Test with Gmail, Outlook, Yahoo, etc.
  - [ ] Test session persistence across extension updates
  - [ ] Test offline/online scenarios
- [ ] **5.2** Security Testing
  - [ ] Verify OTP expiry works correctly
  - [ ] Test rate limiting
  - [ ] Validate session security
- [ ] **5.3** User Experience Testing
  - [ ] Test complete auth flow end-to-end
  - [ ] Verify error states and recovery
  - [ ] Test resend functionality

### Phase 6: Cleanup & Documentation

- [ ] **6.1** Code Cleanup
  - [ ] Remove all magic link related code
  - [ ] Clean up unused imports and types
  - [ ] Update comments and documentation
- [ ] **6.2** Update Documentation
  - [ ] Update README with new auth flow
  - [ ] Document OTP configuration
  - [ ] Add troubleshooting guide

## Key Implementation Details

### Supabase API Calls

```javascript
// Send OTP
await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    shouldCreateUser: true,
  },
})

// Verify OTP
await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email',
})
```

### Session Configuration

- **JWT Expiry:** 30 days (long-lived)
- **OTP Expiry:** 1 hour (security)
- **Refresh Tokens:** Enabled with rotation
- **Storage:** Chrome sync storage for persistence

## Success Criteria

- [ ] Users can authenticate using only email + 6-digit code
- [ ] No more Chrome extension URL blocking errors
- [ ] Sessions persist across browser restarts
- [ ] Authentication works across all major email providers
- [ ] Error handling provides clear user guidance
- [ ] Code is clean and maintainable

## Rollback Plan

If issues arise, we can temporarily revert to magic links by:

1. Reverting auth query changes
2. Re-enabling magic link UI components
3. Restoring external messaging handlers

## Notes for Future Agents

- **Current Extension ID:** `bmfjgljapphpbkkaokbkmegbhojeaapo`
- **Supabase Project:** `dyixdtizbgzfiybcwoto`
- **Key Files to Modify:**
  - `src/queries/auth.ts` (main auth logic)
  - `src/components/LoginForm.tsx` (UI)
  - `manifest.json` (cleanup)
  - `src/background.ts` (cleanup)
- **Testing Email:** Use `jonathankrone@gmail.com` for development
- **Current Status:** Planning complete, ready for implementation
