import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();

  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status Page</h1>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
    //dedupingInterval: 2000
  });

  let updatedAtText = "Carregando ... ";
  let databaseVersion = "Carregando ... ";
  let databaseMaxConnections = "Carregando ... ";
  let databaseOpenedConnections = "Carregando ... ";

  if (!isLoading && data) {
    let databaseStatus = data.dependencies.database;
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    databaseVersion = databaseStatus.version;
    databaseMaxConnections = databaseStatus.max_connections;
    databaseOpenedConnections = databaseStatus.opened_connections;
  }

  return (
    <>
      <h3>Ultima atualização: {updatedAtText}</h3>
      <br />
      <h3>Status do banco de dados:</h3>
      <h5>Versão do banco de dados :{databaseVersion}</h5>
      <h5>Máximo de conexões : {databaseMaxConnections}</h5>
      <h5>Conexões abertas : {databaseOpenedConnections}</h5>
    </>
  );
}
