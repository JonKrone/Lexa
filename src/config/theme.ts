import { createTheme } from '@mui/material'

export const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#000',
  //   },
  // },
  palette: {
    mode: 'dark',
    primary: {
      '50': '#f8fafc',
      '100': '#f1f5f9',
      '200': '#e2e8f0',
      '300': '#cbd5e1',
      '400': '#94a3b8',
      '500': '#64748b',
      '600': '#475569',
      '700': '#334155',
      '800': '#1e293b',
      '900': '#0f172a',
    },
    // "primary": {
    //   "50": "#f8fafc",
    //   "100": "#f1f5f9",
    //   "200": "#e2e8f0",
    //   "300": "#cbd5e1",
    //   "400": "#94a3b8",
    //   "500": "#64748b",
    //   "600": "#475569",
    //   "700": "#334155",
    //   "800": "#1e293b",
    //   "900": "#0f172a"
    // }
  },
  spacing: 4,
  typography: {
    fontFamily: 'Geist Mono, Roboto Mono, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        margin: 'dense',
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: 'dense',
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
  },
})
