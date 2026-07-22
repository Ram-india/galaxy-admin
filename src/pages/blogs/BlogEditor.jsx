import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Send,
  Upload,
  Trash2,
  ImageIcon,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";

import * as blogApi from "../../services/blogService";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";
import {
  BLOG_CATEGORIES,
  BLOG_STATUS,
  estimateReadingMinutes,
  slugify,
} from "../../constants/blogs";

import PageHeader from "../../components/ui/PageHeader";
import FormField from "../../components/ui/FormField";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import BlogStatusBadge from "../../components/blogs/BlogStatusBadge";
import MarkdownEditor from "../../components/blogs/MarkdownEditor";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: BLOG_CATEGORIES[0],
  tags: "",
  status: BLOG_STATUS.DRAFT,
  metaTitle: "",
  metaDescription: "",
};

const selectClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

const Card = ({ title, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header className="border-b border-slate-200 px-5 py-3.5 dark:border-slate-800">
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
    </header>
    <div className="px-5 py-5">{children}</div>
  </section>
);

/**
 * Create/edit screen for a post. A full page rather than a modal — posts are
 * long-form, and the markdown editor needs the room.
 */
const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasPermission } = useAuth();

  const isEditing = Boolean(id);
  const canPublish = hasPermission(PERMISSIONS.BLOG_PUBLISH);

  const [form, setForm] = useState(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [existingCover, setExistingCover] = useState("");

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // The slug follows the title until the author edits it by hand
  const [isSlugLocked, setIsSlugLocked] = useState(isEditing);

  const fileInputRef = useRef(null);

  /* ------------------------------------------------------------ load */

  const loadBlog = useCallback(async () => {
    try {
      const res = await blogApi.getBlog(id);
      const blog = res.data;

      setForm({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || BLOG_CATEGORIES[0],
        tags: (blog.tags || []).join(", "),
        status: blog.status || BLOG_STATUS.DRAFT,
        metaTitle: blog.seo?.metaTitle || "",
        metaDescription: blog.seo?.metaDescription || "",
      });
      setExistingCover(blog.coverImage?.url || "");
    } catch (err) {
      setError(
        err?.response?.status === 404
          ? "This post no longer exists."
          : "Unable to load this post."
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!isEditing) return;

    const fetchBlog = async () => {
      await loadBlog();
    };

    fetchBlog();
  }, [isEditing, loadBlog]);

  // Object URLs are per-file allocations; release the previous one
  useEffect(
    () => () => {
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    },
    [coverPreview]
  );

  /* ---------------------------------------------------------- handlers */

  const updateField = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleTitleChange = (event) => {
    const title = event.target.value;

    setForm((current) => ({
      ...current,
      title,
      // Keep the URL in step with the title until it is edited directly
      slug: isSlugLocked ? current.slug : slugify(title),
    }));
  };

  const handleCoverChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setError("That image is larger than 4 MB. Please choose a smaller one.");
      return;
    }

    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
    setError("");
    event.target.value = "";
  };

  const buildPayload = (status) => {
    const payload = new FormData();

    payload.append("title", form.title.trim());
    payload.append("slug", form.slug.trim() || slugify(form.title));
    payload.append("excerpt", form.excerpt);
    payload.append("content", form.content);
    payload.append("category", form.category);
    payload.append("tags", JSON.stringify(
      form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    ));
    payload.append("status", status);
    payload.append("metaTitle", form.metaTitle);
    payload.append("metaDescription", form.metaDescription);

    if (coverFile) payload.append("coverImage", coverFile);

    return payload;
  };

  const save = async (status) => {
    if (!form.title.trim()) {
      setError("A title is required.");
      return;
    }

    if (status === BLOG_STATUS.PUBLISHED && !form.content.trim()) {
      setError("Add some content before publishing.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload = buildPayload(status);

      if (isEditing) {
        await blogApi.updateBlog(id, payload);
        setNotice(
          status === BLOG_STATUS.PUBLISHED
            ? "Post published — it is now live on the website."
            : "Draft saved."
        );
        updateField("status", status);
        // A newly uploaded cover is now the stored one
        if (coverFile) {
          setExistingCover(coverPreview);
          setCoverFile(null);
        }
      } else {
        const res = await blogApi.createBlog(payload);
        // Move to the edit URL so further saves update rather than duplicate
        navigate(`/blogs/${res.data.blog._id}/edit`, { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Could not save the post.");
    } finally {
      setIsSaving(false);
    }
  };

  const isPublished = form.status === BLOG_STATUS.PUBLISHED;
  const coverUrl = coverPreview || existingCover;

  if (isLoading) {
    return (
      <div className="py-20 text-center text-sm text-slate-400">
        Loading post...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Blog", to: "/blogs" },
          { label: isEditing ? "Edit post" : "New post" },
        ]}
        title={isEditing ? "Edit post" : "Write a post"}
        subtitle={
          isPublished
            ? "This post is live on your website."
            : "Drafts stay private until you publish them."
        }
        actions={
          <>
            <Button
              variant="secondary"
              icon={ArrowLeft}
              onClick={() => navigate("/blogs")}
            >
              <span className="hidden sm:inline">Back</span>
            </Button>

            <Button
              variant="secondary"
              icon={Save}
              isLoading={isSaving}
              onClick={() => save(BLOG_STATUS.DRAFT)}
            >
              <span className="hidden sm:inline">Save draft</span>
            </Button>

            {canPublish && (
              <Button
                icon={Send}
                isLoading={isSaving}
                onClick={() => save(BLOG_STATUS.PUBLISHED)}
              >
                {isPublished ? "Update" : "Publish"}
              </Button>
            )}
          </>
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

      <div className="grid gap-6 xl:grid-cols-3">
        {/* ------------------------------------------------- main column */}
        <div className="space-y-6 xl:col-span-2">
          <Card title="Content">
            <div className="space-y-5">
              <FormField
                label="Title"
                name="title"
                value={form.title}
                onChange={handleTitleChange}
                placeholder="How rooftop solar cuts your factory's power bill"
                required
              />

              <FormField
                label="URL slug"
                name="slug"
                icon={LinkIcon}
                value={form.slug}
                onChange={(event) => {
                  setIsSlugLocked(true);
                  updateField("slug", slugify(event.target.value));
                }}
                hint={
                  isPublished
                    ? "Careful: changing this breaks links already shared."
                    : "The web address of this post."
                }
              />

              <div>
                <label
                  htmlFor="excerpt"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  rows={2}
                  maxLength={300}
                  value={form.excerpt}
                  onChange={(event) => updateField("excerpt", event.target.value)}
                  placeholder="One or two sentences shown on the blog listing page."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  {form.excerpt.length}/300
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">
                  Body
                </label>
                <MarkdownEditor
                  value={form.content}
                  onChange={(value) => updateField("content", value)}
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  About {estimateReadingMinutes(form.content)} min read
                </p>
              </div>
            </div>
          </Card>

          <Card title="Search engine listing">
            <div className="space-y-5">
              <FormField
                label="Meta title"
                name="metaTitle"
                value={form.metaTitle}
                onChange={(event) => updateField("metaTitle", event.target.value)}
                placeholder={form.title || "Defaults to the post title"}
              />

              <div>
                <label
                  htmlFor="metaDescription"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Meta description
                </label>
                <textarea
                  id="metaDescription"
                  rows={2}
                  value={form.metaDescription}
                  onChange={(event) =>
                    updateField("metaDescription", event.target.value)
                  }
                  placeholder="Defaults to the excerpt."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* ---------------------------------------------- sidebar column */}
        <div className="space-y-6">
          <Card title="Status">
            <div className="space-y-3">
              <BlogStatusBadge status={form.status} />

              {!canPublish && (
                <p className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Your role can write and save drafts, but not publish.
                </p>
              )}
            </div>
          </Card>

          <Card title="Cover image">
            <div className="space-y-3">
              <div className="relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
                {coverUrl ? (
                  <>
                    <img
                      src={coverUrl}
                      alt="Cover"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview("");
                        setExistingCover("");
                      }}
                      aria-label="Remove cover image"
                      className="absolute right-2 top-2 rounded-md bg-slate-900/70 p-1.5 text-white transition-colors hover:bg-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1.5 text-slate-300 dark:text-slate-600">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-xs">No cover yet</span>
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="secondary"
                icon={Upload}
                fullWidth
                onClick={() => fileInputRef.current?.click()}
              >
                {coverUrl ? "Replace image" : "Upload image"}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />

              <p className="text-xs text-slate-400">
                Shown on the blog listing and at the top of the post. Max 4 MB.
              </p>
            </div>
          </Card>

          <Card title="Organisation">
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="category"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className={selectClass}
                >
                  {BLOG_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Tags"
                name="tags"
                value={form.tags}
                onChange={(event) => updateField("tags", event.target.value)}
                placeholder="rooftop, subsidy, maintenance"
                hint="Separate with commas."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
