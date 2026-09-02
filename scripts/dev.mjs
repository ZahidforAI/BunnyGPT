import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const venvPython = path.join(
  projectRoot,
  ".venv",
  process.platform === "win32" ? "Scripts/python.exe" : "bin/python",
);
const python =
  process.env.BUNNYGPT_PYTHON ||
  (existsSync(venvPython) ? venvPython : process.platform === "win32" ? "python" : "python3");
const viteArgs = process.argv.slice(2);
const children = [];
let stopping = false;

function start(command, args, name) {
  const child = spawn(command, args, {
    cwd: projectRoot,
    env: { ...process.env, FORCE_COLOR: "1" },
    stdio: "inherit",
    windowsHide: true,
  });
  children.push(child);
  child.on("error", (error) => {
    console.error(`[${name}] could not start: ${error.message}`);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    if (!stopping) {
      console.error(`[${name}] stopped unexpectedly (${signal || code || 0}).`);
      stop(code || 1);
    }
  });
}

function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(exitCode), 250).unref();
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

console.log("Starting BunnyGPT LangChain API on http://127.0.0.1:8000");
start(python, ["-m", "uvicorn", "api.core:app", "--host", "127.0.0.1", "--port", "8000"], "langchain");
start(
  process.execPath,
  [
    path.join(projectRoot, "node_modules", "next", "dist", "bin", "next"),
    "dev",
    projectRoot,
    "--hostname",
    "0.0.0.0",
    "--port",
    "5173",
    ...viteArgs,
  ],
  "next",
);
