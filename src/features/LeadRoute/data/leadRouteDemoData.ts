import {
  Activity,
  Building2,
  ClipboardCheck,
  FileText,
  Inbox,
  Link2,
  Mail,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';

export interface ProspectPreview {
  name: string;
  company: string;
  title: string;
  email: string;
  source: string;
}

export interface IntegrationItem {
  name: string;
  description: string;
  category: 'LEAD SOURCES' | 'ENRICHMENT' | 'CRM';
  icon: LucideIcon;
  background: string;
  connected?: boolean;
}

export interface AuditLogRow {
  date: string;
  time: string;
  action: 'APPROVED' | 'REJECTED' | 'RE-QUEUED';
  prospectName: string;
  previousStatus: string;
  nextStatus: string;
  actorEmail: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  background: string;
}

export interface IngestionPipeline {
  name: string;
  count: string;
  color: string;
}

export const dashboardMetrics: DashboardMetric[] = [
  { label: 'PENDING APPROVAL', value: '11', icon: ClipboardCheck, background: '#fef3c7' },
  { label: 'ACTIVE SEQUENCES', value: '1', icon: Activity, background: '#eff6ff' },
  { label: 'REPLIES THIS WEEK', value: '0', icon: Mail, background: '#d1fae5' },
  { label: 'PAUSED (STICKY)', value: '0', icon: ShieldCheck, background: '#fee2e2' },
];

export const ingestionPipelines: IngestionPipeline[] = [
  { name: 'R2B2 Webhook', count: '0', color: '#4285f4' },
  { name: 'LinkedIn Bulk Upload', count: '14', color: '#94a3b8' },
  { name: 'Clay Enriched', count: '14', color: '#10b981' },
  { name: 'Synced to HubSpot', count: '14', color: '#f97316' },
];

export const prospects: ProspectPreview[] = [
  { name: "James O'Brien", company: 'Ramp', title: 'Decision Maker', email: 'j.obrien@ramp.com', source: 'Bulk upload' },
  { name: 'Elena Park', company: 'Retool', title: 'Decision Maker', email: 'elena@retool.com', source: 'Bulk upload' },
  { name: 'Diego Alvarez', company: 'Clay', title: 'Decision Maker', email: 'diego@clay.com', source: 'Bulk upload' },
  { name: 'Karen Wu', company: 'Mercury', title: 'Decision Maker', email: 'karen@mercury.com', source: 'Bulk upload' },
  { name: 'Robert Singh', company: 'PostHog', title: 'Decision Maker', email: 'robert@posthog.com', source: 'Bulk upload' },
  { name: 'Megan Flores', company: 'Brex', title: 'Decision Maker', email: 'megan@brex.com', source: 'Bulk upload' },
  { name: 'Tom Becker', company: 'Anthropic', title: 'Decision Maker', email: 'tom@anthropic.com', source: 'Bulk upload' },
  { name: 'Lina Hoffmann', company: 'Loom', title: 'Decision Maker', email: 'lina@loom.com', source: 'Bulk upload' },
  { name: 'Jordan Pham', company: 'Figma', title: 'Decision Maker', email: 'jordan@figma.com', source: 'Bulk upload' },
  { name: 'Ava Nakamura', company: 'Webflow', title: 'Decision Maker', email: 'ava@webflow.com', source: 'Bulk upload' },
];

export const integrations: IntegrationItem[] = [
  { name: 'R2B2', description: 'Anonymous visitor to LinkedIn match', category: 'LEAD SOURCES', icon: Link2, background: '#ede9fe' },
  { name: 'LinkedIn Sales Navigator', description: 'Import leads and saved lists', category: 'LEAD SOURCES', icon: Building2, background: '#e0f2fe' },
  { name: 'Clay', description: 'Social listening plus funding signals', category: 'ENRICHMENT', icon: Sparkles, background: '#d1fae5', connected: true },
  { name: 'ZoomInfo', description: 'Work email plus direct dial', category: 'ENRICHMENT', icon: Inbox, background: '#e0f2fe' },
  { name: 'Lusha', description: 'B2B email and phone enrichment', category: 'ENRICHMENT', icon: Mail, background: '#ffedd5' },
  { name: 'Apollo.io', description: 'Email, mobile, and intent signals', category: 'ENRICHMENT', icon: Send, background: '#f3e8ff' },
  { name: 'Hunter.io', description: 'Email finder and verifier', category: 'ENRICHMENT', icon: Search, background: '#fef3c7' },
  { name: 'HubSpot', description: 'Sync contacts and deals to your CRM', category: 'CRM', icon: Inbox, background: '#fee2e2' },
];

export const auditRows: AuditLogRow[] = [
  { date: '08/07/2026', time: '15:52:38', action: 'APPROVED', prospectName: 'Priya Raman', previousStatus: 'Pending', nextStatus: 'Approved', actorEmail: 'ashetty@xtsworld.in' },
  { date: '08/07/2026', time: '15:37:15', action: 'REJECTED', prospectName: 'Marcus Bell', previousStatus: 'Approved', nextStatus: 'Rejected', actorEmail: 'ashetty@xtsworld.in' },
  { date: '08/07/2026', time: '15:36:47', action: 'RE-QUEUED', prospectName: 'Marcus Bell', previousStatus: 'Rejected', nextStatus: 'Pending', actorEmail: 'ashetty@xtsworld.in' },
  { date: '08/07/2026', time: '15:36:45', action: 'REJECTED', prospectName: 'Marcus Bell', previousStatus: 'Approved', nextStatus: 'Rejected', actorEmail: 'ashetty@xtsworld.in' },
  { date: '08/07/2026', time: '15:36:44', action: 'APPROVED', prospectName: 'Marcus Bell', previousStatus: 'Pending', nextStatus: 'Approved', actorEmail: 'ashetty@xtsworld.in' },
  { date: '08/07/2026', time: '15:36:42', action: 'REJECTED', prospectName: 'Sarah Chen', previousStatus: 'Approved', nextStatus: 'Rejected', actorEmail: 'ashetty@xtsworld.in' },
  { date: '08/07/2026', time: '15:36:41', action: 'APPROVED', prospectName: 'Sarah Chen', previousStatus: 'Pending', nextStatus: 'Approved', actorEmail: 'ashetty@xtsworld.in' },
  { date: '08/07/2026', time: '15:35:37', action: 'RE-QUEUED', prospectName: 'Marcus Bell', previousStatus: 'Rejected', nextStatus: 'Pending', actorEmail: 'ashetty@xtsworld.in' },
];
