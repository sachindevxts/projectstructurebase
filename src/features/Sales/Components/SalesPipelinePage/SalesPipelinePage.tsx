import React, { useEffect, useState } from 'react';
import { Avatar, Box, Chip, MenuItem, Paper, Select, Typography } from '@mui/material';
import { PfPageHeader } from '@/features/Shared/Components/PfPageHeader/PfPageHeader';
import { salesService, type SalesPipelineResponse } from '../../services/sales.service';
import styles from './SalesPipelinePage.module.scss';

const SalesPipelinePage: React.FC = () => {
  const [owner, setOwner] = useState('my-team');
  const [dealSize, setDealSize] = useState('all');
  const [expectedClose, setExpectedClose] = useState('q3');
  const [data, setData] = useState<SalesPipelineResponse | null>(null);

  useEffect(() => {
    let active = true;
    void salesService
      .getPipeline({ owner, dealSize, expectedClose })
      .then((value) => {
        if (active) setData(value);
      });
    return () => {
      active = false;
    };
  }, [dealSize, expectedClose, owner]);

  return (
    <Box className={styles.page}>
      <PfPageHeader
        title="Sales Pipeline"
        subtitle="Track opportunities by stage, owner, deal size, and expected close."
      >
        <Typography className={styles.weighted}>
          Total Weighted: <b>{data?.totalWeighted ?? 'Rs 0'}</b>
        </Typography>
      </PfPageHeader>

      <Paper elevation={0} className={styles.filtersWrapper}>
        <Box className={styles.filters}>
          <Select size="small" value={owner} onChange={(event) => setOwner(event.target.value)} className={styles.filter}>
            <MenuItem value="my-team">Owner: My Team</MenuItem>
            <MenuItem value="me">Owner: Me</MenuItem>
            <MenuItem value="all">Owner: All</MenuItem>
          </Select>
          <Select size="small" value={dealSize} onChange={(event) => setDealSize(event.target.value)} className={styles.filter}>
            <MenuItem value="all">Deal Size: All</MenuItem>
            <MenuItem value="large">Deal Size: Large</MenuItem>
            <MenuItem value="medium">Deal Size: Medium</MenuItem>
          </Select>
          <Select size="small" value={expectedClose} onChange={(event) => setExpectedClose(event.target.value)} className={styles.filter}>
            <MenuItem value="q3">Expected Close: Q3</MenuItem>
            <MenuItem value="q4">Expected Close: Q4</MenuItem>
            <MenuItem value="month">Expected Close: This Month</MenuItem>
          </Select>
        </Box>
      </Paper>

      <Paper elevation={0} className={styles.boardWrapper}>
        <Box className={styles.board}>
          {(data?.columns ?? []).map((column) => (
            <Box key={column.id} className={styles.column}>
              <Box className={styles.columnHeader}>
                <Typography>
                  {column.title} <span>{column.count}</span>
                </Typography>
                <b>{column.value}</b>
              </Box>
              <Box className={styles.dealStack}>
                {column.deals.map((deal) => (
                  <Paper key={deal.id} elevation={0} className={`${styles.dealCard} ${styles[column.id]}`}>
                    <Typography className={styles.company}>{deal.company}</Typography>
                    <Typography className={styles.dealTitle}>{deal.title}</Typography>
                    <Box className={styles.dealMeta}>
                      <b>{deal.amount}</b>
                      <span>{deal.probability}</span>
                    </Box>
                    <Box className={styles.dealFooter}>
                      <Avatar className={styles.avatar}>{deal.ownerAvatar}</Avatar>
                      <Chip size="small" className={styles.tag} label={deal.tag} />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default SalesPipelinePage;
