import React, { useCallback } from 'react';
import { Box, Container, Paper, Button, Stack } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useSkills } from '../../hooks/useSkills';
import { useSkillFilters } from '../../hooks/useSkillFilters';
import { useSkillForm } from '../../hooks/useSkillForm';
import { SkillStats } from '../SkillStats/SkillStats';
import { SkillFilters } from '../SkillFilters/SkillFilters';
import { SkillTable } from '../SkillTable/SkillTable';
import { SkillForm } from '../SkillForm/SkillForm';
import { SkillDetailsModal } from '../SkillDetailsModal/SkillDetailsModal';
import { SkillGapAlert } from '../SkillGapAlert/SkillGapAlert';
import { SkillCharts } from '../SkillCharts/SkillCharts';
import { PfPageHeader } from '@/pages/PeopleFlow/shared';
import { skillService } from '../../services/skillService';
import { CHART_SKILLS } from '../../constants/skill.constants';
import styles from './SkillsPage.module.scss';

export const SkillsPage = () => {
  const {
    skills,
    loading,
    selectedSkill,
    dialogMode,
    selectedRows,
    stats,
    createSkill,
    updateSkill,
    deleteSkill,
    openDialog,
    closeDialog,
    toggleSelection,
    toggleAllSelection,
  } = useSkills();

  const {
    filters,
    filteredSkills,
    updateFilter,
    resetFilters,
  } = useSkillFilters();

  const {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    resetForm,
    populateForm,
    setIsSubmitting,
  } = useSkillForm();

  const chartSkills = skillService.getCoverageChartSkills(CHART_SKILLS);

  const handleSaveSkill = useCallback(async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const skillData = {
        name: formData.name,
        category: formData.category,
        demand: formData.demand as any,
        status: formData.status as any,
        description: formData.description,
        aliases: formData.aliases.split(',').map(s => s.trim()).filter(Boolean),
        designations: formData.designations.split('|').filter(Boolean),
        employees: 0,
        coverage: 0,
        gap: 'Partial' as const,
      };

      if (selectedSkill) {
        await updateSkill(selectedSkill.id, skillData);
      } else {
        await createSkill(skillData);
      }
      
      closeDialog();
      resetForm();
    } catch (err) {
      console.error('Error saving skill:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedSkill, createSkill, updateSkill, closeDialog, resetForm, validateForm, setIsSubmitting]);

  const handleViewSkill = useCallback((skill: any) => {
    openDialog('view', skill);
  }, [openDialog]);

  const handleEditSkill = useCallback((skill: any) => {
    populateForm(skill);
    openDialog('edit', skill);
  }, [populateForm, openDialog]);

  const handleDeleteSkill = useCallback(async (id: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(id);
    }
  }, [deleteSkill]);

  const handleAddSkill = useCallback(() => {
    resetForm();
    openDialog('add');
  }, [resetForm, openDialog]);

  const handleExportCsv = useCallback(() => {
    const csv = skillService.exportToCsv(filteredSkills);
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skills.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredSkills]);

  const handleDeactivateSkill = useCallback(async (id: string) => {
    await updateSkill(id, { status: 'Inactive' });
    closeDialog();
  }, [updateSkill, closeDialog]);

  return (
    <Box className={styles.page}>
      <PfPageHeader
        title="Skills"
        subtitle="Manage the organization's skill taxonomy, track employee coverage and demand gaps."
      >
        <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExportCsv}>
          Export
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddSkill}>
          Add Skill
        </Button>
      </PfPageHeader>

      <SkillStats stats={stats} />

      <SkillGapAlert skills={filteredSkills} />

      <SkillCharts skills={chartSkills} />

      <Paper elevation={0} className={styles.filtersWrapper}>
        <SkillFilters
          search={filters.search}
          category={filters.category}
          demand={filters.demand}
          onSearchChange={(value) => updateFilter('search', value)}
          onCategoryChange={(value) => updateFilter('category', value)}
          onDemandChange={(value) => updateFilter('demand', value)}
          resultCount={filteredSkills.length}
          onReset={resetFilters}
        />
      </Paper>

      <SkillTable
        skills={filteredSkills}
        selectedRows={selectedRows}
        loading={loading}
        onToggleSelection={toggleSelection}
        onToggleAll={toggleAllSelection}
        onView={handleViewSkill}
        onEdit={handleEditSkill}
        onDelete={handleDeleteSkill}
      />

      {dialogMode === 'view' && selectedSkill && (
        <SkillDetailsModal
          isOpen={true}
          onClose={closeDialog}
          skill={selectedSkill}
          onEdit={() => {
            populateForm(selectedSkill);
            openDialog('edit', selectedSkill);
          }}
          onDeactivate={() => handleDeactivateSkill(selectedSkill.id)}
        />
      )}

      {(dialogMode === 'add' || dialogMode === 'edit') && (
        <SkillForm
          isOpen={true}
          onClose={closeDialog}
          onSave={handleSaveSkill}
          formData={formData}
          errors={errors}
          isSubmitting={isSubmitting}
          onFieldChange={updateField}
          mode={dialogMode}
          selectedSkill={selectedSkill}
        />
      )}
    </Box>
  );
};

export default SkillsPage;