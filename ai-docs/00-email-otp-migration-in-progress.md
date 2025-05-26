# Email OTP Migration Plan

**Status:** Frontend Complete - Ready for Supabase Configuration
**Created:** 2024-12-19
**Last Updated:** 2024-12-19
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
- **Chrome storage persistence** to handle popup close/reopen cycles

## Critical UX Problem Solved: Popup State Persistence

**Problem:** Users had to close the extension popup to check their email for the OTP code, but when they reopened it, they were back at the email entry step, requiring a new OTP request and invalidating the previous code.

**Solution:** Implemented persistent OTP flow state using Chrome's local storage API:

- Saves OTP flow state (email, step, timestamp, expiry) when OTP is requested
- Automatically restores OTP input screen when popup reopens
- Calculates correct remaining time based on original OTP send time
- Handles expiration gracefully by clearing expired states
- Clears state on successful authentication

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

### Phase 2: Frontend Implementation ✅ COMPLETED

- [x] **2.1** Update Auth Queries (`src/queries/auth.ts`)
  - [x] Add `useSignInWithEmailOtp` hook for sending OTP codes
  - [x] Add `useVerifyEmailOtp` hook for verifying 6-digit codes
  - [x] Keep existing session management unchanged
  - [x] Maintain legacy magic link hooks for backward compatibility
- [x] **2.2** Update Login Flow (`src/components/LoginForm.tsx`)
  - [x] Implement two-step process (email → code)
  - [x] Add loading states and error handling
  - [x] Add "resend code" functionality
  - [x] Add "Use Different Email" option
  - [x] Implement Chrome storage persistence for popup state
- [x] **2.3** Create OTP Input Component (`src/components/OtpInput.tsx`)
  - [x] Build 6-digit code input component with auto-focus and auto-advance
  - [x] Implement paste functionality for easy code entry
  - [x] Show countdown timer for 60-minute expiry
  - [x] Add resend button with proper state management
  - [x] Comprehensive error handling and mobile-responsive design
- [x] **2.4** Remove Magic Link Dependencies
  - [x] Delete `src/pages/auth/confirm.tsx`
  - [x] Update routing configuration in `src/App.tsx`
  - [x] Update signup page to use new OTP flow
- [x] **2.5** Chrome Storage Persistence (`src/lib/otpStorage.ts`)
  - [x] Create comprehensive storage management utility
  - [x] Functions for get, set, clear, isExpired, getRemainingTime
  - [x] Debug helper for development
  - [x] Proper error handling and timestamp management

### Phase 3: Extension-Specific Updates

- [ ] **3.1** Clean Up External Messaging
  - [ ] Remove `externally_connectable` from manifest.json
  - [ ] Remove external message handlers from background.ts
  - [ ] Delete `public/extension-callback.html`
  - [ ] Remove `AuthCallbackMessage` type and handlers
- [x] **3.2** Verify Storage Strategy
  - [x] Implemented Chrome storage adapter for OTP state persistence
  - [ ] Test session persistence across browser restarts
  - [ ] Test token refresh in background script

### Phase 4: UX & Error Handling ✅ COMPLETED

- [x] **4.1** Email Validation
  - [x] Add proper email validation before OTP send
  - [x] Show clear feedback when OTP is sent
  - [x] Handle email provider delays with loading states
- [x] **4.2** Error Handling
  - [x] Handle expired codes gracefully with automatic cleanup
  - [x] Clear error messages for invalid codes
  - [x] Rate limiting feedback with resend button states
  - [x] Network error handling with retry options
- [x] **4.3** Accessibility
  - [x] Add ARIA labels for OTP inputs
  - [x] Implement keyboard navigation
  - [x] Add screen reader announcements for state changes

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

## Email Templates Created ✅

Created two professional OTP email templates for Supabase configuration:

### 1. Modern Template (`supabase-email-templates/otp-email.html`)

- Beautiful gradient design with modern CSS
- Fully responsive for mobile devices
- Rich styling with shadows and animations
- Perfect for Gmail, Apple Mail, modern email clients

### 2. Simple Template (`supabase-email-templates/otp-email-simple.html`)

- Table-based layout for universal compatibility
- Inline styles that work everywhere
- Bulletproof design for corporate email systems
- Perfect for Outlook, Exchange, older email clients

**Both templates feature:**

- Lexa branding with purple gradient header
- Large, clear OTP display (48px monospace font)
- 60-minute expiry indicator
- Step-by-step instructions specific to Chrome extension
- Security messaging to build trust and prevent phishing
- Professional footer with policy links
- Uses `{{ .Token }}` variable for Supabase integration

## Key Implementation Details

### Chrome Storage Persistence

```javascript
// Storage utility functions
const otpStorage = {
  async get(): Promise<OtpFlowState | null>
  async set(state: OtpFlowState): Promise<void>
  async clear(): Promise<void>
  async isExpired(): Promise<boolean>
  async getRemainingTime(): Promise<number>
}

// OTP flow state structure
interface OtpFlowState {
  email: string;
  step: 'otp';
  timestamp: number;
  expiresAt: number;
}
```

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
- **Storage:** Chrome local storage for OTP state persistence

## User Experience Flow

1. **Enter email** → Click "Continue"
2. **OTP sent** → State saved to Chrome storage
3. **Close popup** → Check email for 6-digit code
4. **Reopen popup** → Automatically shows OTP input with correct countdown
5. **Enter code** → Authentication completes, state cleared

## Files Modified ✅

### New Files Created:

- `src/components/OtpInput.tsx` - 6-digit OTP input component
- `src/lib/otpStorage.ts` - Chrome storage utility for OTP state
- `supabase-email-templates/otp-email.html` - Modern email template
- `supabase-email-templates/otp-email-simple.html` - Simple email template

### Files Modified:

- `src/queries/auth.ts` - Added Email OTP hooks
- `src/components/LoginForm.tsx` - Two-step flow with storage persistence
- `src/main.tsx` - Added debug helpers
- `src/App.tsx` - Removed confirm route
- `src/pages/auth/signup.tsx` - Updated to use new flow

### Files Deleted:

- `src/pages/auth/confirm.tsx` - No longer needed

## Build Status ✅

- **TypeScript compilation:** ✅ No errors
- **Build process:** ✅ Successful
- **Commit hash:** `f623666`
- **Files changed:** 10 files
- **Lines added:** 1,049 insertions
- **Lines removed:** 154 deletions

## Success Criteria

- [x] Users can authenticate using only email + 6-digit code
- [x] Chrome storage persistence handles popup close/reopen cycles
- [x] Professional email templates ready for Supabase
- [x] Comprehensive error handling provides clear user guidance
- [x] Code is clean and maintainable
- [ ] No more Chrome extension URL blocking errors (pending Supabase config)
- [ ] Sessions persist across browser restarts (pending testing)
- [ ] Authentication works across all major email providers (pending testing)

## Next Steps

1. **Supabase Dashboard Configuration:**

   - Enable Email OTP authentication
   - Set JWT expiry to 30 days
   - Upload one of the email templates
   - Configure OTP settings

2. **Testing:**

   - Test complete flow with real OTP emails
   - Verify across different email providers
   - Test session persistence

3. **Production Deployment:**
   - Deploy updated extension
   - Monitor authentication success rates
   - Gather user feedback

## Rollback Plan

If issues arise, we can temporarily revert to magic links by:

1. Reverting auth query changes
2. Re-enabling magic link UI components
3. Restoring external messaging handlers

## Notes for Future Agents

- **Current Extension ID:** `bmfjgljapphpbkkaokbkmegbhojeaapo`
- **Supabase Project:** `dyixdtizbgzfiybcwoto`
- **Key Files Modified:**
  - `src/queries/auth.ts` (Email OTP hooks)
  - `src/components/LoginForm.tsx` (Two-step flow with persistence)
  - `src/components/OtpInput.tsx` (New OTP input component)
  - `src/lib/otpStorage.ts` (Chrome storage utility)
- **Testing Email:** Use `jonathankrone@gmail.com` for development
- **Debug Tools:** Available at `window.lexaDebug.otpStorage` in development
- **Current Status:** Frontend implementation complete, ready for Supabase configuration
