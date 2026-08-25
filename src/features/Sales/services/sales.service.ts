import { unwrapApiData, type ApiEnvelope } from '@/api/apiResponse';
import { api } from '@/api/client/apiClient';
import { API_ENDPOINTS } from '@/constants/api.constants';

export interface SalesDeal {
  id: string;
  company: string;
  title: string;
  amount: string;
  probability: string;
  tag: string;
  ownerAvatar: string;
}

export interface SalesPipelineColumn {
  id: string;
  title: string;
  count: number;
  value: string;
  deals: SalesDeal[];
}

export interface SalesPipelineResponse {
  filters: {
    owner: string;
    dealSize: string;
    expectedClose: string;
  };
  totalWeighted: string;
  columns: SalesPipelineColumn[];
}

export interface InvoiceCollectionResponse {
  period: string;
  summary: {
    totalInvoiced: string;
    collected: string;
    outstanding: string;
    overdueAmount: string;
    avgCollectionPeriod: string;
  };
  ageing: Array<{ label: string; value: number; color: string }>;
  insights: Array<{
    id: string;
    value: string;
    title: string;
    note: string;
    action: string;
  }>;
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    client: string;
    project: string;
    issueDate: string;
    dueDate: string;
    amount: string;
    outstanding: string;
    status: string;
    ageing: string;
    owner: string;
    ownerAvatar: string;
  }>;
  updatedAt: string;
}

const getPipeline = async (params: {
  owner?: string;
  dealSize?: string;
  expectedClose?: string;
}) => {
  const response = await api.get<ApiEnvelope<SalesPipelineResponse>>(
    API_ENDPOINTS.SALES.PIPELINE,
    { params },
  );
  return unwrapApiData(response.data);
};

const getInvoicesCollections = async (period = 'q3') => {
  const response = await api.get<ApiEnvelope<InvoiceCollectionResponse>>(
    API_ENDPOINTS.SALES.INVOICES_COLLECTIONS,
    { params: { period } },
  );
  return unwrapApiData(response.data);
};

export const salesService = {
  getPipeline,
  getInvoicesCollections,
};
