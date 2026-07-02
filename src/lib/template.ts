// Pure template helpers — deliberately free of any database imports because
// client components (invite modal, settings form) run these in the browser.

export const DEFAULT_MESSAGE_TEMPLATE =
  "Hi {name}, you're warmly invited to Harry & Susan's wedding on {date} at {venue}. Please RSVP by {deadline}: {link}";

/** Fill {name} {link} {date} {venue} {deadline} in a template. */
export function renderTemplate(
  template: string,
  values: Record<string, string>,
): string {
  // Object.hasOwn (not `in`) so template placeholders like {toString} or
  // {constructor} are left literal instead of resolving to prototype members.
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    Object.hasOwn(values, key) ? values[key] : match,
  );
}
