import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjects,
} from "../services/projectService";

import {
  ArrowLeft,
  Image as ImageIcon,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getProjects(id);
        setProject(res.data);
        setIndex(0);
      } catch (err) {
        console.error("Error loading project", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-slate-700 dark:text-slate-200">Loading...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <div className="text-slate-700 dark:text-slate-200">Project not found.</div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  const images = project.images || [];

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const goTo = (i) => setIndex(i);

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:opacity-90 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
              {project.projectName}
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm">
              {project.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[index]}
                    alt={project.projectName}
                    className="w-full h-80 object-cover sm:h-96 lg:h-[520px]"
                  />

                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white/80 dark:bg-slate-900/70 shadow hover:scale-105 transition"
                    aria-label="previous"
                  >
                    ‹
                  </button>

                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-md bg-white/80 dark:bg-slate-900/70 shadow hover:scale-105 transition"
                    aria-label="next"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((img, i) => (
                      <button
                        key={img + i}
                        onClick={() => goTo(i)}
                        className={`w-3 h-3 rounded-full transition-opacity ${i === index ? 'opacity-100 bg-white' : 'opacity-40 bg-white/60'} `}
                        aria-label={`go to ${i}`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center p-20 text-slate-500 dark:text-slate-400">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
              <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white">Description</h2>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {project.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Type</div>
                  <div className="font-medium text-slate-900 dark:text-white">{project.projectType}</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Location</div>
                  <div className="font-medium text-slate-900 dark:text-white">{project.location || 'N/A'}</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Start</div>
                  <div className="font-medium text-slate-900 dark:text-white">{project.startDate ? new Date(project.startDate).toLocaleDateString() : '-'}</div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-slate-700 dark:text-slate-200" />
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">End</div>
                  <div className="font-medium text-slate-900 dark:text-white">{project.completionDate ? new Date(project.completionDate).toLocaleDateString() : '-'}</div>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Client</div>
                  <div className="font-medium text-slate-900 dark:text-white">{project.clientName}</div>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">Capacity</div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{project.capacity || '-'}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400">kW</div>
              </div>

            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-500 dark:text-slate-400">Status</div>
                <div className="font-medium text-slate-900 dark:text-white">{project.status}</div>
              </div>

              <div className="mt-4">
                <button onClick={() => alert('Not implemented')} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:shadow-lg transition">
                  Contact Client
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-800/80">
              <div className="text-sm text-slate-500 dark:text-slate-400">Team</div>
              <div className="mt-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div>
                  <div className="font-medium text-slate-900 dark:text-white">{project.team || '—'}</div>
                  <div className="text-sm text-slate-400">Members</div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;
