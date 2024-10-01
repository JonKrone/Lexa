import { FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

interface Props {
  children: React.ReactNode
}

export const WholeAppErrorBoundary: FC<Props> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  )
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <svg
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff6b6b"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h1 style={{ marginTop: '16px' }}>Oops! Something went wrong.</h1>
      <p style={{ marginBottom: '24px' }}>
        We're sorry, an error occurred while using Lexa.
      </p>
      <div
        style={{
          border: '1px solid #333333',
          borderRadius: '4px',
          padding: '16px',
          maxWidth: '80%',
          wordBreak: 'break-word',
        }}
      >
        <p style={{ color: '#ff6b6b' }}>Error: {error.message}</p>
      </div>
      <button
        style={{
          marginTop: '24px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#3700b3',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        onClick={() => window.location.reload()}
      >
        Refresh Page
      </button>
    </div>
  )
}
