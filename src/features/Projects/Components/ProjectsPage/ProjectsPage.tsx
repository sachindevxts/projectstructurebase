import React, { useCallback, useState, useMemo } from 'react';
import { Box, Button, Paper } from '@mui/material';
import { Add as AddIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// import { useProjects } from '../../Hooks/useProjects';
import { ProjectFilters } from '../ProjectFilters/ProjectFilters';
import { ProjectTable } from '../ProjectTable/ProjectTable';
import { ProjectStats } from '../ProjectStats/ProjectStats';
import { PfPageHeader } from '@/features/Shared';
import styles from './ProjectsPage.module.scss';
import { useProjects } from '../../Hooks/useProjects';

export const ProjectsPage = () => {
  const navigate = useNavigate();
  const { projects, loading, stats } = useProjects();
  const [search, setSearch] = useState('');

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    const searchLower = search.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchLower) || p.client.toLowerCase().includes(searchLower),
    );
  }, [projects, search]);

  const handleAddProject = useCallback(() => {
    navigate('/projects/new');
  }, [navigate]);

  const handleViewProject = useCallback(
    (project: any) => {
      navigate(`/projects/${project.id}`);
    },
    [navigate],
  );

  return (
    <Box className={styles.page}>
      <PfPageHeader title="Projects" subtitle={`${stats.active} active · ${stats.total} total`}>
        <Button variant="outlined" startIcon={<DownloadIcon />}>
          Export
        </Button>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddProject}>
          Add Project
        </Button>
      </PfPageHeader>

      <ProjectStats stats={stats} />

      <Paper elevation={0} className={styles.filtersWrapper}>
        <ProjectFilters
          search={search}
          onSearchChange={setSearch}
          resultCount={filteredProjects.length}
        />
      </Paper>

      <ProjectTable projects={filteredProjects} loading={loading} onView={handleViewProject} />
    </Box>
  );
};

export default ProjectsPage;

