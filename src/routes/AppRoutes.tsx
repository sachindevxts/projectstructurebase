import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ROUTES } from '@/constants/route.constants';
import { RouteFallback } from './RouteFallback';
import { LeadRouteLayout } from '@/Features/LeadRoute/LeadRouteLayout';
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

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<LeadRouteLayout />}>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.LOGIN} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<LearnRouteDashboardPage />} />
          <Route path={ROUTES.VERIFICATION_QUEUE} element={<LearnRouteVerificationQueuePage />} />
          <Route path={ROUTES.APPROVALS} element={<LearnRouteApprovalsPage />} />
          <Route path={ROUTES.AUDIT_LOG} element={<LearnRouteAuditLogPage />} />
          <Route path={ROUTES.PERFORMANCE} element={<LearnRoutePerformancePage />} />
          <Route path={ROUTES.CAMPAIGNS} element={<LearnRouteCampaignsPage />} />
          <Route path={ROUTES.SEQUENCE_BUILDER} element={<LearnRouteSequenceBuilderPage />} />
          <Route path={ROUTES.TEMPLATES} element={<LearnRouteTemplatesPage />} />
          <Route path={ROUTES.ACTIVE_SEQUENCES} element={<LearnRouteActiveSequencesPage />} />
          <Route path={ROUTES.CONNECTED_INBOXES} element={<LearnRouteConnectedInboxesPage />} />
          <Route path={ROUTES.INBOX_HUB} element={<LearnRouteInboxHubPage />} />
          <Route path={ROUTES.SETTINGS} element={<LearnRouteSettingsPage />} />
        </Route>
        <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      </Routes>
    </Suspense>
  );
};
