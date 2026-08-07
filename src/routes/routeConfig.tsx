import {
  LearnRouteActiveSequencesPage,
  LearnRouteApprovalsPage,
  LearnRouteAuditLogPage,
  LearnRouteCampaignsPage,
  LearnRouteConnectedInboxesPage,
  LearnRouteDashboardPage,
  LearnRouteInboxHubPage,
  LearnRoutePerformancePage,
  LearnRouteSequenceBuilderPage,
  LearnRouteSettingsPage,
  LearnRouteTemplatesPage,
  LearnRouteVerificationQueuePage,
} from '@/Features/LeadRoute/LeadRouteApp';
import { ROUTES } from '@/constants/route.constants';
import type { AppRoute } from '@/types/route.types';

export const routeConfig: AppRoute[] = [
  { path: ROUTES.DASHBOARD, element: <LearnRouteDashboardPage />, layout: 'app', isProtected: false },
  {
    path: ROUTES.VERIFICATION_QUEUE,
    element: <LearnRouteVerificationQueuePage />,
    layout: 'app',
    isProtected: false,
  },
  { path: ROUTES.APPROVALS, element: <LearnRouteApprovalsPage />, layout: 'app', isProtected: false },
  { path: ROUTES.AUDIT_LOG, element: <LearnRouteAuditLogPage />, layout: 'app', isProtected: false },
  { path: ROUTES.PERFORMANCE, element: <LearnRoutePerformancePage />, layout: 'app', isProtected: false },
  { path: ROUTES.CAMPAIGNS, element: <LearnRouteCampaignsPage />, layout: 'app', isProtected: false },
  {
    path: ROUTES.SEQUENCE_BUILDER,
    element: <LearnRouteSequenceBuilderPage />,
    layout: 'app',
    isProtected: false,
  },
  { path: ROUTES.TEMPLATES, element: <LearnRouteTemplatesPage />, layout: 'app', isProtected: false },
  {
    path: ROUTES.ACTIVE_SEQUENCES,
    element: <LearnRouteActiveSequencesPage />,
    layout: 'app',
    isProtected: false,
  },
  {
    path: ROUTES.CONNECTED_INBOXES,
    element: <LearnRouteConnectedInboxesPage />,
    layout: 'app',
    isProtected: false,
  },
  { path: ROUTES.INBOX_HUB, element: <LearnRouteInboxHubPage />, layout: 'app', isProtected: false },
  { path: ROUTES.SETTINGS, element: <LearnRouteSettingsPage />, layout: 'app', isProtected: false },
];
