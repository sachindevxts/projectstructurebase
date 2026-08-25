import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { CalendarDays, Search } from 'lucide-react';
import { PfPageHeader } from '@/features/Shared/Components/PfPageHeader/PfPageHeader';
import { salesService, type InvoiceCollectionResponse } from '../../services/sales.service';
import styles from './InvoicesCollectionsPage.module.scss';

const InvoicesCollectionsPage: React.FC = () => {
  const [period, setPeriod] = useState('q3');
  const [data, setData] = useState<InvoiceCollectionResponse | null>(null);

  useEffect(() => {
    let active = true;
    void salesService.getInvoicesCollections(period).then((value) => {
      if (active) setData(value);
    });
    return () => {
      active = false;
    };
  }, [period]);

  const summary = data?.summary;

  return (
    <Box className={styles.page}>
      <PfPageHeader
        title="Invoices & Collections"
        subtitle="Monitor billing status, receivables ageing and collection performance."
      >
        <Select
          size="small"
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className={styles.period}
          renderValue={() => (
            <Box className={styles.periodValue}>
              <CalendarDays size={13} />
              This Quarter (Q3)
            </Box>
          )}
        >
          <MenuItem value="q3">This Quarter (Q3)</MenuItem>
          <MenuItem value="q2">Previous Quarter</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </PfPageHeader>

      <Box className={styles.kpis}>
        <Paper elevation={0} className={styles.kpi}>
          <Typography>Total Invoiced</Typography>
          <b>{summary?.totalInvoiced ?? 'Rs 0'}</b>
        </Paper>
        <Paper elevation={0} className={`${styles.kpi} ${styles.success}`}>
          <Typography>Collected</Typography>
          <b>{summary?.collected ?? 'Rs 0'}</b>
        </Paper>
        <Paper elevation={0} className={`${styles.kpi} ${styles.warning}`}>
          <Typography>Outstanding</Typography>
          <b>{summary?.outstanding ?? 'Rs 0'}</b>
        </Paper>
        <Paper elevation={0} className={`${styles.kpi} ${styles.danger}`}>
          <Typography>Overdue Amount</Typography>
          <b>{summary?.overdueAmount ?? 'Rs 0'}</b>
        </Paper>
        <Paper elevation={0} className={styles.kpi}>
          <Typography>Avg Collection Period</Typography>
          <b>{summary?.avgCollectionPeriod ?? '0 Days'}</b>
        </Paper>
      </Box>

      <Box className={styles.middle}>
        <Paper elevation={0} className={styles.ageingCard}>
          <Typography className={styles.cardTitle}>Receivables Ageing</Typography>
          <ResponsiveContainer width="100%" height={196}>
            <PieChart>
              <Pie
                data={data?.ageing ?? []}
                dataKey="value"
                innerRadius={48}
                outerRadius={80}
                paddingAngle={0}
              >
                {(data?.ageing ?? []).map((item) => (
                  <Cell key={item.label} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <Box className={styles.legend}>
            {(data?.ageing ?? []).map((item) => (
              <span key={item.label}>
                <i style={{ background: item.color }} />
                {item.label}
              </span>
            ))}
          </Box>
        </Paper>

        <Paper elevation={0} className={styles.insights}>
          <Box className={styles.insightHeader}>
            <Typography className={styles.cardTitle}>Collection Insights</Typography>
            <span>Updated 10m ago</span>
          </Box>
          {(data?.insights ?? []).map((item) => (
            <Box key={item.id} className={styles.insightRow}>
              <b>{item.value}</b>
              <Box>
                <Typography>{item.title}</Typography>
                <span>{item.note}</span>
              </Box>
              <Button size="small">{item.action}</Button>
            </Box>
          ))}
        </Paper>
      </Box>

      <Paper elevation={0} className={styles.tableCard}>
        <Box className={styles.tableToolbar}>
          <TextField
            size="small"
            placeholder="Search by invoice # or client..."
            InputProps={{ startAdornment: <Search size={15} /> }}
            className={styles.search}
          />
          <Box className={styles.sort}>
            <span>Sort:</span>
            <Select size="small" value="soonest">
              <MenuItem value="soonest">Due Date (Soonest)</MenuItem>
            </Select>
          </Box>
        </Box>
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th>Inv #</th>
              <th>Client & Project</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Outstanding</th>
              <th>Status</th>
              <th>Ageing</th>
              <th>Owner</th>
            </tr>
          </thead>
          <tbody>
            {(data?.invoices ?? []).map((invoice) => (
              <tr key={invoice.id}>
                <td>
                  <b>{invoice.invoiceNumber}</b>
                </td>
                <td>
                  <b>{invoice.client}</b>
                  <span>{invoice.project}</span>
                </td>
                <td>{invoice.issueDate}</td>
                <td className={styles.due}>{invoice.dueDate}</td>
                <td>
                  <b>{invoice.amount}</b>
                </td>
                <td className={styles.outstanding}>{invoice.outstanding}</td>
                <td>
                  <Chip size="small" label={invoice.status} className={styles.status} />
                </td>
                <td className={invoice.ageing === 'Current' ? styles.current : styles.ageing}>
                  {invoice.ageing}
                </td>
                <td>
                  <Box className={styles.owner}>
                    <Avatar>{invoice.ownerAvatar}</Avatar>
                    <span>{invoice.owner}</span>
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};

export default InvoicesCollectionsPage;
