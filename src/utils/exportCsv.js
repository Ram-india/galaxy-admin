/** Byte-order mark — makes Excel read the file as UTF-8. */
const BOM = "\uFEFF";

/**
 * Escapes a single CSV cell: wraps in quotes and doubles any inner quotes.
 * A leading `=`, `+`, `-` or `@` is prefixed with a quote so spreadsheet
 * software does not evaluate the value as a formula.
 */
const escapeCell = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
};

/**
 * Builds a CSV from `rows` and triggers a browser download.
 *
 * @param {Array<Object>} rows      Data to export.
 * @param {Array<{key: string, label: string, format?: Function}>} columns
 * @param {string} filename         File name without extension.
 */
export const exportToCsv = (rows, columns, filename = "export") => {
  const header = columns.map((column) => escapeCell(column.label)).join(",");

  const body = rows.map((row) =>
    columns
      .map((column) => {
        const value = row[column.key];
        return escapeCell(column.format ? column.format(value) : value);
      })
      .join(",")
  );

  // Leading BOM keeps Excel happy with UTF-8 characters
  const csv = `${BOM}${[header, ...body].join("\n")}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
