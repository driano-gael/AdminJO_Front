const refreshToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc1MjYwOTIzNSwiaWF0IjoxNzUyNTIyODk1LCJqdGkiOiI3NTc0ZTY2MTBjODQ0YWI2YWMzMWIyMjEyYmY4NDg4ZiIsInVzZXJfaWQiOjJ9.HPW9oQbRTSfZqSSyuvnaVYNxUefvvYZTwSP8KtuO3LM";
const accessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUyNTIzMTk1LCJpYXQiOjE3NTI1MjI4OTUsImp0aSI6IjU4NGQwMDJkM2IxMTQ1OGNiMDFkZjI3NzEwNTY3OTNlIiwidXNlcl9pZCI6Mn0.yS89-LrPg4X46EdJFYAlVn6CrRhsRAlw0nI7lbouzpY";

function analyzeToken(token, name) {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    console.log(`=== ANALYSE ${name.toUpperCase()} ===`);
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
      console.log(
        "Temps restant:",
        Math.round((timeLeft / 3600) * 100) / 100,
        "heures"
      );
    } else {
      console.log("Expiré depuis:", Math.abs(timeLeft), "secondes");
      console.log(
        "Expiré depuis:",
        Math.round((Math.abs(timeLeft) / 60) * 100) / 100,
        "minutes"
      );
    }

    console.log("");
    return { payload, isExpired, timeLeft };
  } catch (error) {
    console.error(`Erreur lors du décodage ${name}:`, error.message);
    return null;
  }
}

console.log("🔍 ANALYSE DES TOKENS JWT");
console.log("========================");
console.log("");

const accessAnalysis = analyzeToken(accessToken, "ACCESS TOKEN");
const refreshAnalysis = analyzeToken(refreshToken, "REFRESH TOKEN");

console.log("🎯 RÉSUMÉ");
console.log("=========");
if (accessAnalysis && refreshAnalysis) {
  console.log(
    "Access Token:",
    accessAnalysis.isExpired ? "❌ EXPIRÉ" : "✅ VALIDE"
  );
  console.log(
    "Refresh Token:",
    refreshAnalysis.isExpired ? "❌ EXPIRÉ" : "✅ VALIDE"
  );

  if (accessAnalysis.isExpired && !refreshAnalysis.isExpired) {
    console.log("");
    console.log("🔄 SITUATION: Access token expiré mais refresh token valide");
    console.log("➡️ Le système devrait automatiquement refresh le token");
  } else if (!accessAnalysis.isExpired) {
    console.log("");
    console.log("✅ SITUATION: Access token encore valide");
    console.log("➡️ Pas besoin de refresh pour le moment");
  } else {
    console.log("");
    console.log("❌ SITUATION: Les deux tokens sont expirés");
    console.log("➡️ Reconnexion nécessaire");
  }
}
