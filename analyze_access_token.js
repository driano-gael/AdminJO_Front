const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNTIzMTk1LCJpYXQiOjE3NTI1MjI4OTUsImp0aSI6IjU4NGQwMDJkM2IxMTQ1OGNiMDFkZjI3NzEwNTY3OTNlIiwidXNlcl9pZCI6Mn0.yS89-LrPg4X46EdJFYAlVn6CrRhsRAlw0nI7lbouzpY";

try {
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  console.log("=== ANALYSE DE L'ACCESS TOKEN ===");
  console.log("Token type:", payload.token_type);
  console.log("User ID:", payload.user_id);
  console.log("JTI (Token ID):", payload.jti);
  console.log("");

  console.log("=== TIMESTAMPS ===");
  console.log(
    "Issued At (iat):",
    payload.iat,
    "→",
    new Date(payload.iat * 1000).toISOString()
  );
  console.log(
    "Expires At (exp):",
    payload.exp,
    "→",
    new Date(payload.exp * 1000).toISOString()
  );
  console.log("");

  console.log("=== DUREE DE VIE ===");
  const duration = payload.exp - payload.iat;
  console.log("Durée totale:", duration, "secondes");
  console.log(
    "Durée en minutes:",
    Math.round((duration / 60) * 100) / 100,
    "minutes"
  );
  console.log(
    "Durée en heures:",
    Math.round((duration / 3600) * 100) / 100,
    "heures"
  );
  console.log("");

  console.log("=== STATUT ACTUEL ===");
  const now = Math.floor(Date.now() / 1000);
  const isExpired = now > payload.exp;
  const timeLeft = payload.exp - now;

  console.log(
    "Timestamp actuel:",
    now,
    "→",
    new Date(now * 1000).toISOString()
  );
  console.log("Token expiré?", isExpired);

  if (!isExpired) {
    console.log("Temps restant:", timeLeft, "secondes");
    console.log(
      "Temps restant:",
      Math.round((timeLeft / 60) * 100) / 100,
      "minutes"
    );
  } else {
    console.log("Expiré depuis:", Math.abs(timeLeft), "secondes");
    console.log(
      "Expiré depuis:",
      Math.round((Math.abs(timeLeft) / 60) * 100) / 100,
      "minutes"
    );
  }
} catch (error) {
  console.error("Erreur lors du décodage:", error.message);
}
