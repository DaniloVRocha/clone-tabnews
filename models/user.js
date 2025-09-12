import database from "infra/database";
import { NotFoundError, ValidationError } from "infra/errors.js";
import password from "models/password.js";

async function findOneByUsername(username) {
  const userFound = runSelectQuery(username);

  return userFound;

  async function runSelectQuery(username) {
    const result = await database.query({
      text: `
      SELECT 
        * 
      FROM 
        users 
      WHERE 
        LOWER(username) = LOWER($1)
      LIMIT 
        1
      ;`,
      values: [username],
    });

    if (result.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }
    return result.rows[0];
  }
}

async function create(userInputValues) {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function runInsertQuery(userInputValues) {
    const result = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password) 
      VALUES 
        ($1, $2, $3)
      RETURNING 
        *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function update(username, userInputValues) {
  const currentUser = await findOneByUsername(username);

  if (
    "username" in userInputValues &&
    userInputValues.username !== currentUser.username
  ) {
    await validateUniqueUsername(userInputValues.username);
  }
  if (
    "email" in userInputValues &&
    userInputValues.email !== currentUser.email
  ) {
    await validateUniqueEmail(userInputValues.email);
  }
  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };
  const updatedUser = await runUpdatedQuery(userWithNewValues);
  return updatedUser;

  async function runUpdatedQuery(userWithNewValues) {
    const result = await database.query({
      text: `
      UPDATE 
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *
      ;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });

    return result.rows[0];
  }
}

async function validateUniqueUsername(username) {
  const result = await database.query({
    text: `
      SELECT
        username
      FROM
        users
      WHERE
        LOWER(username) = LOWER($1)
      ;`,
    values: [username],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "Username já está em uso",
      action: "Utilize outro username",
    });
  }
}

async function validateUniqueEmail(email) {
  const result = await database.query({
    text: `
      SELECT
        email
      FROM
        users
      WHERE
        LOWER(email) = LOWER($1)
      ;`,
    values: [email],
  });

  if (result.rowCount > 0) {
    throw new ValidationError({
      message: "Email já está em uso",
      action: "Utilize outro email",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = { create, findOneByUsername, update };

export default user;
