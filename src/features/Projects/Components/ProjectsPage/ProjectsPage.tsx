import React, { useCallback, useState, useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';
import { ProjectFilters } from '../ProjectFilters/ProjectFilters';
import { ProjectTable } from '../ProjectTable/ProjectTable';
import { ProjectStats } from '../ProjectStats/ProjectStats';
import { PfPageHeader } from '@/features/Shared';
import { useAppSelector } from '@/hooks';
import { hasPermission } from '@/utils/permission.utils';
import styles from './ProjectsPage.module.scss';
import { useProjects } from '../../Hooks/useProjects';
import type { Project } from '../../Types/project.types';
import { projectService } from '../../Services/projectService';

interface ProjectFormValues {
  name: string;
  code: string;
  billingType: Project['billingType'];
  status: Project['backendStatus'];
  startDate: string;
  endDate: string;
  managerId: string;
}

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const emptyProjectForm: ProjectFormValues = {
  name: '',
  code: '',
  billingType: 'TIME_AND_MATERIAL',
  status: 'ACTIVE',
  startDate: toDateKey(new Date()),
  endDate: '',
  managerId: '',
};

const billingLabels: Record<Project['billingType'], string> = {
  FIXED_PRICE: 'Fixed Price',
  TIME_AND_MATERIAL: 'Time & Material',
  INTERNAL: 'Internal',
};

const statusLabels: Record<Project['backendStatus'], Project['status']> = {
  PLANNED: 'Active',
  ACTIVE: 'Active',
  ON_HOLD: 'On Hold',
  COMPLETED: 'Completed',
  CANCELLED: 'On Hold',
};

export const ProjectsPage = () => {
  const user = useAppSelector((state) => state.auth.user);
  const canCreateProject = hasPermission(user, ['projects:create']);
  const canUpdateProject = hasPermission(user, ['projects:update']);
  const canDeleteProject = hasPermission(user, ['projects:delete']);
  const canExportProjects = hasPermission(user, ['projects:export']);
  const { projects, loading, stats, createProject, updateProject, deleteProject } = useProjects();
  const [search, setSearch] = useState('');
  const [dialogMode, setDialogMode] = useState<'add' | 'edit' | 'view' | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectFormValues>(emptyProjectForm);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const managers = projectService.getManagers();

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    const searchLower = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) || p.client.toLowerCase().includes(searchLower),
    );
  }, [projects, search]);

  const openAddProject = useCallback(() => {
    setSelectedProject(null);
    setForm(emptyProjectForm);
    setDialogMode('add');
  }, []);

  const openViewProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setDialogMode('view');
  }, []);

  const openEditProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setForm({
      name: project.name,
      code: project.code,
      billingType: project.billingType,
      status: project.backendStatus,
      startDate: project.startDate,
      endDate: project.endDate,
      managerId: project.managerId ?? '',
    });
    setDialogMode('edit');
  }, []);

  const closeDialog = useCallback(() => {
    if (saving) return;
    setDialogMode(null);
    setSelectedProject(null);
    setFeedback(null);
  }, [saving]);

  const saveProject = useCallback(async () => {
    if (!form.name.trim()) {
      setFeedback('Project name is required');
      return;
    }
    if (form.endDate && form.startDate > form.endDate) {
      setFeedback('End date must be after start date');
      return;
    }

    setSaving(true);
    setFeedback(null);
    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      client: form.billingType === 'INTERNAL' ? 'Internal' : 'External Client',
      manager: 'Unassigned',
      managerId: form.managerId || null,
      start: form.startDate,
      end: form.endDate || 'Open',
      startDate: form.startDate,
      endDate: form.endDate,
      team: selectedProject?.team ?? 0,
      billable: selectedProject?.billable ?? 0,
      billing: billingLabels[form.billingType],
      billingType: form.billingType,
      status: statusLabels[form.status],
      backendStatus: form.status,
    };

    try {
      const result =
        dialogMode === 'edit' && selectedProject
          ? await updateProject(selectedProject.id, payload)
          : await createProject(payload);
      if (result) closeDialog();
      else setFeedback('Unable to save project');
    } finally {
      setSaving(false);
    }
  }, [closeDialog, createProject, dialogMode, form, selectedProject, updateProject]);

  const handleDeleteProject = useCallback(
    async (project: Project) => {
      if (window.confirm(`Are you sure you want to delete ${project.name}?`)) {
        await deleteProject(project.id);
      }
    },
    [deleteProject],
  );

  return (
    <Box className={styles.page}>
      <PfPageHeader title="Projects" subtitle={`${stats.active} active · ${stats.total} total`}>
        {canExportProjects && (
          <Button variant="outlined" startIcon={<DownloadIcon />}>
            Export
          </Button>
        )}
        {canCreateProject && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAddProject}>
            Add Project
          </Button>
        )}
      </PfPageHeader>

      <ProjectStats stats={stats} />

      <Paper elevation={0} className={styles.filtersWrapper}>
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          resultCount={filteredProjects.length}
        />
      </Paper>

      <ProjectTable
        projects={filteredProjects}
        loading={loading}
        onView={openViewProject}
        onEdit={canUpdateProject ? openEditProject : undefined}
        onDelete={canDeleteProject ? handleDeleteProject : undefined}
      />

      <Dialog
        open={dialogMode === 'add' || dialogMode === 'edit'}
        onClose={closeDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{dialogMode === 'edit' ? 'Edit project' : 'Add project'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {feedback && <Alert severity="error">{feedback}</Alert>}
            <TextField
              label="Project name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Project code"
              helperText="Leave empty to auto-generate for new projects"
              value={form.code}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))
              }
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <FormControl fullWidth>
                <InputLabel id="project-billing-label">Billing</InputLabel>
                <Select
                  labelId="project-billing-label"
                  label="Billing"
                  value={form.billingType}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      billingType: event.target.value as Project['billingType'],
                    }))
                  }
                >
                  {Object.entries(billingLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="project-status-label">Status</InputLabel>
                <Select
                  labelId="project-status-label"
                  label="Status"
                  value={form.status}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      status: event.target.value as Project['backendStatus'],
                    }))
                  }
                >
                  <MenuItem value="PLANNED">Planned</MenuItem>
                  <MenuItem value="ACTIVE">Active</MenuItem>
                  <MenuItem value="ON_HOLD">On Hold</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            <FormControl fullWidth>
              <InputLabel id="project-manager-label">Manager</InputLabel>
              <Select
                labelId="project-manager-label"
                label="Manager"
                value={form.managerId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, managerId: event.target.value }))
                }
              >
                <MenuItem value="">Unassigned</MenuItem>
                {managers.map((manager) => (
                  <MenuItem key={manager.id} value={manager.id}>
                    {manager.firstName} {manager.lastName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start date"
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, startDate: event.target.value }))
                }
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End date"
                type="date"
                value={form.endDate}
                onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={saving}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveProject} disabled={saving}>
            {saving ? 'Saving...' : dialogMode === 'edit' ? 'Save project' : 'Create project'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={dialogMode === 'view'} onClose={closeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Project details</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Stack spacing={2} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="h6">{selectedProject.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProject.code}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={selectedProject.status} />
                <Chip label={selectedProject.billing} variant="outlined" />
                <Chip label={`${selectedProject.team} team members`} color="primary" />
              </Stack>
              <Stack spacing={0.75}>
                <Typography variant="body2">Manager: {selectedProject.manager}</Typography>
                <Typography variant="body2">Client: {selectedProject.client}</Typography>
                <Typography variant="body2">Start: {selectedProject.start}</Typography>
                <Typography variant="body2">End: {selectedProject.end}</Typography>
                <Typography variant="body2">Allocated: {selectedProject.billable}%</Typography>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
          {canUpdateProject && selectedProject && (
            <Button variant="contained" onClick={() => openEditProject(selectedProject)}>
              Edit
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectsPage;
