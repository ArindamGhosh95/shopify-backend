import bcrypt from "bcrypt";

export function hashPasswords(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  const hash: string = bcrypt.hashSync(password, salt);
  return hash;
}
export async function isPasswordMatch(
  enteredPassword: string,
  currentPassword: string
) {
  return await bcrypt.compare(enteredPassword, currentPassword);
}
