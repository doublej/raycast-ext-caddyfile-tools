import { showToast, Toast, showHUD, Clipboard } from "@raycast/api";
import { execSync } from "child_process";
import { getConfig } from "./shared";

export default async function Command() {
  const cfg = getConfig();

  const toast = await showToast({ style: Toast.Style.Animated, title: "Generating password..." });

  try {
    let output: string;
    if (cfg.isLocalMounted) {
      output = execSync(`bash "${cfg.localGenScript}" 2>&1`, { encoding: "utf-8", timeout: 30_000 });
    } else {
      output = execSync(
        `ssh -T -o BatchMode=yes "${cfg.sshTarget}" "bash -lc 'bash -euo pipefail \\"${cfg.remoteGenScript}\\"'" 2>&1`,
        { encoding: "utf-8", timeout: 30_000 }
      );
    }

    await Clipboard.copy(output.trim());
    toast.style = Toast.Style.Success;
    toast.title = "Password generated and copied";
  } catch (err) {
    toast.style = Toast.Style.Failure;
    toast.title = "Generation failed";
    toast.message = String(err);
  }
}
