import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import glob from "fast-glob";
import chokidar from "chokidar";
import type { FSWatcher } from "chokidar";
import type { Plugin } from "vite";

const MOCKUPS_DIR = "src/components/mockups";
const GENERATED_MODULE = "src/.generated/mockup-components.ts";

interface DiscoveredComponent {
  globKey: string;
  importPath: string;
}

export function mockupPreviewPlugin(): Plugin {
  let root = "";
  let currentSource = "";
  let watcher: FSWatcher | null = null;
