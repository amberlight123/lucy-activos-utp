export type ExternalIncident = {
  id: string;
  externalReportId: string;
  origin: "CUSTOUTP" | "SOLICITA" | "OTRO";
  summaryDescription: string;
  referenceStatus: string;
  reportedLocation: string;
  linkedAssetIds: string[];
  reportedAt: string;
  createdAt: string;
};
