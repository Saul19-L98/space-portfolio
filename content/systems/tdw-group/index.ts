import type { System } from "@/content/schema";
import { parseDate } from "@/lib/time";
import { supplierPortalRpa } from "./planets/supplier-portal-rpa";
import { tradeDataPipelines } from "./planets/trade-data-pipelines";
import { shelfAuditVisionAgent } from "./planets/shelf-audit-vision-agent";
import { textToSqlAgent } from "./planets/text-to-sql-agent";
import { deploymentStandard } from "./planets/deployment-standard";
import { textToDaxAgent } from "./planets/text-to-dax-agent";
import { catalogueCrawler } from "./planets/catalogue-crawler";
import { insuranceApi } from "./planets/insurance-api";
import { homologationDashboard } from "./planets/homologation-dashboard";
import { sapExtractionEtl } from "./planets/sap-extraction-etl";
import { budgetManagementProduct } from "./planets/budget-management-product";
import { breweryApprovalWorkflow } from "./planets/brewery-approval-workflow";
import { conversationDashboard } from "./planets/conversation-dashboard";
import { whatsappSalesAgentVision } from "./planets/whatsapp-sales-agent-vision";
import { customsTariffApi } from "./planets/customs-tariff-api";
import { eventDrivenPlatform } from "./planets/event-driven-platform";
import { hybridCloudPlatform } from "./planets/hybrid-cloud-platform";
import { genaiAssistantPlatform } from "./planets/genai-assistant-platform";
import { biPortalRollout } from "./planets/bi-portal-rollout";
import { lakehousePlatform } from "./planets/lakehouse-platform";
import { incidentRcas } from "./planets/incident-rcas";
import { demandPlanningOperations } from "./planets/demand-planning-operations";
import { bottlingLineVision } from "./planets/bottling-line-vision";
import { restaurantOccupancyPoc } from "./planets/restaurant-occupancy-poc";

const planets = [
  supplierPortalRpa,
  tradeDataPipelines,
  shelfAuditVisionAgent,
  textToSqlAgent,
  deploymentStandard,
  textToDaxAgent,
  catalogueCrawler,
  insuranceApi,
  homologationDashboard,
  sapExtractionEtl,
  budgetManagementProduct,
  breweryApprovalWorkflow,
  conversationDashboard,
  whatsappSalesAgentVision,
  customsTariffApi,
  eventDrivenPlatform,
  hybridCloudPlatform,
  genaiAssistantPlatform,
  biPortalRollout,
  lakehousePlatform,
  incidentRcas,
  demandPlanningOperations,
  bottlingLineVision,
  restaurantOccupancyPoc,
].sort((a, b) => parseDate(a.start) - parseDate(b.start) || a.slug.localeCompare(b.slug));

export const tdwGroup: System = {
  slug: "tdw-group",
  name: "TDW Group",
  kind: "rich",
  roles: [
    { title: "Cloud Engineer", start: "2025-05", end: "2026-06" },
    { title: "AI Solution Architect", start: "2026-06" },
  ],
  location: "Remote",
  summary:
    "A data-and-AI consultancy serving manufacturers, retailers, utilities and distributors across Central America. Twenty-four missions in sixteen months: data acquisition against hostile sources, Bedrock agents and a multi-tenant GenAI platform, a Terraform lakehouse across a multi-account estate, hybrid cloud platforms, computer vision in production, and the deployment, security and incident work that keeps all of it running.",
  planets,
  galaxyPosition: [120, 0, -20],
};
