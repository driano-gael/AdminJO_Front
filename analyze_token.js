const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjI2NDA0NiwiaWF0IjoxNzUyMTc3NjQ2LCJqdGkiOiJhMzQxYjM0YThiYzI0MTExYTQ5OWZkZThiMGFjYjAyMCIsInVzZXJfaWQiOjJ9.9OXhNn3XKV34sM8__uzb2T8GIVdNiUilK1u5qORjaAg";

try {
  const payload = JSON.parse(
    Buffer.from(token.split(".")[1], "base64").toString()
  );

  console.log("=== ANALYSE DU REFRESH TOKEN ===");
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
    "Durée en heures:",
    Math.round((duration / 3600) * 100) / 100,
    "heures"
  );
  console.log(
    "Durée en jours:",
    Math.round((duration / 86400) * 100) / 100,
    "jours"
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
      Math.round((timeLeft / 3600) * 100) / 100,
      "heures"
    );
  } else {
    console.log("Expiré depuis:", Math.abs(timeLeft), "secondes");
    console.log(
      "Expiré depuis:",
      Math.round((Math.abs(timeLeft) / 3600) * 100) / 100,
      "heures"
    );
  }
} catch (error) {
  console.error("Erreur lors du décodage:", error.message);
}
