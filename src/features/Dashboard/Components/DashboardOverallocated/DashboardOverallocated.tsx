import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import styles from './DashboardOverallocated.module.scss';

interface OverallocatedEmployee {
  id: string;
  name: string;
  allocation: number;
}

interface DashboardOverallocatedProps {
  employees: OverallocatedEmployee[];
}

export const DashboardOverallocated = ({ employees }: DashboardOverallocatedProps) => {
  if (employees.length === 0) {
    return (
      <Card className={styles.overallocatedCard}>
        <CardContent>
          <Box className={styles.successState}>
            <Typography variant="h6" gutterBottom>
              Overallocated Employees
            </Typography>
            <Box className={styles.successMessage}>
              <Typography variant="body1" sx={{ fontSize: 32, mb: 1 }}>
                ✅
              </Typography>
              <Typography variant="body2" color="textSecondary">
                No overallocated employees
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={styles.overallocatedCard}>
      <CardContent>
        <Box className={styles.header}>
          <Typography variant="h6">Overallocated Employees</Typography>
          <Chip 
            label={`${employees.length} affected`} 
            size="small" 
            color="error"
            icon={<WarningIcon />}
          />
        </Box>
        <List className={styles.employeeList}>
          {employees.slice(0, 5).map((employee, index) => (
            <React.Fragment key={employee.id}>
              <ListItem className={styles.employeeItem}>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={500}>
                      {employee.name}
                    </Typography>
                  }
                  secondary={`${employee.allocation}% allocated`}
                />
                <Chip 
                  label={`${employee.allocation}%`} 
                  size="small" 
                  color="error"
                  variant="filled"
                />
              </ListItem>
              {index < employees.length - 1 && <Divider variant="inset" />}
            </React.Fragment>
          ))}
        </List>
        {employees.length > 5 && (
          <Box className={styles.footer}>
            <Typography variant="caption" color="textSecondary">
              And {employees.length - 5} more employees
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};