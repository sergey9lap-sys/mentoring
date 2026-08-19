import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const item of ["index.html", "src", "public", "spasibo", "thanks", "cases"]) {
  await cp(item, `dist/${item}`, { recursive: true });
}

const caseEntries = await readdir("dist/cases", { withFileTypes: true });
const casePages = ["dist/cases/index.html"];
for (const entry of caseEntries) {
  const pagePath = entry.isDirectory() ? `dist/cases/${entry.name}/index.html` : null;
  if (pagePath) casePages.push(pagePath);
}
for (const pagePath of casePages) {
  const page = await readFile(pagePath, "utf8");
  await writeFile(pagePath, page.replace("/src/cases.css?v=1", "/src/cases.css?v=3"));
}
