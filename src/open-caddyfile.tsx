import { showToast, Toast, showHUD } from "@raycast/api";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { homedir, tmpdir } from "os";
import { join } from "path";
import { getConfig } from "./shared";

function openInEditor(file: string, editorCmd: string) {
  if (editorCmd) {
    execSync(`${editorCmd} "${file}"`);
  } else {
    try {
      execSync(`open -Ra "Sublime Text" 2>/dev/null`);
      execSync(`open -a "Sublime Text" "${file}"`);
    } catch {
      execSync(`open -t "${file}"`);
    }
  }
}

export default async function Command() {
  const cfg = getConfig();

  if (cfg.isLocalMounted) {
    openInEditor(cfg.localCaddyfile, cfg.editorCmd);
    await showHUD("Opened Caddyfile");
    return;
  }

  // SSH fallback
  if (!cfg.sshTarget) {
    await showToast({ style: Toast.Style.Failure, title: "Caddyfile not found", message: "No local mount and no SSH target configured" });
    return;
  }

  const toast = await showToast({ style: Toast.Style.Animated, title: "Fetching Caddyfile via SSH..." });
  try {
    const content = execSync(
      `ssh -o BatchMode=yes "${cfg.sshTarget}" "cat \\"${cfg.remoteCaddyfile}\\""`,
      { encoding: "utf-8", timeout: 10_000 }
    );

    const tmp = join(tmpdir(), `Caddyfile.${Date.now()}`);
    writeFileSync(tmp, content);

    // Save state for apply
    const stateDir = join(homedir(), ".cache", "caddyfile-tools");
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(join(stateDir, "state.env"), [
      `LAST_TMP_CADDYFILE=${tmp}`,
      `LAST_REMOTE_CADDYFILE=${cfg.remoteCaddyfile}`,
      `LAST_SSH_TARGET=${cfg.sshTarget}`,
    ].join("\n"));

    openInEditor(tmp, cfg.editorCmd);
    toast.style = Toast.Style.Success;
    toast.title = "Opened SSH copy (run Apply after editing)";
  } catch (err) {
    toast.style = Toast.Style.Failure;
    toast.title = "SSH fetch failed";
    toast.message = String(err);
  }
}
