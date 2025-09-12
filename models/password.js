import bcryptjs from "bcryptjs";

//TODO: implementar pepper
async function hash(password) {
  const rounds = getNumberOfRounds();
  const passwordPeppered = getPasswordPeppered(password);
  return await bcryptjs.hash(passwordPeppered, rounds);
}

async function compare(providedPassword, storedHashedPassword) {
  const providedPasswordPeppered = getPasswordPeppered(providedPassword);
  return await bcryptjs.compare(providedPasswordPeppered, storedHashedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

function getPasswordPeppered(password) {
  const pepper = process.env.PEPPER_SECRET || "";
  return password + pepper;
}

const password = {
  hash,
  compare,
};

export default password;
