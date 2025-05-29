// Firebase setup
firebase.initializeApp({
  apiKey: "AIzaSyAwaQ7OhY0rRPnW0BEoktS12Gs8Fimx0EU",
  authDomain: "consign-6e96c.firebaseapp.com",
  projectId: "consign-6e96c",
  storageBucket: "consign-6e96c.firebasestorage.app",
  messagingSenderId: "22124553748",
  appId: "1:22124553748:web:e32ad83471885d3005a901",
  measurementId: "G-2PF2G34N64"
});

const db = firebase.firestore();
const auth = firebase.auth();
const form = document.getElementById("item-form");
const tableBody = document.querySelector("#item-table tbody");

// 🔒 Auth check BEFORE doing anything else
auth.onAuthStateChanged(user => {
  if (!user) {
    console.log("Not signed in. Redirecting...");
    window.location.href = "login.html";
  } else {
    console.log("Signed in as:", user.email);
    renderItems();
  }
});

// Generate a random SKU
function generateSKU() {
  return 'SKU-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

// Render a single item row
function renderItem(doc) {
  const data = doc.data();
  const consignedDate = data.consignedDate?.toDate?.();
  const expiryDate = data.expiryDate?.toDate?.();

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${data.sku || "N/A"}</td>
    <td>${data.seller || "N/A"}</td>
    <td>${data.product || "N/A"}</td>
    <td>$${data.marketPrice?.toFixed(2) || "0.00"}</td>
    <td>$${data.buyingPrice?.toFixed(2) || "0.00"}</td>
    <td>$${data.sellingPrice?.toFixed(2) || "0.00"}</td>
    <td>${consignedDate ? consignedDate.toLocaleDateString() : "N/A"}</td>
    <td style="color: ${expiryDate && expiryDate < new Date() ? 'red' : 'green'}">
      ${expiryDate ? expiryDate.toLocaleDateString() : "N/A"}
    </td>
    <td><button onclick="deleteItem('${doc.id}')">Delete</button></td>
  `;
  tableBody.appendChild(row);
}

// Fetch and display inventory
function renderItems() {
  tableBody.innerHTML = "";
  db.collection("inventory")
    .orderBy("consignedDate", "desc")
    .get()
    .then(snapshot => {
      snapshot.forEach(renderItem);
    })
    .catch(error => {
      console.error("Error loading items:", error);
    });
}

// Delete an item
function deleteItem(id) {
  db.collection("inventory").doc(id).delete()
    .then(() => renderItems())
    .catch(error => console.error("Error deleting item:", error));
}

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const seller = document.getElementById("seller").value.trim();
  const product = document.getElementById("product").value.trim();
  const marketPrice = parseFloat(document.getElementById("marketPrice").value);
  const buyingPrice = parseFloat(document.getElementById("buyingPrice").value);
  const sellingPrice = parseFloat(document.getElementById("sellingPrice").value);
  const duration = parseInt(document.getElementById("duration").value);

  const sku = generateSKU();
  const consignedDate = new Date();
  const expiryDate = new Date();
  expiryDate.setDate(consignedDate.getDate() + duration);

  db.collection("inventory").add({
    sku,
    seller,
    product,
    marketPrice,
    buyingPrice,
    sellingPrice,
    consignedDate: firebase.firestore.Timestamp.fromDate(consignedDate),
    expiryDate: firebase.firestore.Timestamp.fromDate(expiryDate)
  })
  .then(() => {
    form.reset();
    renderItems();
  })
  .catch(error => {
    console.error("Error adding item:", error);
  });
});

// Sign out
function logout() {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
