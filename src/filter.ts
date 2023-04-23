import {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "fs";
import * as pandoc from "pandoc-filter";
import { join } from "path";
import { fileSync } from "tmp";
import * as which from "which";
var exec = require("child_process").execSync;

var counter = 0;
const folder = process.cwd();
const errorLog = createWriteStream(join(folder, "d2-filter.err"));

enum D2Theme {
  NeutralDefault = 0,
  NeutralGrey = 1,
  FlagshipTerrastruct = 3,
  CoolClassics = 4,
  MixedBerryBlue = 5,
  GrapeSoda = 6,
  Aubergine = 7,
  ColorblindClear = 8,
  VanillaNitroCola = 100,
  OrangeCreamsicle = 101,
  ShirelyTemple = 102,
  EarthTones = 103,
  EvergladeGreen = 104,
  ButteredToast = 105,
  DarkMauve = 200,
  Terminal = 300,
  TerminalGrayscale = 301,
  Origami = 302,
}

enum D2Layout {
  dagre = "dagre",
  elk = "elk",
}

enum D2Format {
  svg = "svg",
  png = "png",
  pdf = "pdf",
}

type FilterOptions = {
  theme: D2Theme;
  layout: D2Layout;
  format: D2Format;
  sketch: boolean;
  pad: number;
  folder?: string;
  filename?: string;
  caption?: string;
};

const action: pandoc.SingleFilterActionAsync = async function (elt, _format) {
  if (elt.t != "CodeBlock") return undefined;
  const attrs = elt.c[0];
  const content = elt.c[1];
  const id = attrs[0];
  const classes = attrs[1];
  const options: FilterOptions = {
    theme: D2Theme.NeutralDefault,
    layout: D2Layout.dagre,
    format: D2Format.svg,
    sketch: false,
    pad: 100,
  };

  if (classes.indexOf("d2") < 0) return undefined;

  attrs[2].map((item) => {
    switch (item[0]) {
      case "theme":
        if (+item[1] in D2Theme) options.theme = +item[1];
        break;
      case "sketch":
        options.sketch = item[1] === "true";
        break;
      case "layout":
        if (item[1] in D2Layout) options.layout = item[1] as D2Layout;
        break;
      case "format":
        if (item[1] in D2Format) options.format = item[1] as D2Format;
        break;
      case "pad":
        options.pad = +item[1];
        break;
      case "folder":
      case "filename":
      case "caption":
        options[item[0]] = item[1];
        break;
    }
  });

  counter++;

  const tmpFile = fileSync();
  writeFileSync(tmpFile.name, content);
  const outDir = options.folder ?? "";

  if (options.caption && !options.filename) {
    options.filename = options.caption
      ?.replace(/(?:^|\s|["'([{])+\S/g, (match) => match.toUpperCase())
      .replace(/\s+/g, "")
      .replace(/\//g, "-");
  }

  if (!options.filename) {
    options.filename = `diagram-${counter}`;
  }

  const savePath = tmpFile.name + "." + options.format;
  var newPath = join(outDir, `${options.filename}.${options.format}`);
  const fullCmd = `d2 --theme=${options.theme} --layout=${options.layout} --sketch=${options.sketch} --pad=${options.pad} ${tmpFile.name} ${savePath}`;
  exec(fullCmd);

  if (!options.folder) {
    if (options.format === "svg") {
      const data = readFileSync(savePath, "utf8");
      newPath =
        "data:image/svg+xml;base64," + Buffer.from(data).toString("base64");
    } else if (options.format === "pdf") {
      newPath = savePath;
    } else {
      const data = readFileSync(savePath);
      newPath = "data:image/png;base64," + Buffer.from(data).toString("base64");
    }
  } else {
    const imageFolder = join(folder, outDir);
    if (!existsSync(imageFolder)) {
      mkdirSync(imageFolder);
    }
    const readStream = createReadStream(savePath);
    const writeStream = createWriteStream(newPath);
    readStream.on("close", () => {
      unlinkSync(savePath);
    });
    readStream.pipe(writeStream);
  }

  const fig = options.caption ? "fig:" : "";
  return pandoc.Para([
    pandoc.Image(
      [id, [], []],
      [pandoc.Str(options.caption ?? "")],
      [newPath, fig]
    ),
  ]);
};

export = function () {
  // @ts-ignore
  process.stderr.write = errorLog.write.bind(errorLog);
  const resolvedOrNull = which.sync("d2", { nothrow: true });
  if (resolvedOrNull === null) {
    console.error("d2 is not installed");
    return;
  }
  pandoc.stdio(action);
};
