import type { DashboardData } from '../Types/dashboard.types';
import dashboardData from '@/dummyJson/dashboard/dashboard.json';
import employeesData from '@/dummyJson/employees/employee-list.json';

class DashboardService {
  private data: DashboardData | null = null;

  constructor() {
    this.data = this.buildDashboardData();
  }

  private buildDashboardData(): DashboardData {
    const employees = employeesData.employees;
    
    // Calculate stats from employee data
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const onLeave = employees.filter(e => e.status === 'On Leave' || e.status === 'Leave').length;
    const contractors = employees.filter(e => e.type === 'Contract').length;
    
    const billableCount = employees.filter(e => e.billability === 'Billable').length;
    const billablePercentage = Math.round((billableCount / totalEmployees) * 100);
    
    const overallocated = employees.filter(e => e.allocation > 100).length;

    // Department breakdown
    const deptMap = employees.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const employeesByDepartment = Object.entries(deptMap).map(([department, count]) => ({
      department,
      count,
    }));

    // Upcoming releases (employees with allocation < 100 and releasing soon)
    const upcomingReleases = employees
      .filter(e => e.allocation < 100 && e.allocation > 0)
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        name: e.name,
        designation: e.designation,
        releaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      }));

    // Overallocated employees
    const overallocatedEmployees = employees
      .filter(e => e.allocation > 100)
      .map(e => ({
        id: e.id,
        name: e.name,
        allocation: e.allocation,
      }));

    return {
      stats: [
        {
          id: 'total-employees',
          value: totalEmployees,
          label: 'Total Employees',
          change: 8,
          trend: 'up',
          icon: '👥',
          color: '#3B82F6',
        },
        {
          id: 'active-employees',
          value: activeEmployees,
          label: 'Active',
          change: 12,
          trend: 'up',
          icon: '✅',
          color: '#22C55E',
        },
        {
          id: 'on-leave',
          value: onLeave,
          label: 'On Leave',
          change: -3,
          trend: 'down',
          icon: '🏖️',
          color: '#F59E0B',
        },
        {
          id: 'contractors',
          value: contractors,
          label: 'Contractors',
          change: 5,
          trend: 'up',
          icon: '📋',
          color: '#8B5CF6',
        },
        {
          id: 'billable',
          value: `${billablePercentage}%`,
          label: 'Billable %',
          change: 2,
          trend: 'up',
          icon: '💰',
          color: '#22C55E',
        },
        {
          id: 'open-positions',
          value: overallocated,
          label: 'Overallocated',
          change: -4,
          trend: 'down',
          icon: '🔍',
          color: '#EF4444',
        },
      ],
      billableVsNonBillable: {
        billable: billableCount,
        nonBillable: totalEmployees - billableCount,
      },
      employeesByDepartment,
      allocationDistribution: {
        active: employees.filter(e => e.allocation > 0 && e.allocation <= 100).length,
        total: employees.length,
      },
      upcomingReleases,
      overallocatedEmployees,
      recentActivity: [
        {
          id: '1',
          action: 'Updated allocation for Aditi Mehra',
          user: 'Arjun Kapoor',
          timestamp: new Date().toISOString(),
        },
        {
          id: '2',
          action: 'Added new employee Meera Nair',
          user: 'Vikram Sharma',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '3',
          action: 'Changed project status for NovaBank',
          user: 'Priya Singh',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
      ],
    };
  }

  getDashboardData(): DashboardData {
    return this.data || this.buildDashboardData();
  }

  getStats(): DashboardData['stats'] {
    return this.getDashboardData().stats;
  }

  getBillableData() {
    const data = this.getDashboardData();
    return data.billableVsNonBillable;
  }

  getDepartmentData() {
    const data = this.getDashboardData();
    return data.employeesByDepartment;
  }

  getAllocationData() {
    const data = this.getDashboardData();
    return data.allocationDistribution;
  }

  getUpcomingReleases() {
    const data = this.getDashboardData();
    return data.upcomingReleases;
  }

  getOverallocatedEmployees() {
    const data = this.getDashboardData();
    return data.overallocatedEmployees;
  }

  getRecentActivity() {
    const data = this.getDashboardData();
    return data.recentActivity || [];
  }
}

export const dashboardService = new DashboardService();