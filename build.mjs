import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
for (const item of ["index.html", "src", "public", "spasibo", "thanks", "cases"]) {
  await cp(item, `dist/${item}`, { recursive: true });
}
