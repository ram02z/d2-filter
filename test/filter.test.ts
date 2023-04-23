import { afterAll, assert, expect, test } from "vitest";

import { exec } from "child_process";
import { action } from "../src/filter";
import { Attr, filter, Inline, PandocJson, Target } from "pandoc-filter";
import { rmSync } from "fs";

const TEST_OUTPUT_DIR = "tmp"

async function run(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, _) => {
      if (error !== null) {
        console.log(error);
        reject(error);
        return;
      }

      resolve(stdout);
    });
  });
}

const toPandocJSON = async (filename: string) => {
  const output = await run(`pandoc -t json ${filename}`);
  return JSON.parse(output);
};

afterAll(() => {
  rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true })
})

const getImage = (pandocJSON: PandocJson) => {
  const paraInlines = pandocJSON.blocks.flatMap((block) =>
    block.t === "Para" ? block.c : []
  );
  expect(paraInlines).toHaveLength(1);
  const images = paraInlines.map((inline) =>
    inline.t === "Image" ? inline.c : []
  );
  expect(images).toHaveLength(1);
  return images[0] as [Attr, Inline[], Target];
};

test("default", async () => {
  const input = await toPandocJSON("test/data/default.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("invalid codeblock class", async () => {
  const input = await toPandocJSON("test/data/invalid_codeblock.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    expect(output.blocks).toHaveLength(1);
    assert.strictEqual(output.blocks[0].t, "CodeBlock")
  });
});

test("theme number", async () => {
  const input = await toPandocJSON("test/data/theme_number.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("theme name", async () => {
  const input = await toPandocJSON("test/data/theme_name.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("elk layout engine", async () => {
  const input = await toPandocJSON("test/data/elk.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("inline png", async () => {
  const input = await toPandocJSON("test/data/inline_png.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/png;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("pdf", async () => {
  const input = await toPandocJSON("test/data/pdf.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].endsWith(".pdf"));
    assert.deepEqual(target[1], "");
  });
});

test("sketch", async () => {
  const input = await toPandocJSON("test/data/sketch.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("pad", async () => {
  const input = await toPandocJSON("test/data/pad.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("filename without folder", async () => {
  const input = await toPandocJSON("test/data/filename_without_folder.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("filename with folder", async () => {
  const input = await toPandocJSON("test/data/filename.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.strictEqual(target[0], "test.svg");
    assert.deepEqual(target[1], "");
  });
});

test("folder", async () => {
  const input = await toPandocJSON("test/data/folder.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.match(target[0], /tmp\/diagram-\d+\.svg/);
    assert.deepEqual(target[1], "");
  });
});

test("folder with pandoc caption", async () => {
  const input = await toPandocJSON("test/data/folder_with_caption.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "test/ caption" }]);
    assert.strictEqual(target[0], "tmp/Test-Caption.svg");
    assert.deepEqual(target[1], "fig:");
  });
});

test("pandoc caption", async () => {
  const input = await toPandocJSON("test/data/caption.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "test" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "fig:");
  });
});

test("pandoc caption with reference", async () => {
  const input = await toPandocJSON("test/data/caption_ref.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["fig:test", [], []]);
    assert.deepEqual(inlines, [{ t: "Str", c: "test" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "fig:");
  });
});

test("pandoc width image attribute", async () => {
  const input = await toPandocJSON("test/data/width.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], [ [ "width", "50%" ] ]]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});

test("pandoc width height attribute", async () => {
  const input = await toPandocJSON("test/data/height.md");
  expect(input).toBeTypeOf("object");
  filter(input, action, "").then((output) => {
    const [attr, inlines, target] = getImage(output);
    assert.deepEqual(attr, ["", [], [ [ "height", "30" ] ]]);
    assert.deepEqual(inlines, [{ t: "Str", c: "" }]);
    assert.ok(target[0].startsWith("data:image/svg+xml;base64,"));
    assert.deepEqual(target[1], "");
  });
});
