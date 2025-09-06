import bcryptjs from "bcryptjs";

//TODO: implementar pepper
async function hash(password) {
  const rounds = getNumberOfRounds();
  return await bcryptjs.hash(password, rounds);
}

async function compare(providedPassword, storedHashedPassword) {
  return await bcryptjs.compare(providedPassword, storedHashedPassword);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

const password = {
  hash,
  compare,
};

export default password;
