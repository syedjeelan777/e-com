import React from 'react';
import { CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';
import { IStatusHistory } from '../../types';
import { formatDateTime } from '../../utils/formatters';

interface OrderTimelineProps {
  status: string;
  statusHistory?: IStatusHistory[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ status, statusHistory = [] }) => {
  const steps = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const isCancelled = status === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl p-5 flex items-center gap-3 text-rose-800 dark:text-rose-200">
        <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider">Order Cancelled</h4>
          <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">
            This order was cancelled. Any deducted stock has been automatically returned to inventory.
          </p>
        </div>
      </div>
    );
  }

  const currentStepIdx = steps.indexOf(status);

  return (
    <div className="bg-white dark:bg-industrial-900 border border-gray-200 dark:border-industrial-800 rounded-2xl p-6 shadow-xs">
      <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-900 dark:text-white mb-6">
        Fulfillment Status Timeline
      </h4>

      <div className="relative flex items-center justify-between max-w-2xl mx-auto">
        {/* Connecting Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 dark:bg-industrial-800 w-full z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 z-0"
          style={{
            width: `${(Math.max(0, currentStepIdx) / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Timeline Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = idx <= currentStepIdx;
          const isCurrent = idx === currentStepIdx;
          const historyItem = statusHistory.find((h) => h.status === step);

          return (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isCompleted
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950'
                    : 'bg-gray-100 dark:bg-industrial-800 text-gray-400 border border-gray-300 dark:border-industrial-700'
                }`}
              >
                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
              </div>
              <span
                className={`text-[11px] font-bold uppercase tracking-wider mt-2 ${
                  isCurrent
                    ? 'text-brand-600 dark:text-brand-400'
                    : isCompleted
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400'
                }`}
              >
                {step}
              </span>
              {historyItem && (
                <span className="text-[9px] text-gray-400 font-medium mt-0.5">
                  {formatDateTime(historyItem.timestamp)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
