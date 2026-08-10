import React from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
  InputLabel,
  Chip,
} from '@mui/material';
import type { Skill, DialogMode } from '../../types/skill.types';
import { SKILL_CATEGORIES, DEMAND_LEVELS, PROFICIENCY_LEVELS } from '../../constants/skill.constants';
import styles from './SkillForm.module.scss';

interface SkillFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: any;
  errors: Record<string, string>;
  isSubmitting: boolean;
  onFieldChange: (field: string, value: any) => void;
  mode: DialogMode;
  selectedSkill?: Skill | null;
}

export const SkillForm = ({
  isOpen,
  onClose,
  onSave,
  formData,
  errors,
  isSubmitting,
  onFieldChange,
  mode,
  selectedSkill,
}: SkillFormProps) => {
  const designations = [
    'Senior React Developer',
    'Tech Lead',
    'Junior Developer',
    'Full Stack Developer',
    'QA Engineer',
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" className={styles.modalTitle}>
          {mode === 'edit' ? 'Edit' : 'Add'} Skill
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {mode === 'edit' 
            ? `Update ${selectedSkill?.name || 'skill'} details` 
            : "Add a new skill to the organization's taxonomy"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box className={styles.form} component="form" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Skill Name"
                placeholder="e.g. React.js, Docker, Figma..."
                value={formData.name || ''}
                onChange={(e) => onFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category || ''}
                  onChange={(e) => onFieldChange('category', e.target.value)}
                  label="Category"
                >
                  <MenuItem value="" disabled>Select category...</MenuItem>
                  {SKILL_CATEGORIES.filter(c => c !== 'All').map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {errors.category && (
                  <Typography variant="caption" color="error">
                    {errors.category}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Proficiency Levels</InputLabel>
                <Select
                  value={formData.proficiency}
                  onChange={(e) => onFieldChange('proficiency', e.target.value)}
                  label="Proficiency Levels"
                >
                  {PROFICIENCY_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Demand Level</FormLabel>
                <RadioGroup
                  row
                  value={formData.demand}
                  onChange={(e) => onFieldChange('demand', e.target.value)}
                >
                  {DEMAND_LEVELS.map((level) => (
                    <FormControlLabel
                      key={level}
                      value={level}
                      control={<Radio />}
                      label={level}
                      className={level === 'Critical' ? styles.critical : ''}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Related Skills / Aliases"
                placeholder="e.g. React, ReactJS (comma-separated)"
                value={formData.aliases || ''}
                onChange={(e) => onFieldChange('aliases', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                placeholder="Brief description of this skill..."
                value={formData.description || ''}
                onChange={(e) => onFieldChange('description', e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Applicable Designations</InputLabel>
                <Select
                  multiple
                  value={formData.designations ? formData.designations.split('|') : []}
                  onChange={(e) => {
                    const values = e.target.value as string[];
                    onFieldChange('designations', values.join('|'));
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  label="Applicable Designations"
                >
                  {designations.map((designation) => (
                    <MenuItem key={designation} value={designation}>
                      {designation}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5 }}>
                  Hold Ctrl / ⌘ to select multiple
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.active === 'true'}
                    onChange={(e) => {
                      onFieldChange('active', String(e.target.checked));
                      onFieldChange('status', e.target.checked ? 'Active' : 'Inactive');
                    }}
                  />
                }
                label="Mark as Active"
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={onSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Skill'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
