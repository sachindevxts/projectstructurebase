import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import styles from './DashboardUpcomingReleases.module.scss';

interface Release {
  id: string;
  name: string;
  designation: string;
  releaseDate: string;
}

interface DashboardUpcomingReleasesProps {
  releases: Release[];
}

export const DashboardUpcomingReleases = ({ releases }: DashboardUpcomingReleasesProps) => {
  const getAvatarColor = (name: string) => {
    const colors = ['#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];
    const index = name.length % colors.length;
    return colors[index];
  };

  if (releases.length === 0) {
    return (
      <Card className={styles.releasesCard}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upcoming Releases
          </Typography>
          <Box className={styles.emptyState}>
            <Typography variant="body2" color="textSecondary">
              No upcoming releases
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.releasesCard}>
      <CardContent>
        <Box className={styles.header}>
          <Typography variant="h6">Upcoming Releases</Typography>
          <Chip label={`${releases.length} employees`} size="small" color="warning" />
        </Box>
        <List className={styles.releaseList}>
          {releases.slice(0, 4).map((release, index) => (
            <React.Fragment key={release.id}>
              <ListItem className={styles.releaseItem}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getAvatarColor(release.name) }}>
                    {release.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {release.name}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="textSecondary">
                      {release.designation}
                    </Typography>
                  }
                />
                <Chip 
                  label={release.releaseDate} 
                  size="small" 
                  variant="outlined"
                  color="warning"
                />
              </ListItem>
              {index < releases.length - 1 && <Divider variant="inset" />}
            </React.Fragment>
          ))}
        </List>
        {releases.length > 4 && (
          <Box className={styles.footer}>
            <Button 
              endIcon={<ArrowForwardIcon />}
              size="small"
              color="primary"
            >
              View All ({releases.length})
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};