export async function getGraphToken() {
  const url = `https://login.microsoftonline.com/${import.meta.env.TENANT_ID}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: import.meta.env.CLIENT_ID,
    client_secret: import.meta.env.CLIENT_SECRET,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials"
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  const data = await response.json();

  if (!data.access_token) {
    throw new Error("Errore ottenendo il token Graph");
  }

  return data.access_token;
}
