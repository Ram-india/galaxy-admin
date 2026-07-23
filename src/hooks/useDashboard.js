import { useCallback, useEffect, useState } from "react";

import { useAuth } from "../context/authStore";
import { PERMISSIONS } from "../constants/permissions";
import { ENQUIRY_STATUSES } from "../constants/enquiry";
import { getAllProjects } from "../services/projectService";
import { getAllEnquiries } from "../services/enquiryService";
import { getBlogs } from "../services/blogService";
import { getTeamMembers } from "../services/teamService";

/**
 * Composes the dashboard from the existing list endpoints rather than a
 * dedicated summary route.
 *
 * Each source is fetched only if the current role may read it, and a single
 * failed source degrades to zeros instead of blanking the whole page — the
 * dashboard is a read-only overview, so partial data is better than none.
 */
export const useDashboard = () => {
  const { hasPermission } = useAuth();

  const canProjects = hasPermission(PERMISSIONS.PROJECT_VIEW);
  const canEnquiries = hasPermission(PERMISSIONS.ENQUIRY_VIEW);
  const canBlogs = hasPermission(PERMISSIONS.BLOG_VIEW);
  const canTeam = hasPermission(PERMISSIONS.TEAM_VIEW);

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const load = useCallback(async () => {
    // Only request what this role is allowed to see
    const [projects, enquiries, blogs, team] = await Promise.all([
      canProjects ? getAllProjects().catch(() => null) : null,
      canEnquiries ? getAllEnquiries().catch(() => null) : null,
      canBlogs ? getBlogs().catch(() => null) : null,
      canTeam ? getTeamMembers().catch(() => null) : null,
    ]);

    const projectList = Array.isArray(projects?.data) ? projects.data : [];
    const enquiryList = Array.isArray(enquiries?.data) ? enquiries.data : [];
    const blogStats = blogs?.data?.stats || {};
    const teamStats = team?.data?.stats || {};

    // Enquiry pipeline: a count for every status, so the UI can render a full
    // funnel even when some buckets are empty.
    const enquiryByStatus = ENQUIRY_STATUSES.map((status) => ({
      status,
      count: enquiryList.filter((item) => item.status === status).length,
    }));

    setData({
      permissions: {
        projects: canProjects,
        enquiries: canEnquiries,
        blogs: canBlogs,
        team: canTeam,
      },
      stats: {
        projects: projectList.length,
        completedProjects: projectList.filter((p) => p.status === "Completed")
          .length,
        enquiries: enquiryList.length,
        newEnquiries: enquiryList.filter((e) => e.status === "New").length,
        publishedPosts: blogStats.published ?? 0,
        draftPosts: blogStats.draft ?? 0,
        teamMembers: teamStats.total ?? 0,
      },
      enquiryByStatus,
      // Newest five of each, already sorted by the source endpoints
      recentEnquiries: enquiryList.slice(0, 5),
      recentProjects: projectList.slice(0, 5),
    });

    setIsLoading(false);
    setIsRefreshing(false);
  }, [canProjects, canEnquiries, canBlogs, canTeam]);

  useEffect(() => {
    const loadDashboard = async () => {
      await load();
    };

    loadDashboard();
  }, [load]);

  const refresh = () => {
    setIsRefreshing(true);
    load();
  };

  return { data, isLoading, isRefreshing, refresh };
};

export default useDashboard;
