import { Command, flags } from "@oclif/command";
import * as fs from "fs";
import HtmlWebpackPlugin = require("html-webpack-plugin");
import buildHTML from "../mdx-template";

function selectEntrypoint(filename: string) {
  return filename.split('.')[0];
}

export default class Run extends Command {
  static description = "describe the command here";

  static examples = [`$ docs run `];

  static flags = {
    help: flags.help({ char: "h" }),
  };

  static args = [{ name: "folder" }];

  async run() {
    const { args } = this.parse(Run);

    const folder = args.folder;

    const files = fs.readdirSync(folder);

    files.forEach(filepath => {
      const fileHtml = buildHTML(fs.readFileSync(`${folder}/${filepath}`).toString());
      fs.writeFileSync(`out/${filepath.split('.')[0]}.html`,fileHtml);
      console.log(fileHtml);


    });
  }
}