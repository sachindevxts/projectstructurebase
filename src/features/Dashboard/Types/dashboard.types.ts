export interface DashboardStat {
  id: string;
  value: string | number;
  label: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface DashboardData {
  stats: DashboardStat[];
  billableVsNonBillable: {
    billable: number;
    nonBillable: number;
  };
  employeesByDepartment: {
    department: string;
    count: number;
  }[];
  allocationDistribution: {
    active: number;
    total: number;
  };
  upcomingReleases: {
    id: string;
    name: string;
    designation: string;
    releaseDate: string;
    avatar?: string;
  }[];
  overallocatedEmployees: {
    id: string;
    name: string;
    allocation: number;
  }[];
  recentActivity?: {
    id: string;
    action: string;
    user: string;
    timestamp: string;
  }[];
}

export interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}