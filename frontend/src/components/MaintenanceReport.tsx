import { Printer, Download, X, GraduationCap } from 'lucide-react';
import type { MaintenanceReport } from '@/types';
import StatusBadge from './StatusBadge';

interface MaintenanceReportProps {
  report: MaintenanceReport;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function MaintenanceReportView({ report, onClose }: MaintenanceReportProps) {
  const handlePrint = () => window.print();

  const handleDownload = () => {
    const content = [
      'UNIVERSITY EQUIPMENT MAINTENANCE REPORT',
      '=======================================',
      '',
      `Report ID: ${report.id}`,
      `Equipment ID: ${report.equipmentId}`,
      `Equipment Type: ${report.equipment}`,
      `Location: ${report.location}`,
      `Condition: ${report.condition}`,
      `AI Confidence: ${report.confidence.toFixed(1)}%`,
      `Inspection Date: ${report.inspectionDate}`,
      `Priority: ${report.priority}`,
      `Maintenance Required: ${report.maintenanceRequired ? 'Yes' : 'No'}`,
      `Inspector: ${report.inspector}`,
      '',
      'AI Recommendation:',
      report.recommendation,
      '',
      `Status: ${report.status}`,
    ].join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="no-print flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-900">Maintenance Report</h3>
        <div className="flex items-center gap-2">
          <button onClick={handlePrint} className="btn-secondary !py-1.5">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button onClick={handleDownload} className="btn-secondary !py-1.5">
            <Download className="w-4 h-4" /> Download
          </button>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="print-area overflow-y-auto px-6 py-6 flex-1">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 pb-5 border-b border-gray-200">
            <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-blue-700">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900">University Equipment Maintenance Report</p>
              <p className="text-xs text-gray-500">Facilities & Asset Management Department</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <Field label="Report ID" value={report.id} />
            <Field label="Equipment ID" value={report.equipmentId} />
            <Field label="Equipment Type" value={report.equipment} />
            <Field label="Location" value={report.location} />
            <Field label="Condition" value={<StatusBadge variant="condition" value={report.condition} />} />
            <Field label="AI Confidence" value={`${report.confidence.toFixed(1)}%`} />
            <Field label="Inspection Date" value={report.inspectionDate} />
            <Field label="Priority" value={<StatusBadge variant="priority" value={report.priority} />} />
            <Field
              label="Maintenance Required"
              value={report.maintenanceRequired ? 'Yes' : 'No'}
            />
            <Field label="Inspector" value={report.inspector} />
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Issue Identified</p>
            <p className="mt-1 text-sm text-gray-900">{report.issue}</p>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">AI Recommendation</p>
            <p className="mt-1 text-sm text-gray-700 leading-relaxed">{report.recommendation}</p>
          </div>

          <div className="mt-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Status</p>
            <div className="mt-1.5"><StatusBadge variant="status" value={report.status} /></div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-200 flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500">Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="text-xs text-gray-400 mt-0.5">EquipAI — University Equipment Condition Detection System</p>
            </div>
            <div className="text-right">
              <div className="w-32 border-b border-gray-300" />
              <p className="text-[11px] text-gray-500 mt-1">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
