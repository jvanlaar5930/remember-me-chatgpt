import path from "node:path";

export function getProjectName(rootDir) {
  return path.basename(path.resolve(rootDir));
}
