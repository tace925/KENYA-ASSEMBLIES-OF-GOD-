export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function printTable(title: string, headers: string[], rows: (string | number)[][]) {
  const thead = headers
    .map((h) => `<th style="text-align:left;padding:8px;border-bottom:1px solid #ccc">${h}</th>`)
    .join("");
  const tbody = rows
    .map(
      (r) =>
        `<tr>${r
          .map((c) => `<td style="padding:8px;border-bottom:1px solid #eee">${String(c ?? "")}</td>`)
          .join("")}</tr>`
    )
    .join("");
  const html = `<!DOCTYPE html><html><head><title>${title}</title>
<style>
  body{font-family:system-ui,sans-serif;padding:24px;color:#111}
  h1{font-size:18px;margin:0 0 8px}
  table{width:100%;border-collapse:collapse;font-size:13px;margin-top:16px}
</style>
</head><body>
<h1>${title}</h1>
<p style="color:#666;font-size:12px;margin:0">Printed ${new Date().toLocaleString()}</p>
<table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
<script>window.onload=function(){window.print()}</script>
</body></html>`;
  const w = window.open("", "_blank");
  if (!w) {
    alert("Allow pop-ups to print / save as PDF.");
    return;
  }
  w.document.write(html);
  w.document.close();
}