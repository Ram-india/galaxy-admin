import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Newspaper,
  FileEdit,
  CheckCircle2,
  Archive,
  ImageIcon,
  Eye,
} from "lucide-react";

import * as blogApi from "../../services/blogService";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";
import {
  BLOG_CATEGORIES,
  BLOG_STATUS_LABELS,
  BLOG_STATUS_LIST,
} from "../../constants/blogs";
import { formatDate } from "../../utils/format";

import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Alert from "../../components/ui/Alert";
import Button from "../../components/ui/Button";
import BlogStatusBadge from "../../components/blogs/BlogStatusBadge";
import BlogActionsMenu from "../../components/blogs/BlogActionsMenu";

const STAT_CARDS = [
  { key: "total", label: "All posts", icon: Newspaper },
  { key: "published", label: "Published", icon: CheckCircle2 },
  { key: "draft", label: "Drafts", icon: FileEdit },
  { key: "archived", label: "Archived", icon: Archive },
];

const selectClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200";

const headerClass =
  "whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400";

const BlogList = () => {
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const canCreate = hasPermission(PERMISSIONS.BLOG_CREATE);
  const canUpdate = hasPermission(PERMISSIONS.BLOG_UPDATE);
  const canDelete = hasPermission(PERMISSIONS.BLOG_DELETE);
  const canPublish = hasPermission(PERMISSIONS.BLOG_PUBLISH);

  // Used for the "View on site" link; unset simply hides it
  const siteUrl = import.meta.env.VITE_SITE_URL || "";

  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    status: "all",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadBlogs = useCallback(async () => {
    try {
      const res = await blogApi.getBlogs(filters);
      setBlogs(res.data.blogs || []);
      setStats(res.data.stats || {});
      setError("");
    } catch (err) {
      console.error("Error loading posts", err);
      setError(err?.response?.data?.message || "Unable to load posts.");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const loadPosts = async () => {
      await loadBlogs();
    };

    loadPosts();
  }, [loadBlogs]);

  const updateFilter = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));

  const handleChangeStatus = async (blog, status) => {
    try {
      const res = await blogApi.updateBlogStatus(blog._id, status);
      setNotice(res.data.message);
      setError("");
      await loadBlogs();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not update the post.");
      setNotice("");
    }
  };

  const handleDelete = async (blog) => {
    const confirmed = window.confirm(
      `Delete "${blog.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      await blogApi.deleteBlog(blog._id);
      setNotice("Post deleted.");
      setError("");
      await loadBlogs();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not delete the post.");
    }
  };

  const isFiltered =
    filters.search !== "" || filters.category !== "all" || filters.status !== "all";

  const renderActions = (blog) => (
    <BlogActionsMenu
      blog={blog}
      siteUrl={siteUrl}
      onEdit={canUpdate ? () => navigate(`/blogs/${blog._id}/edit`) : null}
      onChangeStatus={
        canPublish ? (status) => handleChangeStatus(blog, status) : null
      }
      onDelete={canDelete ? () => handleDelete(blog) : null}
    />
  );

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Blog" },
        ]}
        title="Blog posts"
        subtitle="Write and publish articles that appear on your public website."
        onRefresh={loadBlogs}
        actions={
          canCreate && (
            <Button icon={Plus} onClick={() => navigate("/blogs/new")}>
              <span className="hidden sm:inline">Write post</span>
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
              placeholder="Search posts by title..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <select
            value={filters.category}
            onChange={(event) => updateFilter("category", event.target.value)}
            className={selectClass}
          >
            <option value="all">All categories</option>
            {BLOG_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className={selectClass}
          >
            <option value="all">All statuses</option>
            {BLOG_STATUS_LIST.map((status) => (
              <option key={status} value={status}>
                {BLOG_STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* LIST */}
      {!isLoading && blogs.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <EmptyState
            icon={Newspaper}
            title={isFiltered ? "No matching posts" : "No posts yet"}
            description={
              isFiltered
                ? "Try a different search or filter."
                : "Write your first article — published posts appear on your website automatically."
            }
            action={
              canCreate &&
              !isFiltered && (
                <Button icon={Plus} onClick={() => navigate("/blogs/new")}>
                  Write your first post
                </Button>
              )
            }
          />
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className={headerClass}>Post</th>
                    <th className={headerClass}>Category</th>
                    <th className={headerClass}>Status</th>
                    <th className={headerClass}>Author</th>
                    <th className={headerClass}>Published</th>
                    <th className={headerClass}>Views</th>
                    <th className={`${headerClass} text-right`}>Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {blogs.map((blog, index) => (
                    <tr
                      key={blog._id}
                      className={`transition-colors hover:bg-slate-100/70 dark:hover:bg-slate-800/50 ${
                        index % 2 === 1
                          ? "bg-slate-50/60 dark:bg-slate-800/20"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {blog.coverImage?.url ? (
                            <img
                              src={blog.coverImage.url}
                              alt=""
                              loading="lazy"
                              className="h-11 w-16 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <span className="flex h-11 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-300 dark:bg-slate-800 dark:text-slate-600">
                              <ImageIcon className="h-5 w-5" />
                            </span>
                          )}

                          <div className="min-w-0">
                            <button
                              onClick={() =>
                                canUpdate && navigate(`/blogs/${blog._id}/edit`)
                              }
                              className="block max-w-[22rem] truncate text-left text-sm font-medium text-slate-900 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
                            >
                              {blog.title}
                            </button>
                            <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                              /{blog.slug} · {blog.readingMinutes} min read
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {blog.category}
                      </td>

                      <td className="px-4 py-3">
                        <BlogStatusBadge status={blog.status} />
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                        {blog.author?.name || "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        {blog.publishedAt ? formatDate(blog.publishedAt) : "—"}
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5" />
                          {blog.views || 0}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end">{renderActions(blog)}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isLoading && (
                <p className="px-4 py-16 text-center text-sm text-slate-400">
                  Loading posts...
                </p>
              )}
            </div>
          </div>

          {/* MOBILE CARDS */}
          <div className="space-y-3 lg:hidden">
            {isLoading ? (
              <p className="py-10 text-center text-sm text-slate-400">
                Loading posts...
              </p>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-start gap-3">
                    {blog.coverImage?.url && (
                      <img
                        src={blog.coverImage.url}
                        alt=""
                        loading="lazy"
                        className="h-14 w-20 shrink-0 rounded-lg object-cover"
                      />
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {blog.title}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                        {blog.category} · {blog.readingMinutes} min read
                      </p>
                    </div>

                    {renderActions(blog)}
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <BlogStatusBadge status={blog.status} />
                    <span className="text-xs text-slate-400">
                      {blog.publishedAt
                        ? formatDate(blog.publishedAt)
                        : "Not published"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogList;
