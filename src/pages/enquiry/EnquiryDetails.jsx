import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Loader2,
  Mail,
  Phone,
  Sun,
  User,
  Zap,
} from "lucide-react";

import { getEnquiry, updateEnquiryStatus } from "../../services/enquiryService";
import { ENQUIRY_STATUSES } from "../../constants/enquiry";
import { formatDateTime } from "../../utils/format";

import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/enquiry/StatusBadge";
import { DetailsSkeleton } from "../../components/enquiry/LoadingSkeleton";

/** Card wrapper shared by every section on this page. */
const Section = ({ title, icon: Icon, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <header className="flex items-center gap-2 border-b border-slate-200 px-6 py-4 dark:border-slate-800">
      <Icon className="h-4 w-4 text-slate-400" />
      <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
        {title}
      </h2>
    </header>
    <div className="px-6 py-5">{children}</div>
  </section>
);

/** Label / value row. `href` turns the value into a link (tel:, mailto:). */
const Field = ({ icon: Icon, label, value, href }) => (
  <div>
    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {label}
    </p>
    {href && value ? (
      <a
        href={href}
        className="mt-1 block break-words text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400"
      >
        {value}
      </a>
    ) : (
      <p className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">
        {value || "—"}
      </p>
    )}
  </div>
);

const EnquiryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [enquiry, setEnquiry] = useState(null);
  // Errors are tagged with the id they belong to, so navigating to another
  // enquiry automatically clears the previous failure.
  const [error, setError] = useState(null);

  // Status dropdown is a draft until "Save changes" is pressed
  const [draftStatus, setDraftStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  // Derived instead of stored: we are loading until the data (or an error)
  // for this exact id has arrived. Keeps the effect free of setState calls.
  const isLoading = enquiry?._id !== id && error?.id !== id;

  useEffect(() => {
    let isStale = false;

    const fetchEnquiry = async () => {
      try {
        const res = await getEnquiry(id);
        if (isStale) return;
        setEnquiry(res.data);
        setDraftStatus(res.data.status || "New");
      } catch (err) {
        if (isStale) return;
        console.error("Error fetching enquiry", err);
        setError({
          id,
          message:
            err?.response?.status === 404
              ? "This enquiry no longer exists."
              : "Unable to load this enquiry. Please try again.",
        });
      }
    };

    fetchEnquiry();

    // Ignore a response that arrives after the id has already changed
    return () => {
      isStale = true;
    };
  }, [id]);

  const handleSaveStatus = async () => {
    setIsSaving(true);
    try {
      const res = await updateEnquiryStatus(id, draftStatus);
      setEnquiry(res.data);
      setSavedAt(Date.now());
    } catch (err) {
      console.error("Error updating status", err);
      alert(err?.response?.data?.message || "Could not update the status.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedStatus = enquiry && draftStatus !== enquiry.status;

  if (isLoading) return <DetailsSkeleton />;

  if (error?.id === id) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-16 text-center dark:border-slate-800 dark:bg-slate-900">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          {error.message}
        </p>
        <button
          onClick={() => navigate("/enquiries")}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to enquiries
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Enquiries", to: "/enquiries" },
          { label: enquiry.fullName },
        ]}
        title={enquiry.fullName}
        subtitle={`Enquiry received on ${formatDateTime(enquiry.createdAt)}`}
        actions={
          <button
            onClick={() => navigate("/enquiries")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ------------------------------------------------ main column */}
        <div className="space-y-6 lg:col-span-2">
          <Section title="Customer Information" icon={User}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field icon={User} label="Full Name" value={enquiry.fullName} />
              <Field
                icon={Phone}
                label="Phone"
                value={enquiry.phone}
                href={`tel:${enquiry.phone}`}
              />
              <Field
                icon={Mail}
                label="Email"
                value={enquiry.email}
                href={enquiry.email ? `mailto:${enquiry.email}` : undefined}
              />
            </div>
          </Section>

          <Section title="Project Information" icon={Sun}>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                icon={Sun}
                label="Project Type"
                value={enquiry.projectType}
              />
              <Field
                icon={Zap}
                label="Installation Type"
                value={enquiry.installationType}
              />
              <Field
                icon={Globe}
                label="Source"
                value={enquiry.source || "Website"}
              />
            </div>
          </Section>

          <Section title="Requirement" icon={FileText}>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {enquiry.requirement || "No requirement details were provided."}
            </p>
          </Section>
        </div>

        {/* --------------------------------------------- sidebar column */}
        <div className="space-y-6">
          <Section title="Status" icon={CheckCircle2}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Current
                </p>
                <div className="mt-2">
                  <StatusBadge status={enquiry.status} />
                </div>
              </div>

              <div>
                <label
                  htmlFor="details-status"
                  className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500"
                >
                  Change status
                </label>
                <select
                  id="details-status"
                  value={draftStatus}
                  onChange={(event) => setDraftStatus(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  {ENQUIRY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSaveStatus}
                disabled={isSaving || !hasUnsavedStatus}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save changes
              </button>

              {/* Transient confirmation after a successful save */}
              {savedAt && !hasUnsavedStatus && (
                <p className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Status saved
                </p>
              )}
            </div>
          </Section>

          <Section title="Timeline" icon={Clock}>
            <div className="space-y-5">
              <Field
                icon={Calendar}
                label="Created"
                value={formatDateTime(enquiry.createdAt)}
              />
              <Field
                icon={Clock}
                label="Last Updated"
                value={formatDateTime(enquiry.updatedAt)}
              />
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default EnquiryDetails;
