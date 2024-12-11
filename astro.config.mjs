import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

import fs from "fs";
import path from "path";
import { promisify } from "util";

const copyFile = promisify(fs.copyFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

async function copyAssets(srcDir, destDir) {
  const entries = await readdir(srcDir, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(srcDir, entry.name);
      const destPath = path.join(destDir, entry.name);

      if (entry.isDirectory()) {
        await mkdir(destPath, { recursive: true });
        await copyAssets(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    })
  );
}

const copyAssetsIntegration = (destDir) => {
  return {
    name: "copy-assets",
    hooks: {
      "astro:build:done": async () => {
        const srcDir = path.resolve("src/assets");
        const fullDestDir = path.resolve(destDir);

        try {
          await copyAssets(srcDir, fullDestDir);
          console.log(`Assets copied from ${srcDir} to ${fullDestDir}`);
        } catch (err) {
          console.error(`Error copying assets: ${err}`);
        }
      },
    },
  };
};

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), copyAssetsIntegration("dist/src/assets")],
});
