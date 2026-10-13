export type Condition = 'Normal' | 'Damaged' | 'Uncertain';
export type MaintenanceStatus = 'Pending' | 'In Progress' | 'Resolved';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Equipment {
  id: string;
  name: string;
  category: string;
  location: string;
  condition: Condition;
  status: 'Active' | 'Inactive' | 'Under Maintenance';
  lastInspection: string;
  image?: string;
}

export interface Inspection {
  id: string;
  equipmentId: string;
  equipment: string;
  image: string;
  prediction: Condition;
  confidence: number;
  inspector: string;
  date: string;
  status: MaintenanceStatus;
  recommendation?: string;
}

export interface MaintenanceReport {
  id: string;
  equipmentId: string;
  equipment: string;
  location: string;
  issue: string;
  priority: Priority;
  date: string;
  status: MaintenanceStatus;
  condition: Condition;
  confidence: number;
  inspectionDate: string;
  maintenanceRequired: boolean;
  recommendation: string;
  inspector: string;
}

export interface PredictionResponse {
  equipment: string;
  condition: Condition;
  confidence: number;
  maintenance_required: boolean;
  priority: Priority;
  recommendation?: string;
}
