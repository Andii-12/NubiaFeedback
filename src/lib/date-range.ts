function localISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function rangeToDates(range: string, from?: string, to?: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (range === "today") {
    return { from: localISO(today), to: localISO(today) };
  }
  if (range === "yesterday") {
    const y = new Date(today);
    y.setDate(today.getDate() - 1);
    return { from: localISO(y), to: localISO(y) };
  }
  if (range === "this_week") {
    const start = new Date(today);
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1);
    return { from: localISO(start), to: localISO(today) };
  }
  if (range === "this_month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { from: localISO(start), to: localISO(today) };
  }
  if (range === "custom") {
    return { from: from || localISO(today), to: to || localISO(today) };
  }
  return { from: from || "", to: to || "" };
}

export function previousRange(from: string, to: string) {
  const start = new Date(`${from}T00:00:00`);
  const end = new Date(`${to}T00:00:00`);
  const days = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  );
  const prevEnd = new Date(start);
  prevEnd.setDate(start.getDate() - 1);
  const prevStart = new Date(prevEnd);
  prevStart.setDate(prevEnd.getDate() - days + 1);
  return {
    from: localISO(prevStart),
    to: localISO(prevEnd),
  };
}
