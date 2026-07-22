import { useCallback, useEffect, useState } from "react";
import { Search, UserPlus, Users, UserCheck, MailWarning, Ban } from "lucide-react";

import * as teamApi from "../../services/teamService";
import { useAuth } from "../../context/authStore";
import {
  ACCOUNT_STATUS,
  PERMISSIONS,
  ROLE_LIST,
} from "../../constants/permissions";
import { formatDate } from "../../utils/format";

import PageHeader from "../../components/ui/PageHeader";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import UserAvatar from "../../components/team/UserAvatar";
import RoleBadge from "../../components/team/RoleBadge";
import StatusPill from "../../components/team/StatusPill";
import MemberActionsMenu from "../../components/team/MemberActionsMenu";
import InviteMemberModal from "../../components/team/InviteMemberModal";
import ChangeRoleModal from "../../components/team/ChangeRoleModal";

const STAT_CARDS = [
  { key: "total", label: "Total members", icon: Users },
  { key: "active", label: "Active", icon: UserCheck },
  { key: "invited", label: "Invites pending", icon: MailWarning },
  { key: "disabled", label: "Disabled", icon: Ban },
];

const selectClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

const headerClass =
  "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

const TeamMembers = () => {
  const { user, hasPermission } = useAuth();

  const canInvite = hasPermission(PERMISSIONS.TEAM_INVITE);
  const canManage = hasPermission(PERMISSIONS.TEAM_MANAGE);

  const [members, setMembers] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [roleTarget, setRoleTarget] = useState(null);

  const loadTeam = useCallback(async () => {
    try {
      const res = await teamApi.getTeamMembers(filters);
      setMembers(res.data.members || []);
      setStats(res.data.stats || {});
      setError("");
    } catch (err) {
      console.error("Error loading team", err);
      setError(
        err?.response?.data?.message || "Unable to load the team. Please retry."
      );
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const loadMembers = async () => {
      await loadTeam();
    };

    loadMembers();
  }, [loadTeam]);

  /* -------------------------------------------------------------- actions */

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  /** Wraps a mutation with shared error handling and a reload. */
  const runAction = async (action, successMessage) => {
    try {
      const res = await action();
      setNotice(res?.data?.message || successMessage);
      setError("");
      await loadTeam();
    } catch (err) {
      setError(err?.response?.data?.message || "That action failed.");
      setNotice("");
    }
  };

  const handleInvite = async (payload) => {
    const res = await teamApi.inviteMember(payload);
    setNotice(res.data.message);
    await loadTeam();
  };

  const handleResendInvite = (member) =>
    runAction(
      () => teamApi.resendInvite(member.id),
      `Invitation resent to ${member.email}.`
    );

  const handleChangeRole = async (role) => {
    const res = await teamApi.updateMemberRole(roleTarget.id, role);
    setNotice(res.data.message);
    await loadTeam();
  };

  const handleToggleStatus = (member) => {
    const nextStatus =
      member.status === ACCOUNT_STATUS.DISABLED
        ? ACCOUNT_STATUS.ACTIVE
        : ACCOUNT_STATUS.DISABLED;

    if (nextStatus === ACCOUNT_STATUS.DISABLED) {
      const confirmed = window.confirm(
        `Disable ${member.name}? They will be signed out immediately and cannot sign back in.`
      );
      if (!confirmed) return;
    }

    runAction(() => teamApi.updateMemberStatus(member.id, nextStatus));
  };

  const handleRemove = (member) => {
    const confirmed = window.confirm(
      `Remove ${member.name} from the team? This cannot be undone.`
    );
    if (!confirmed) return;

    runAction(() => teamApi.removeMember(member.id));
  };

  /* --------------------------------------------------------------- render */

  const renderRowActions = (member) => (
    <MemberActionsMenu
      member={member}
      isSelf={member.id === user?.id}
      canManage={canManage}
      canInvite={canInvite}
      onChangeRole={() => setRoleTarget(member)}
      onResendInvite={() => handleResendInvite(member)}
      onToggleStatus={() => handleToggleStatus(member)}
      onRemove={() => handleRemove(member)}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Team" },
        ]}
        title="Team members"
        subtitle="Invite colleagues and control what each of them can access."
        onRefresh={loadTeam}
        actions={
          canInvite && (
            <Button icon={UserPlus} onClick={() => setIsInviteOpen(true)}>
              <span className="hidden sm:inline">Invite member</span>
            </Button>
          )
        }
      />

      {error && (
        <Alert variant="error" onDismiss={() => setError("")}>
          {error}
        </Alert>
      )}
      {notice && (
        <Alert variant="success" onDismiss={() => setNotice("")}>
          {notice}
        </Alert>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map(({ key, label, icon: Icon }) => (
          <div
            key={key}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  {stats[key] ?? 0}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <select
            value={filters.role}
            onChange={(event) => updateFilter("role", event.target.value)}
            className={selectClass}
          >
            <option value="all">All roles</option>
            {ROLE_LIST.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className={selectClass}
          >
            <option value="all">All statuses</option>
            <option value={ACCOUNT_STATUS.ACTIVE}>Active</option>
            <option value={ACCOUNT_STATUS.INVITED}>Invite pending</option>
            <option value={ACCOUNT_STATUS.DISABLED}>Disabled</option>
          </select>
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className={headerClass}>Member</th>
                <th className={headerClass}>Role</th>
                <th className={headerClass}>Status</th>
                <th className={headerClass}>Last active</th>
                <th className={headerClass}>Joined</th>
                <th className={`${headerClass} text-right`}>Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {members.map((member) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={member.name} src={member.avatar} />
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-white">
                          {member.name}
                          {member.id === user?.id && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              You
                            </span>
                          )}
                        </p>
                        <p className="truncate text-sm text-slate-500 dark:text-slate-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <RoleBadge role={member.role} />
                  </td>

                  <td className="px-4 py-3">
                    <StatusPill status={member.status} />
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                    {member.lastLoginAt ? formatDate(member.lastLoginAt) : "Never"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(member.createdAt)}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {renderRowActions(member)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isLoading && members.length === 0 && (
            <p className="px-4 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
              No members match your filters.
            </p>
          )}
          {isLoading && (
            <p className="px-4 py-16 text-center text-sm text-slate-400">
              Loading team...
            </p>
          )}
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="space-y-3 lg:hidden">
        {isLoading ? (
          <p className="py-10 text-center text-sm text-slate-400">
            Loading team...
          </p>
        ) : members.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-white py-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            No members match your filters.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start gap-3">
                <UserAvatar name={member.name} src={member.avatar} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {member.name}
                    {member.id === user?.id && " (You)"}
                  </p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {member.email}
                  </p>
                </div>

                {renderRowActions(member)}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <RoleBadge role={member.role} />
                <StatusPill status={member.status} />
                <span className="text-xs text-slate-400">
                  Joined {formatDate(member.createdAt)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />

      <ChangeRoleModal
        member={roleTarget}
        onClose={() => setRoleTarget(null)}
        onSave={handleChangeRole}
      />
    </div>
  );
};

export default TeamMembers;
