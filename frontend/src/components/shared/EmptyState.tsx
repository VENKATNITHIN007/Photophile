import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
      {icon ? <div className="mx-auto mb-4 h-12 w-12 text-gray-400">{icon}</div> : null}
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      {description ? <p className="text-gray-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
