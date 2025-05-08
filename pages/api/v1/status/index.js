import database from "infra/database.js";

async function status(req, res) {
  const databaseName = process.env.POSTGRES_DB;
  const updatedAt = new Date().toISOString();
  const resultVersion = await database.query("SHOW server_version");
  const resultMaxConnections = await database.query("SHOW max_connections;");
  const resultUsedConnections = await database.query({
    text: "SELECT count(*) FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  return res.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: resultVersion.rows[0].server_version,
        max_connections: parseInt(resultMaxConnections.rows[0].max_connections),
        opened_connections: parseInt(resultUsedConnections.rows[0].count),
      },
    },
  });
}

export default status;
