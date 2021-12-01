import * as path from "path";
import * as fs from "fs";

export function selectEntrypoint(folder: string, filename: string) {
  return path.relative(
    folder,
    path.join(path.dirname(filename), path.basename(filename).split(".")[0])
  );
}
export function selectEntrypointHtml(folder: string, filename: string) {
  const entryPath = selectEntrypoint(folder, filename);
  if (entryPath == "index") {
    return "index.html";
  }
  return entryPath + "/index.html";
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
