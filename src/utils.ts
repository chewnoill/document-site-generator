import * as path from "path";
import * as fs from "fs";

export function selectEntrypoint(folder: string, filename: string) {
  return path.relative(
    folder,
    path.join(path.dirname(filename), path.basename(filename).split(".")[0]),
  );
}
export function selectAbsJs(publicPath:string, folder: string, filename: string) {
  const entrypoint = selectEntrypoint(folder, filename);
  return publicPath + entrypoint + ".js";
}
export function selectEntrypointHtml(publicPath: string, folder: string, filename: string) {
  const entryPath = selectEntrypoint(folder, filename);
  console.log({publicPath, entryPath})
  if (entryPath.endsWith("index")) {
    return publicPath+entryPath + ".html";
  }
  return publicPath+entryPath + "/index.html";
}

export function selectAbsMain(publicPath: string, folder: string, filename: string) {
  return publicPath+"main.js"
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
