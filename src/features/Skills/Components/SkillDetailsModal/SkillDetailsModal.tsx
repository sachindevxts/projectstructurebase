import React from 'react';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import { Close as CloseIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { Skill } from '../../types/skill.types';
import { SkillTags } from './SkillTags/SkillTags';
import styles from './SkillDetailsModal.module.scss';
import { SkillMetricCard } from '../SkillMetricCard/SkillMetricCard';

interface SkillDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  skill: Skill;
  onEdit: () => void;
  onDeactivate: () => void;
}

export const SkillDetailsModal = ({
  isOpen,
  onClose,
  skill,
  onEdit,
  onDeactivate,
}: SkillDetailsModalProps) => {
  const getPopularityColor = (popularity: number = 0) => {
    if (popularity >= 80) return '#22C55E';
    if (popularity >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getDemandColor = (demand: string) => {
    switch (demand.toLowerCase()) {
      case 'high':
      case 'critical':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#22C55E';
      default:
        return '#64748B';
    }
  };

  const metrics = [
    { 
      label: 'Employees', 
      value: skill.employees, 
      icon: '👥',
      color: '#3B82F6',
    },
    { 
      label: 'Popularity', 
      value: `${skill.popularity || 0}%`, 
      icon: '⭐',
      color: getPopularityColor(skill.popularity),
    },
    { 
      label: 'Demand', 
      value: skill.demand, 
      icon: '📊',
      color: getDemandColor(skill.demand),
    },
    { 
      label: 'Coverage', 
      value: `${skill.coverage || 0}%`, 
      icon: '🎯',
      color: skill.gap === 'Gap' ? '#EF4444' : '#22C55E',
    },
  ];

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'success' : 'default';
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className={styles.dialogTitle}>
        <Box className={styles.headerContent}>
          <Box>
            <Typography variant="h5" className={styles.skillName}>
              {skill.name}
            </Typography>
            <Stack direction="row" spacing={1} className={styles.skillMeta}>
              <Chip label={skill.category} color="primary" size="small" />
              <Chip 
                label={skill.status} 
                color={getStatusColor(skill.status) as any} 
                size="small"
                variant={skill.status === 'Active' ? 'filled' : 'outlined'}
              />
            </Stack>
          </Box>
          <IconButton onClick={onClose} className={styles.closeButton}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box className={styles.modalBody}>
          <Grid container spacing={2} className={styles.metricsGrid}>
            {metrics.map((metric) => (
              <Grid item xs={6} sm={3} key={metric.label}>
                <SkillMetricCard
                  label={metric.label}
                  value={metric.value}
                  color={metric.color}
                  icon={metric.icon}
                />
              </Grid>
            ))}
          </Grid>

          <Box className={styles.aboutSection}>
            <Typography variant="caption" fontWeight={600} color="textSecondary" className={styles.sectionTitle}>
              ABOUT THIS SKILL
            </Typography>
            <Typography variant="body2" className={styles.description}>
              {skill.description || 'No description available for this skill.'}
            </Typography>
          </Box>

          <Box className={styles.designationsSection}>
            <Typography variant="caption" fontWeight={600} color="textSecondary" className={styles.sectionTitle}>
              MAPPED DESIGNATIONS
            </Typography>
            <Box className={styles.designationsList}>
              <SkillTags tags={skill.designations || []} maxDisplay={3} />
              {skill.designations?.length > 3 && (
                <Typography variant="caption" color="textSecondary">
                  +{skill.designations.length - 3} others
                </Typography>
              )}
              {(!skill.designations || skill.designations.length === 0) && (
                <Typography variant="body2" color="textSecondary">
                  No designations mapped
                </Typography>
              )}
            </Box>
          </Box>

          {skill.aliases && skill.aliases.length > 0 && (
            <Box className={styles.aliasesSection}>
              <Typography variant="caption" fontWeight={600} color="textSecondary" className={styles.sectionTitle}>
                ALIASES
              </Typography>
              <Box className={styles.aliasesList}>
                <SkillTags tags={skill.aliases} variant="alias" />
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions className={styles.dialogFooter}>
        <Button color="error" onClick={onDeactivate} variant="outlined">
          Deactivate Skill
        </Button>
        <Box className={styles.footerActions}>
          <Button onClick={onClose}>Close</Button>
          <Button variant="contained" onClick={onEdit} startIcon={<EditIcon />}>
            Edit Skill
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};