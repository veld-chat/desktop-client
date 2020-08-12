const nickRegex = /^[A-Za-z0-9][A-Za-z0-9\-]{0,15}$/;
const slashRegex = /-+/g

export function validate(input: string): string {
  return input?.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function normalizeName(name: string): string {
  name = name.replace(slashRegex, '-');

  if (!nickRegex.test(name)) {
    throw new Error("Your nickname is invalid; only letters, numbers or slashes are allowed with a max length of 16.");
  }

  return name;
}

export function escapeHtml(input: string) {
  if (!input) {
    return "";
  }

  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
