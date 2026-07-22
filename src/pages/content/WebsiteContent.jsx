import { useCallback, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  Eye,
  EyeOff,
  Images,
  Loader2,
  MapPin,
  MessageSquareQuote,
  Star,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import * as contentApi from "../../services/contentService";
import { useAuth } from "../../context/authStore";
import { PERMISSIONS } from "../../constants/permissions";
import { JOB_STATUS_STYLES } from "../../constants/content";
import { formatDate } from "../../utils/format";

import PageHeader from "../../components/ui/PageHeader";
import { toErrorMessage } from "../../utils/errorMessage";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import EmptyState from "../../components/ui/EmptyState";
import SlideFormModal from "../../components/content/SlideFormModal";
import JobFormModal from "../../components/content/JobFormModal";
import TestimonialFormModal from "../../components/content/TestimonialFormModal";
import UserAvatar from "../../components/team/UserAvatar";

const TABS = [
  { id: "slides", label: "Hero slides", icon: Images },
  { id: "jobs", label: "Careers", icon: Briefcase },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
];

/**
 * Homepage carousel and careers listings.
 *
 * Both feed the public website directly, so a change here is live on the next
 * page load without a redeploy.
 */
const WebsiteContent = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission(PERMISSIONS.SETTINGS_MANAGE);

  const [activeTab, setActiveTab] = useState("slides");
  const [slides, setSlides] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const [slideTarget, setSlideTarget] = useState(null);
  const [isSlideFormOpen, setIsSlideFormOpen] = useState(false);
  const [jobTarget, setJobTarget] = useState(null);
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState(null);
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const [slidesRes, jobsRes, quotesRes] = await Promise.all([
        contentApi.getSlides(),
        contentApi.getJobs(),
        contentApi.getTestimonials(),
      ]);

      setSlides(slidesRes.data || []);
      setJobs(jobsRes.data.jobs || []);
      setTestimonials(quotesRes.data || []);
      setError("");
    } catch (err) {
      setError(toErrorMessage(err, "Unable to load the website content."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadContent = async () => {
      await load();
    };

    loadContent();
  }, [load]);

  /** Runs a mutation, then reports and reloads. */
  const run = async (action, fallbackMessage) => {
    try {
      const res = await action();
      setNotice(res?.data?.message || fallbackMessage);
      setError("");
      await load();
    } catch (err) {
      setError(toErrorMessage(err, "That action failed."));
      setNotice("");
    }
  };

  const moveSlide = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;

    const reordered = [...slides];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    // Optimistic: the carousel order should feel instant
    setSlides(reordered);
    run(
      () => contentApi.reorderSlides(reordered.map((slide) => slide._id)),
      "Order saved."
    );
  };

  const toggleSlide = (slide) => {
    const payload = new FormData();
    payload.append("isActive", String(!slide.isActive));

    run(
      () => contentApi.updateSlide(slide._id, payload),
      slide.isActive ? "Slide hidden." : "Slide shown."
    );
  };

  const removeSlide = (slide) => {
    if (!window.confirm(`Delete the slide "${slide.title}"?`)) return;
    run(() => contentApi.deleteSlide(slide._id), "Slide deleted.");
  };

  const removeJob = (job) => {
    if (!window.confirm(`Delete the "${job.position}" listing?`)) return;
    run(() => contentApi.deleteJob(job._id), "Job deleted.");
  };

  const moveTestimonial = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= testimonials.length) return;

    const reordered = [...testimonials];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    setTestimonials(reordered);
    run(
      () => contentApi.reorderTestimonials(reordered.map((item) => item._id)),
      "Order saved."
    );
  };

  const toggleTestimonial = (quote) => {
    const payload = new FormData();
    payload.append("isActive", String(!quote.isActive));

    run(
      () => contentApi.updateTestimonial(quote._id, payload),
      quote.isActive ? "Testimonial hidden." : "Testimonial shown."
    );
  };

  const removeTestimonial = (quote) => {
    if (!window.confirm(`Delete the testimonial from ${quote.name}?`)) return;
    run(() => contentApi.deleteTestimonial(quote._id), "Testimonial deleted.");
  };

  const openQuoteForm = (quote = null) => {
    setQuoteTarget(quote);
    setIsQuoteFormOpen(true);
  };

  const openSlideForm = (slide = null) => {
    setSlideTarget(slide);
    setIsSlideFormOpen(true);
  };

  const openJobForm = (job = null) => {
    setJobTarget(job);
    setIsJobFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Website content" },
        ]}
        title="Website content"
        subtitle="Homepage carousel and careers listings, published straight to the site."
        onRefresh={load}
        actions={
          canManage && (
            <Button
              icon={Plus}
              onClick={() => {
                if (activeTab === "slides") return openSlideForm();
                if (activeTab === "jobs") return openJobForm();
                return openQuoteForm();
              }}
            >
              <span className="hidden sm:inline">
                {activeTab === "slides"
                  ? "New slide"
                  : activeTab === "jobs"
                    ? "Post job"
                    : "New testimonial"}
              </span>
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

      {/* TABS */}
      <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900 sm:w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === id
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* HERO SLIDES */}
      {activeTab === "slides" &&
        (slides.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <EmptyState
              icon={Images}
              title="No slides yet"
              description="Add a slide to build the homepage carousel."
              action={
                canManage && (
                  <Button icon={Plus} onClick={() => openSlideForm()}>
                    New slide
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide._id}
                className={`flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition-colors dark:bg-slate-900 sm:flex-row sm:items-center ${
                  slide.isActive
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-dashed border-slate-300 opacity-70 dark:border-slate-700"
                }`}
              >
                <img
                  src={slide.image}
                  alt=""
                  className="h-24 w-full rounded-lg object-cover sm:w-40"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      #{index + 1}
                    </span>
                    <h3 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                      {slide.title}
                    </h3>
                  </div>

                  <p className="mt-1 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
                    {slide.subtitle || "No subtitle"}
                  </p>

                  {slide.ctaLabel && (
                    <p className="mt-1.5 text-xs text-blue-600 dark:text-blue-400">
                      {slide.ctaLabel} → {slide.ctaHref || "(no link)"}
                    </p>
                  )}
                </div>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSlide(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveSlide(index, 1)}
                      disabled={index === slides.length - 1}
                      aria-label="Move down"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleSlide(slide)}
                      aria-label={slide.isActive ? "Hide slide" : "Show slide"}
                      className={`rounded-lg p-2 transition-colors ${
                        slide.isActive
                          ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {slide.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openSlideForm(slide)}
                      aria-label="Edit slide"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeSlide(slide)}
                      aria-label="Delete slide"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

      {/* JOBS */}
      {activeTab === "jobs" &&
        (jobs.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <EmptyState
              icon={Briefcase}
              title="No job listings"
              description="Post a role and it appears on the careers page."
              action={
                canManage && (
                  <Button icon={Plus} onClick={() => openJobForm()}>
                    Post job
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-start"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {job.position}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                        JOB_STATUS_STYLES[job.status]
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    {job.department && <span>{job.department}</span>}
                    {job.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </span>
                    )}
                    <span>{job.type}</span>
                    {job.experience && <span>{job.experience}</span>}
                    <span>Posted {formatDate(job.posted)}</span>
                  </p>

                  {job.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">
                      {job.description}
                    </p>
                  )}
                </div>

                {canManage && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openJobForm(job)}
                      aria-label="Edit job"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeJob(job)}
                      aria-label="Delete job"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

      {/* TESTIMONIALS */}
      {activeTab === "testimonials" &&
        (testimonials.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <EmptyState
              icon={MessageSquareQuote}
              title="No testimonials yet"
              description="Add a client quote and it appears on the homepage."
              action={
                canManage && (
                  <Button icon={Plus} onClick={() => openQuoteForm()}>
                    New testimonial
                  </Button>
                )
              }
            />
          </div>
        ) : (
          <div className="space-y-3">
            {testimonials.map((quote, index) => (
              <div
                key={quote._id}
                className={`flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900 sm:flex-row ${
                  quote.isActive
                    ? "border-slate-200 dark:border-slate-800"
                    : "border-dashed border-slate-300 opacity-70 dark:border-slate-700"
                }`}
              >
                <UserAvatar name={quote.name} src={quote.avatar} />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {quote.name}
                    </h3>
                    <span className="flex items-center gap-0.5">
                      {Array.from({ length: quote.rating || 5 }).map((_, star) => (
                        <Star
                          key={star}
                          className="h-3 w-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </span>
                  </div>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {[quote.role, quote.company].filter(Boolean).join(" · ") ||
                      "No role given"}
                  </p>

                  <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">
                    “{quote.message}”
                  </p>
                </div>

                {canManage && (
                  <div className="flex items-center gap-1 sm:items-start">
                    <button
                      onClick={() => moveTestimonial(index, -1)}
                      disabled={index === 0}
                      aria-label="Move up"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveTestimonial(index, 1)}
                      disabled={index === testimonials.length - 1}
                      aria-label="Move down"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-slate-800"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => toggleTestimonial(quote)}
                      aria-label={quote.isActive ? "Hide" : "Show"}
                      className={`rounded-lg p-2 transition-colors ${
                        quote.isActive
                          ? "text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10"
                          : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      {quote.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => openQuoteForm(quote)}
                      aria-label="Edit testimonial"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeTestimonial(quote)}
                      aria-label="Delete testimonial"
                      className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

      <TestimonialFormModal
        isOpen={isQuoteFormOpen}
        testimonial={quoteTarget}
        onClose={() => setIsQuoteFormOpen(false)}
        onSaved={(message) => {
          setNotice(message);
          load();
        }}
      />

      <SlideFormModal
        isOpen={isSlideFormOpen}
        slide={slideTarget}
        onClose={() => setIsSlideFormOpen(false)}
        onSaved={(message) => {
          setNotice(message);
          load();
        }}
      />

      <JobFormModal
        isOpen={isJobFormOpen}
        job={jobTarget}
        onClose={() => setIsJobFormOpen(false)}
        onSaved={(message) => {
          setNotice(message);
          load();
        }}
      />
    </div>
  );
};

export default WebsiteContent;
