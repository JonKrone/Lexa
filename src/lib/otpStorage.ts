export interface OtpFlowState {
  email: string
  step: 'email' | 'otp'
  timestamp: number
  expiryMinutes: number
}

export const OTP_FLOW_STORAGE_KEY = 'lexa_otp_flow_state'

export const otpStorage = {
  async get(): Promise<OtpFlowState | null> {
    try {
      const result = await chrome.storage.local.get(OTP_FLOW_STORAGE_KEY)
      return result[OTP_FLOW_STORAGE_KEY] || null
    } catch (error) {
      console.error('Error getting OTP flow state:', error)
      return null
    }
  },

  async set(state: OtpFlowState): Promise<void> {
    try {
      await chrome.storage.local.set({ [OTP_FLOW_STORAGE_KEY]: state })
    } catch (error) {
      console.error('Error setting OTP flow state:', error)
    }
  },

  async clear(): Promise<void> {
    try {
      await chrome.storage.local.remove(OTP_FLOW_STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing OTP flow state:', error)
    }
  },

  async isExpired(state: OtpFlowState): Promise<boolean> {
    const now = Date.now()
    const timeElapsed = now - state.timestamp
    const maxAge = state.expiryMinutes * 60 * 1000
    return timeElapsed >= maxAge
  },

  async getRemainingTime(state: OtpFlowState): Promise<number> {
    const now = Date.now()
    const timeElapsed = Math.floor((now - state.timestamp) / 1000)
    const remaining = state.expiryMinutes * 60 - timeElapsed
    return Math.max(0, remaining)
  },

  // Debug helper
  async debug(): Promise<void> {
    const state = await this.get()
    if (state) {
      const isExpired = await this.isExpired(state)
      const remainingTime = await this.getRemainingTime(state)
      console.log('OTP Flow State:', {
        ...state,
        isExpired,
        remainingTime: `${Math.floor(remainingTime / 60)}:${(remainingTime % 60).toString().padStart(2, '0')}`,
        ageInSeconds: Math.floor((Date.now() - state.timestamp) / 1000),
      })
    } else {
      console.log('No OTP flow state found')
    }
  },
}
