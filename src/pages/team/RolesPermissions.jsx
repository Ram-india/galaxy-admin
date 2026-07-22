import { Fragment, useEffect, useState } from "react";
import { Check, Minus, Users } from "lucide-react";

import * as teamApi from "../../services/teamService";
import { PERMISSION_GROUPS } from "../../constants/permissions";

import PageHeader from "../../components/ui/PageHeader";
import Alert from "../../components/ui/Alert";
import RoleBadge from "../../components/team/RoleBadge";

/**
 * Read-only view of the role model.
 *
 * Roles are defined in server/config/permissions.js rather than the database,
 * so this page documents and verifies them instead of editing them — the matrix
 * is rendered from what the server actually reports.
 */
const RolesPermissions = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isStale = false;

    const loadRoles = async () => {
      try {
        const res = await teamApi.getRoles();
        if (isStale) return;
        setRoles(res.data.roles || []);
      } catch (err) {
        if (isStale) return;
        setError(
          err?.response?.data?.message || "Unable to load roles."
        );
      } finally {
        if (!isStale) setIsLoading(false);
      }
    };

    loadRoles();

    return () => {
      isStale = true;
    };
  }, []);

  const roleHasPermission = (role, permissionKey) =>
    role.permissions?.includes(permissionKey);

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Roles & permissions" },
        ]}
        title="Roles & permissions"
        subtitle="What each role can do. Assign roles from the Team page."
      />

      {error && <Alert variant="error">{error}</Alert>}

      {isLoading ? (
        <p className="py-16 text-center text-sm text-slate-400">
          Loading roles...
        </p>
      ) : (
        <>
          {/* ROLE CARDS */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roles.map((role) => (
              <div
                key={role.name}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between">
                  <RoleBadge role={role.name} />
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <Users className="h-3.5 w-3.5" />
                    {role.memberCount}
                  </span>
                </div>

                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {role.description}
                </p>

                <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
                  {role.permissions.length} permissions granted
                </p>
              </div>
            ))}
          </div>

          {/* PERMISSION MATRIX */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Permission matrix
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Enforced on the server for every request, not just hidden in the UI.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Permission
                    </th>
                    {roles.map((role) => (
                      <th
                        key={role.name}
                        className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                      >
                        {role.name}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {PERMISSION_GROUPS.map((group) => (
                    <Fragment key={group.module}>
                      <tr className="bg-slate-50/60 dark:bg-slate-800/30">
                        <td
                          colSpan={roles.length + 1}
                          className="px-5 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                        >
                          {group.module}
                        </td>
                      </tr>

                      {group.items.map((permission) => (
                        <tr
                          key={permission.key}
                          className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        >
                          <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-200">
                            {permission.label}
                          </td>

                          {roles.map((role) => (
                            <td key={role.name} className="px-4 py-3 text-center">
                              {roleHasPermission(role, permission.key) ? (
                                <Check className="mx-auto h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Minus className="mx-auto h-4 w-4 text-slate-300 dark:text-slate-600" />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RolesPermissions;
