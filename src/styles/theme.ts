import { createTheme, type PaletteMode, type ThemeOptions } from '@mui/material/styles';

export type ThemeMode = PaletteMode;
export type ThemePreference = ThemeMode | 'system';

export const radius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

const brand = {
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
} as const;

const themeTokens = {
  light: {
    background: '#f3f5f9',
    paper: '#ffffff',
    surface: '#ffffff',
    surfaceMuted: '#f8fafc',
    textPrimary: '#172033',
    textSecondary: '#526078',
    border: '#dfe5ef',
    inputBackground: '#ffffff',
    overlay: 'rgba(15, 23, 42, 0.45)',
    shadowSm: '0 4px 14px rgba(15, 23, 42, 0.06)',
    shadowMd: '0 14px 35px rgba(15, 23, 42, 0.10)',
    topbarBackground: '#ffffff',
    sidebarBackground: '#ffffff',
    sidebarText: '#526078',
    sidebarTextActive: '#2557f5',
    sidebarHover: '#eef4ff',
  },
  dark: {
    background: '#090d1a',
    paper: '#111827',
    surface: '#111827',
    surfaceMuted: '#182235',
    textPrimary: '#f4f7ff',
    textSecondary: '#aab4cb',
    border: '#263349',
    inputBackground: '#0f172a',
    overlay: 'rgba(2, 6, 23, 0.72)',
    shadowSm: '0 5px 18px rgba(0, 0, 0, 0.24)',
    shadowMd: '0 16px 40px rgba(0, 0, 0, 0.34)',
    topbarBackground: '#0f172a',
    sidebarBackground: '#0f172a',
    sidebarText: '#cbd5e1',
    sidebarTextActive: '#ffffff',
    sidebarHover: '#172033',
  },
} as const;

const buildCssVariables = (mode: ThemeMode) => {
  const tokens = themeTokens[mode];

  return {
    '--radius-xs': `${radius.xs}px`,
    '--radius-sm': `${radius.sm}px`,
    '--radius-md': `${radius.md}px`,
    '--radius-lg': `${radius.lg}px`,
    '--radius-xl': `${radius.xl}px`,
    '--radius-full': `${radius.full}px`,
    '--color-primary': brand.primary.main,
    '--color-primary-hover': brand.primary.dark,
    '--color-primary-light': brand.primary.light,
    '--color-primary-dark': brand.primary.dark,
    '--color-on-primary': '#ffffff',
    '--color-secondary': brand.secondary.main,
    '--color-success': brand.success.dark,
    '--color-success-light': brand.success.light,
    '--color-success-surface': mode === 'dark' ? 'rgba(34, 197, 94, 0.14)' : '#f0fdf4',
    '--color-on-success': '#ffffff',
    '--color-warning': brand.warning.dark,
    '--color-warning-light': brand.warning.light,
    '--color-warning-surface': mode === 'dark' ? 'rgba(245, 158, 11, 0.14)' : '#fffbeb',
    '--color-on-warning': '#ffffff',
    '--color-error': brand.error.main,
    '--color-error-light': brand.error.light,
    '--color-error-surface': mode === 'dark' ? 'rgba(239, 68, 68, 0.14)' : '#fff1f2',
    '--color-on-error': '#ffffff',
    '--color-danger': brand.error.main,
    '--color-info': brand.info.main,
    '--color-info-light': brand.info.light,
    '--color-info-surface': mode === 'dark' ? 'rgba(59, 130, 246, 0.14)' : '#eff6ff',
    '--color-accent-purple': '#8b5cf6',
    '--color-accent-pink': '#ec4899',
    '--color-accent-teal': '#14b8a6',
    '--color-focus': brand.primary.main,
    '--color-background': tokens.background,
    '--color-surface': tokens.surface,
    '--color-surface-muted': tokens.surfaceMuted,
    '--color-text-primary': tokens.textPrimary,
    '--color-text-secondary': tokens.textSecondary,
    '--color-text': tokens.textPrimary,
    '--color-text-muted': tokens.textSecondary,
    '--color-border': tokens.border,
    '--input-background': tokens.inputBackground,
    '--surface-hover': mode === 'dark' ? 'rgba(79, 70, 229, 0.14)' : 'rgba(79, 70, 229, 0.06)',
    '--dropdown-arrow-color': tokens.textSecondary,
    '--dropdown-border-hover': brand.primary.light,
    '--color-overlay': tokens.overlay,
    '--shadow-sm': tokens.shadowSm,
    '--shadow-md': tokens.shadowMd,
    '--shadow-card': tokens.shadowMd,
    '--shadow-card-hover': tokens.shadowMd,
    '--topbar-height': '52px',
    '--topbar-background': tokens.topbarBackground,
    '--sidebar-width': '220px',
    '--sidebar-width-collapsed': '80px',
    '--sidebar-background': tokens.sidebarBackground,
    '--sidebar-text': tokens.sidebarText,
    '--sidebar-text-active': tokens.sidebarTextActive,
    '--sidebar-text-muted': tokens.textSecondary,
    '--sidebar-hover': tokens.sidebarHover,
    '--sidebar-active': tokens.sidebarHover,
    '--sidebar-border': tokens.border,
  };
};

const getThemeOptions = (mode: ThemeMode): ThemeOptions => {
  const tokens = themeTokens[mode];

  return {
    palette: {
      mode,
      primary: brand.primary,
      secondary: brand.secondary,
      success: brand.success,
      warning: brand.warning,
      error: brand.error,
      info: brand.info,
      background: {
        default: tokens.background,
        paper: tokens.paper,
      },
      text: {
        primary: tokens.textPrimary,
        secondary: tokens.textSecondary,
      },
      divider: tokens.border,
    },
    typography: {
      fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
      h1: {
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: 0,
      },
      h2: {
        fontWeight: 700,
        fontSize: '1.5rem',
        letterSpacing: 0,
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
          ':root': buildCssVariables(mode),
          body: {
            backgroundColor: 'var(--color-background)',
            color: 'var(--color-text-primary)',
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
            boxShadow: 'none',
          },
          contained: {
            boxShadow: '0 4px 14px rgba(79, 70, 229, 0.2)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(79, 70, 229, 0.3)',
            },
          },
          outlined: {
            borderColor: 'var(--color-border)',
            '&:hover': {
              borderColor: 'var(--dropdown-border-hover)',
              backgroundColor: 'var(--surface-hover, rgba(79, 70, 229, 0.06))',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-border)',
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: radius.lg,
            backgroundImage: 'none',
          },
          elevation0: {
            border: '1px solid var(--color-border)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: radius.sm,
              backgroundColor: 'var(--input-background)',
              '& fieldset': {
                borderColor: 'var(--color-border)',
              },
              '&:hover fieldset': {
                borderColor: 'var(--dropdown-border-hover)',
              },
              '&.Mui-focused fieldset': {
                borderColor: brand.primary.main,
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
              color: 'var(--color-text-secondary)',
              backgroundColor: 'var(--color-surface-muted)',
              borderBottom: '1px solid var(--color-border)',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.04em',
            },
            '& .MuiTableBody-root .MuiTableCell-root': {
              borderBottom: '1px solid var(--color-border)',
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
            backgroundColor: 'var(--input-background)',
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
  };
};

export const createAppTheme = (mode: ThemeMode = 'light') => createTheme(getThemeOptions(mode));

export const theme = createAppTheme('light');

export default theme;
