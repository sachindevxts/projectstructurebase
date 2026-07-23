export interface EmployeeItem {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  manager: string;
  type: string;
  joined: string;
  allocation: number;
  billability: string;
  status: string;
}
export interface ProjectItem {
  id: string;
  name: string;
  client: string;
  manager: string;
  start: string;
  end: string;
  team: number;
  billable: number;
  billing: string;
  status: string;
}
export interface AuditItem {
  id: string;
  date: string;
  user: string;
  entity: string;
  action: string;
  summary: string;
  reason: string;
}
