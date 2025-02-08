const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const cryptos = ["Bitcoin", "Ethereum", "Cardano"];

exports.updateCryptoPrices = functions.pubsub
  .schedule("every 10 seconds")
  .onRun(async () => {
    for (let crypto of cryptos) {
      const ref = db.collection("cryptos").doc(crypto);
      const doc = await ref.get();

      let lastPrice = doc.exists ? doc.data().price : 1000; // Valeur initiale si non existante
      let newPrice = lastPrice * (1 + (Math.random() * 0.2 - 0.1)); // Variation aléatoire de ±10%

      await ref.set({ price: newPrice }, { merge: true });
      console.log(`${crypto} mis à jour : ${newPrice.toFixed(2)}`);
    }
    return null;
  });
