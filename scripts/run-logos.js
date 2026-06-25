#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const isWindows = process.platform === "win32";

const scriptPath = path.join(__dirname, isWindows ? "download-logos.ps1" : "download-logos.sh");
const cmd = isWindows ? "powershell" : "bash";
const args = isWindows ? ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPath] : [scriptPath];

console.log(`Running: ${cmd} ${args.join(" ")}\n`);

const proc = spawn(cmd, args, { stdio: "inherit", cwd: path.join(__dirname, "..") });
proc.on("exit", (code) => process.exit(code));
