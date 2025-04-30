import database from "infra/database.js";

async function status(req, res) {
  const result = await database.query("SELECT 1+1 as sum;");
  console.log(result.rows);
  return res.status(200).json({ teste: "Teste API STATUS" });
}

export default status;
