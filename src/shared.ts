import { getPreferenceValues } from "@raycast/api";
import { existsSync } from "fs";

interface Preferences {
  sshTarget: string;
  remoteCaddyEtc: string;
  localMount: string;
  editorCmd: string;
}

export function getConfig() {
  const prefs = getPreferenceValues<Preferences>();
  const localMount = prefs.localMount || "/Volumes/share";
  const remoteCaddyEtc = prefs.remoteCaddyEtc || "/share/Container/caddy";
  const sshTarget = prefs.sshTarget || "";
  const editorCmd = prefs.editorCmd || "";

  return {
    sshTarget,
    remoteCaddyEtc,
    localMount,
    editorCmd,
    localCaddyfile: `${localMount}/caddy/etc/Caddyfile`,
    localGenScript: `${localMount}/caddy/etc/generate_password_on_nas.sh`,
    localApplyScript: `${localMount}/caddy/etc/apply_from_mac.sh`,
    remoteCaddyfile: `${remoteCaddyEtc}/Caddyfile`,
    remoteGenScript: `${remoteCaddyEtc}/generate_password_on_nas.sh`,
    remoteApplyScript: `${remoteCaddyEtc}/apply_from_mac.sh`,
    isLocalMounted: existsSync(`${localMount}/caddy/etc/Caddyfile`),
  };
}
