import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAllEnquiries,
  updateEnquiryStatus,
  deleteEnquiry as deleteEnquiryRequest,
} from "../services/enquiryService";
import { PAGE_SIZE } from "../constants/enquiry";

const DEFAULT_FILTERS = {
  search: "",
  projectType: "all",
  status: "all",
  source: "all",
  dateRange: "all",
};

/** Earliest createdAt allowed by a date-range preset, or null for "all". */
const getRangeStart = (dateRange) => {
  if (dateRange === "all") return null;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (dateRange === "today") return start;

  const days = { "7d": 7, "30d": 30, "90d": 90 }[dateRange];
  if (!days) return null;

  start.setDate(start.getDate() - days);
  return start;
};

/**
 * Owns everything the enquiry list needs: fetching, filtering, pagination,
 * selection and the status/delete mutations.
 *
 * Filtering and paging happen client-side — the API returns the full
 * collection today. Move these into query params if the dataset grows.
 */
export const useEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [requestedPage, setRequestedPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  // Every state update happens after the await, so this is safe to call
  // straight from an effect without triggering a cascading render.
  const fetchEnquiries = useCallback(async () => {
    try {
      const res = await getAllEnquiries();
      setEnquiries(Array.isArray(res.data) ? res.data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching enquiries", err);
      setError(
        err?.response?.data?.message || "Unable to load enquiries. Please try again."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialEnquiries = async () => {
      await fetchEnquiries();
    };

    loadInitialEnquiries();
  }, [fetchEnquiries]);

  /** Re-fetches in the background, keeping the current rows on screen. */
  const refresh = () => {
    setIsRefreshing(true);
    fetchEnquiries();
  };

  /* ---------------------------------------------------------------- stats */

  const stats = useMemo(
    () => ({
      total: enquiries.length,
      new: enquiries.filter((item) => item.status === "New").length,
      contacted: enquiries.filter((item) => item.status === "Contacted").length,
      converted: enquiries.filter((item) => item.status === "Converted").length,
    }),
    [enquiries]
  );

  /* ------------------------------------------------------------- filtering */

  const isFiltered = useMemo(
    () =>
      Object.keys(DEFAULT_FILTERS).some(
        (key) => filters[key] !== DEFAULT_FILTERS[key]
      ),
    [filters]
  );

  const filteredEnquiries = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    const rangeStart = getRangeStart(filters.dateRange);

    return enquiries.filter((enquiry) => {
      // Search across name, phone and email
      if (query) {
        const haystack = [enquiry.fullName, enquiry.phone, enquiry.email]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      if (
        filters.projectType !== "all" &&
        enquiry.projectType !== filters.projectType
      ) {
        return false;
      }

      if (filters.status !== "all" && enquiry.status !== filters.status) {
        return false;
      }

      // Absent source is treated as "Website" (the default)
      if (
        filters.source !== "all" &&
        (enquiry.source || "Website") !== filters.source
      ) {
        return false;
      }

      if (rangeStart && new Date(enquiry.createdAt) < rangeStart) return false;

      return true;
    });
  }, [enquiries, filters]);

  /* ------------------------------------------------------------ pagination */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnquiries.length / PAGE_SIZE)
  );

  // Derived rather than stored, so a filter that shrinks the result set
  // cannot leave us stranded on a page that no longer exists.
  const currentPage = Math.min(requestedPage, totalPages);

  const paginatedEnquiries = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredEnquiries.slice(start, start + PAGE_SIZE);
  }, [filteredEnquiries, currentPage]);

  /* ------------------------------------------------------------- selection */

  // Drop selections that are no longer visible on the current page
  const visibleIds = paginatedEnquiries.map((enquiry) => enquiry._id);
  const selectedVisibleIds = selectedIds.filter((id) => visibleIds.includes(id));

  const toggleSelect = (id) =>
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds(
      selectedVisibleIds.length === visibleIds.length ? [] : visibleIds
    );

  const clearSelection = () => setSelectedIds([]);

  /* ------------------------------------------------------------- mutations */

  const changeStatus = async (id, status) => {
    const res = await updateEnquiryStatus(id, status);
    // Patch locally instead of refetching the whole collection
    setEnquiries((current) =>
      current.map((enquiry) =>
        enquiry._id === id ? { ...enquiry, ...res.data } : enquiry
      )
    );
  };

  const removeEnquiry = async (id) => {
    await deleteEnquiryRequest(id);
    setEnquiries((current) => current.filter((enquiry) => enquiry._id !== id));
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
  };

  /* ---------------------------------------------------------------- filter */

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setRequestedPage(1); // a changed filter invalidates the current page
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setRequestedPage(1);
  };

  return {
    // data
    enquiries,
    filteredEnquiries,
    paginatedEnquiries,
    stats,
    // status
    isLoading,
    isRefreshing,
    error,
    // filters
    filters,
    isFiltered,
    updateFilter,
    clearFilters,
    // pagination
    currentPage,
    totalPages,
    setCurrentPage: setRequestedPage,
    // selection
    selectedIds: selectedVisibleIds,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    // actions
    refresh,
    changeStatus,
    removeEnquiry,
  };
};

export default useEnquiries;
