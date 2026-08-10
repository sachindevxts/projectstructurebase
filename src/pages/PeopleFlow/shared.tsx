/**
 * @deprecated These components are being migrated to the design system.
 * Please use components from @/Features/shared or @mui/material instead.
 */
import React from 'react';
import { Box, Typography, Stack, Chip, LinearProgress, Tabs as MuiTabs, Tab } from '@mui/material';
import type { ReactNode } from 'react';

// Keep for backward compatibility with legacy pages
export const PfPageHeader = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 2,
        mb: 3,
        flexWrap: 'wrap',
      }}
    >
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Stack direction="row" spacing={1}>
        {children}
      </Stack>
    </Box>
  );
};

// Re-export Chip as PfBadge for backward compatibility
export const PfBadge = ({ children, tone = 'blue' }: { children: ReactNode; tone?: string }) => {
  const colorMap: Record<string, any> = {
    blue: 'primary',
    green: 'success',
    red: 'error',
    orange: 'warning',
    purple: 'secondary',
    slate: 'default',
  };
  return <Chip label={children} color={colorMap[tone] || 'default'} size="small" />;
};

export const PfFilterBar = ({
  search,
  setSearch,
  children,
}: {
  search: string;
  setSearch: (value: string) => void;
  children?: ReactNode;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'flex-end',
        p: 2,
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          flex: 1,
          padding: '8px 12px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
        }}
      />
      {children}
      <button
        onClick={() => setSearch('')}
        style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}
      >
        Clear
      </button>
    </Box>
  );
};

export const CapacityBar = ({ value }: { value: number }) => {
  const isOverallocated = value > 100;
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 80 }}>
      <LinearProgress
        variant="determinate"
        value={Math.min(value, 100)}
        sx={{ flex: 1, height: 6, borderRadius: 'var(--radius-sm)', bgcolor: 'divider' }}
        color={isOverallocated ? 'error' : 'primary'}
      />
      <Typography
        variant="caption"
        fontWeight={600}
        color={isOverallocated ? 'error' : 'text.primary'}
      >
        {value}%
      </Typography>
    </Box>
  );
};

export const Tabs = ({
  items,
  active,
  setActive,
}: {
  items: string[];
  active: string;
  setActive: (value: string) => void;
}) => {
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActive(newValue);
  };
  return (
    <MuiTabs
      value={active}
      onChange={handleChange}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      {items.map((item) => (
        <Tab key={item} label={item} value={item} />
      ))}
    </MuiTabs>
  );
};

