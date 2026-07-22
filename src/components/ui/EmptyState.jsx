import { Inbox } from "lucide-react";

/**
 * Generic "nothing here" panel. `action` renders a button below the copy.
 */
const EmptyState = ({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      <Icon className="h-7 w-7 text-slate-400 dark:text-slate-500" />
    </div>

    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
      {title}
    </h3>

    {description && (
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    )}

    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
