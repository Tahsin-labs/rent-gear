import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  outDir: "dist",
  platform: "node",
  target: "node20",
  sourcemap: true,
  clean: true,
  splitting: false,
  bundle: true,
  banner: {
    js: `import { createRequire } from 'module';
const require = createRequire(import.meta.url);`,
  },
});