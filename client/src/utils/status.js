

export function normalizeStatus(status) {
  return status.trim().toUpperCase().replace(/\s+/g, "_");
}

export function isLiveMatch(match) {
  const status = normalizeStatus(match.status);
  return status === "LIVE" || status === "IN_PLAY" || status === "HALFTIME";
}

export function isFinishedMatch(match) {
  const status = normalizeStatus(match.status);
  return status === "FINISHED" || status === "FT" || status === "FULL_TIME";
}

export function getStatusTone(status) {
  const normalized = normalizeStatus(status);
  if (normalized === "LIVE" || normalized === "IN_PLAY") {
    return "live";
  }
  if (normalized === "FINISHED" || normalized === "FT" || normalized === "FULL_TIME") {
    return "success";
  }
  if (normalized === "UPCOMING" || normalized === "SCHEDULED") {
    return "primary";
  }
  return "muted";
}