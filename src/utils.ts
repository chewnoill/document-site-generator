import * as path from "path";
import * as fs from "fs";

export function selectEntrypoint(folder: string, filename: string) {
  return path.relative(
    folder,
    path.join(path.dirname(filename), path.basename(filename).split(".")[0])
  );
}
export function selectRelativeJs(folder: string, filename: string) {
  const prefix = path.relative(filename, folder) || '.';
  const entrypoint = selectEntrypoint(folder, filename);
  return (
    prefix +
    "/" +
    entrypoint +
    ".js"
  );
}
export function selectEntrypointHtml(folder: string, filename: string) {
  const entryPath = selectEntrypoint(folder, filename);
  if (entryPath == "index") {
    return "index.html";
  }
  if (entryPath.endsWith("index")) {
    return entryPath + ".html";
  }
  return entryPath + "/index.html";
}

export function selectRelativeMain(folder: string, filename: string) {
  const entryPath = selectEntrypoint(folder, filename);
  if (entryPath == "index") {
    return './main.js';
  }
  const prefix = path.relative(filename, folder);
  return path.join(prefix, "main.js");
}

export function resolveFileList(folder) {
  return fs.readdirSync(folder).reduce((acc, filename) => {
    if (filename === "public") return acc;
    const subPath = path.resolve(folder, filename);
    if (fs.lstatSync(subPath).isFile()) {
      return [...acc, subPath];
    }
    return [...acc, ...resolveFileList(subPath)];
  }, []);
}
