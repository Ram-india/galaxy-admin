import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, X } from "lucide-react";

import useEnquiries from "../../hooks/useEnquiries";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";
import { exportToCsv } from "../../utils/exportCsv";
import { PAGE_SIZE } from "../../constants/enquiry";
import { formatDateTime } from "../../utils/format";

import PageHeader from "../../components/ui/PageHeader";
import EnquiryStats from "../../components/enquiry/EnquiryStats";
import EnquiryFilters from "../../components/enquiry/EnquiryFilters";
import EnquiryTable from "../../components/enquiry/EnquiryTable";
import EnquiryCards from "../../components/enquiry/EnquiryCards";
import Pagination from "../../components/ui/Pagination";
import StatusUpdateModal from "../../components/enquiry/StatusUpdateModal";
import { StatsSkeleton } from "../../components/enquiry/LoadingSkeleton";

/** Column definition used by the CSV export. */
const EXPORT_COLUMNS = [
  { key: "fullName", label: "Customer Name" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "projectType", label: "Project Type" },
  { key: "installationType", label: "Installation Type" },
  { key: "requirement", label: "Requirement" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created At", format: formatDateTime },
];

const EnquiryList = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  // Read-only roles see the list without the write actions
  const canUpdate = hasPermission(PERMISSIONS.ENQUIRY_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.ENQUIRY_DELETE);
  const canExport = hasPermission(PERMISSIONS.ENQUIRY_EXPORT);

  const {
    filteredEnquiries,
    paginatedEnquiries,
    stats,
    isLoading,
    isRefreshing,
    error,
    filters,
    isFiltered,
    updateFilter,
    clearFilters,
    currentPage,
    totalPages,
    setCurrentPage,
    selectedIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    refresh,
    changeStatus,
    removeEnquiry,
  } = useEnquiries();

  // Enquiry currently open in the status modal (null = closed)
  const [statusTarget, setStatusTarget] = useState(null);
  const [isSavingStatus, setIsSavingStatus] = useState(false);

  const handleView = (enquiry) => navigate(`/enquiries/${enquiry._id}`);

  const handleSaveStatus = async (status) => {
    setIsSavingStatus(true);
    try {
      await changeStatus(statusTarget._id, status);
      setStatusTarget(null);
    } catch (err) {
      console.error("Error updating status", err);
      alert(err?.response?.data?.message || "Could not update the status.");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const handleDelete = async (enquiry) => {
    const confirmed = window.confirm(
      `Delete the enquiry from ${enquiry.fullName}? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await removeEnquiry(enquiry._id);
    } catch (err) {
      console.error("Error deleting enquiry", err);
      alert(err?.response?.data?.message || "Could not delete the enquiry.");
    }
  };

  // Exports the current filtered result set, not just the visible page
  const handleExport = () =>
    exportToCsv(filteredEnquiries, EXPORT_COLUMNS, "enquiries");

  // Props shared by the desktop table and the mobile cards
  const listProps = {
    enquiries: paginatedEnquiries,
    isLoading,
    selectedIds,
    onToggleSelect: toggleSelect,
    onView: handleView,
    onUpdateStatus: canUpdate ? setStatusTarget : null,
    onDelete: canDelete ? handleDelete : null,
    isFiltered,
    onClearFilters: clearFilters,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Enquiries" },
        ]}
        title="Customer Enquiries"
        subtitle="Manage all enquiries submitted from the website."
        onExport={canExport ? handleExport : undefined}
        onRefresh={refresh}
        isRefreshing={isRefreshing}
      />

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {isLoading ? <StatsSkeleton /> : <EnquiryStats stats={stats} />}

      <EnquiryFilters
        filters={filters}
        onChange={updateFilter}
        onClear={clearFilters}
        isFiltered={isFiltered}
      />

      {/* Bulk-selection bar — appears once rows are checked */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm dark:border-blue-500/30 dark:bg-blue-500/10">
          <span className="font-medium text-blue-800 dark:text-blue-300">
            {selectedIds.length} selected
          </span>
          <button
            onClick={clearSelection}
            className="inline-flex items-center gap-1 text-blue-700 transition-colors hover:text-blue-900 dark:text-blue-300"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        </div>
      )}

      {/* Desktop table / mobile cards — each hides itself at the breakpoint */}
      <EnquiryTable {...listProps} onToggleSelectAll={toggleSelectAll} />
      <EnquiryCards {...listProps} />

      {!isLoading && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredEnquiries.length}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}

      <StatusUpdateModal
        enquiry={statusTarget}
        onClose={() => setStatusTarget(null)}
        onSave={handleSaveStatus}
        isSaving={isSavingStatus}
      />
    </div>
  );
};

export default EnquiryList;
