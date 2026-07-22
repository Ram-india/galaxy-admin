import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Quote,
  Code,
  Eye,
  Pencil,
  Columns2,
} from "lucide-react";

/**
 * Markdown source is wrapped or prefixed depending on the tool: `wrap` puts the
 * marker on both sides of the selection, `prefix` puts it at the line start.
 */
const TOOLS = [
  { id: "bold", icon: Bold, label: "Bold", wrap: "**" },
  { id: "italic", icon: Italic, label: "Italic", wrap: "_" },
  { id: "heading", icon: Heading2, label: "Heading", prefix: "## " },
  { id: "quote", icon: Quote, label: "Quote", prefix: "> " },
  { id: "ul", icon: List, label: "Bullet list", prefix: "- " },
  { id: "ol", icon: ListOrdered, label: "Numbered list", prefix: "1. " },
  { id: "code", icon: Code, label: "Code", wrap: "`" },
  { id: "link", icon: Link2, label: "Link", template: "[text](https://)" },
];

const MODES = [
  { id: "write", icon: Pencil, label: "Write" },
  { id: "split", icon: Columns2, label: "Split" },
  { id: "preview", icon: Eye, label: "Preview" },
];

/** Tailwind classes for the rendered markdown, shared with the preview pane. */
export const markdownClasses =
  "prose-sm max-w-none text-slate-700 dark:text-slate-300 [&_h1]:mb-3 [&_h1]:mt-6 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:text-slate-900 dark:[&_h1]:text-white [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-slate-900 dark:[&_h2]:text-white [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-900 dark:[&_h3]:text-white [&_p]:mb-3 [&_p]:leading-relaxed [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_a]:text-blue-600 [&_a]:underline dark:[&_a]:text-blue-400 [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-slate-300 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-slate-600 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm dark:[&_code]:bg-slate-800 [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-slate-100 [&_img]:my-3 [&_img]:rounded-lg [&_table]:my-3 [&_table]:w-full [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-50 [&_th]:p-2 [&_th]:text-left dark:[&_th]:border-slate-700 dark:[&_th]:bg-slate-800 [&_td]:border [&_td]:border-slate-200 [&_td]:p-2 dark:[&_td]:border-slate-700 [&_hr]:my-6 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-700";

/**
 * Markdown editor with a formatting toolbar and live preview.
 *
 * Content is stored as markdown, never HTML — react-markdown ignores raw HTML
 * by default, so a post can never inject scripts into the public website.
 */
const MarkdownEditor = ({ value = "", onChange, error }) => {
  const [mode, setMode] = useState("split");
  const textareaRef = useRef(null);

  /** Applies a tool to the current selection and restores the caret. */
  const applyTool = (tool) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = value.slice(start, end);

    let replacement;
    let caretOffset;

    if (tool.template) {
      replacement = tool.template;
      caretOffset = tool.template.length;
    } else if (tool.wrap) {
      replacement = `${tool.wrap}${selected || tool.label}${tool.wrap}`;
      caretOffset = replacement.length;
    } else {
      // Prefix every line of the selection, so lists work on multi-line text
      const lines = (selected || tool.label).split("\n");
      replacement = lines.map((line) => `${tool.prefix}${line}`).join("\n");
      caretOffset = replacement.length;
    }

    const next = value.slice(0, start) + replacement + value.slice(end);
    onChange(next);

    // Restore focus after React has committed the new value
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + caretOffset, start + caretOffset);
    });
  };

  const showEditor = mode === "write" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  return (
    <div
      className={`overflow-hidden rounded-lg border ${
        error
          ? "border-red-300 dark:border-red-500/50"
          : "border-slate-200 dark:border-slate-700"
      }`}
    >
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5 dark:border-slate-700 dark:bg-slate-800">
        {TOOLS.map((tool) => (
          <button
            key={tool.id}
            type="button"
            onClick={() => applyTool(tool)}
            title={tool.label}
            aria-label={tool.label}
            className="rounded p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
          >
            <tool.icon className="h-4 w-4" />
          </button>
        ))}

        <div className="ml-auto flex items-center gap-0.5 rounded-md border border-slate-200 p-0.5 dark:border-slate-600">
          {MODES.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setMode(option.id)}
              title={option.label}
              aria-label={option.label}
              aria-pressed={mode === option.id}
              className={`rounded p-1.5 transition-colors ${
                mode === option.id
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              <option.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {/* PANES */}
      <div className={`grid ${showEditor && showPreview ? "md:grid-cols-2" : ""}`}>
        {showEditor && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            rows={18}
            placeholder={"Write your post in Markdown...\n\n## A heading\n\nSome **bold** text and a [link](https://example.com)."}
            className="w-full resize-y bg-white px-4 py-3 font-mono text-sm text-slate-900 placeholder-slate-400 outline-none dark:bg-slate-900 dark:text-slate-100"
          />
        )}

        {showPreview && (
          <div
            className={`overflow-y-auto bg-slate-50/60 px-4 py-3 dark:bg-slate-800/30 ${
              showEditor ? "border-t border-slate-200 dark:border-slate-700 md:border-l md:border-t-0" : ""
            }`}
            style={{ maxHeight: "34rem" }}
          >
            {value.trim() ? (
              <div className={markdownClasses}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">
                Nothing to preview yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
