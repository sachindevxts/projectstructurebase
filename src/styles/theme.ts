import { createTheme } from '@mui/material/styles';

export const radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: '#4f46e5',
      light: '#818cf8',
      dark: '#3730a3',
    },
    secondary: {
      main: '#0f766e',
      light: '#14b8a6',
      dark: '#115e59',
    },
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f3f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#172033',
      secondary: '#526078',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
      fontSize: '1.5rem',
      letterSpacing: '-0.01em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '0.875rem',
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: radius.md,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          '--radius-xs': `${radius.xs}px`,
          '--radius-sm': `${radius.sm}px`,
          '--radius-md': `${radius.md}px`,
          '--radius-lg': `${radius.lg}px`,
          '--radius-xl': `${radius.xl}px`,
          '--radius-full': `${radius.full}px`,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: radius.md,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.2)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(79, 70, 229, 0.3)',
          },
        },
        outlined: {
          borderColor: '#dfe5ef',
          '&:hover': {
            borderColor: '#cbd5e1',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.05)',
          border: '1px solid #dfe5ef',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: radius.lg,
        },
        elevation0: {
          border: '1px solid #dfe5ef',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: radius.sm,
            '& fieldset': {
              borderColor: '#dfe5ef',
            },
            '&:hover fieldset': {
              borderColor: '#cbd5e1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4f46e5',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: radius.full,
          fontWeight: 500,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          '& .MuiTableHead-root .MuiTableCell-root': {
            fontWeight: 600,
            color: '#526078',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #dfe5ef',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.04em',
          },
          '& .MuiTableBody-root .MuiTableCell-root': {
            borderBottom: '1px solid #dfe5ef',
            padding: '12px 16px',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: radius.xl,
          boxShadow: '0 24px 48px rgba(15, 23, 42, 0.15)',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: radius.sm,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: radius.md,
        },
      },
    },
  },
});

export default theme;
