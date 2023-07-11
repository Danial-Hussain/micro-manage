export const formatDate = (endTime: string, startTime: string) => {
  let endDate = new Date(endTime);
  let startDate = new Date(startTime);
  let diffMs = endDate.getTime() - startDate.getTime();
  let diffDays = Math.floor(Math.abs(diffMs) / 86400000);
  let diffHrs = Math.floor(Math.abs(diffMs) / 3600000);

  let diffMins = diffMs / 1000;
  diffMins /= 60;
  diffMins = Math.abs(Math.round(diffMins));

  let startTimeStr = `${startTime.split("T").join(" ").slice(0, 16)}`;

  if (diffMins < 60) {
    return `${startTimeStr} • ${diffMins} ${
      diffMins === 1 ? "minute" : "minutes"
    }`;
  } else if (diffHrs < 24) {
    return `${startTimeStr} • ${diffHrs} ${diffHrs === 1 ? "hour" : "hours"}`;
  } else {
    return `${startTimeStr} • ${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  }
};
