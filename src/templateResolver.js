export const SUPPORTED_TEMPLATES = ["generic", "dotnet"];

export function validateTemplateName(templateName) {
  if (!SUPPORTED_TEMPLATES.includes(templateName)) {
    throw new Error(
      `Unsupported template "${templateName}". Supported templates: ${SUPPORTED_TEMPLATES.join(", ")}.`
    );
  }
}

export function applyTemplateVariables(content, variables) {
  let rendered = content;

  for (const [key, value] of Object.entries(variables)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    rendered = rendered.replace(pattern, value);
  }

  const unreplaced = rendered.match(/\{\{[^}]+\}\}/g);
  if (unreplaced) {
    throw new Error(
      `Template contains unreplaced placeholders: ${Array.from(new Set(unreplaced)).join(", ")}.`
    );
  }

  return rendered;
}
