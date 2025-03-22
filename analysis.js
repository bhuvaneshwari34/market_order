let currentPrice = 100.0; // Initial price
let orders = []; // Stores all orders

// Simulate random price change every 2 seconds
function simulatePriceChange() {
  const randomChange = (Math.random() - 0.5) * 10; // Change between -5 and 5
  currentPrice = parseFloat((currentPrice + randomChange).toFixed(2)); // Update price with 2 decimal places
  document.getElementById("currentPrice").textContent = `Current Price: $${currentPrice}`;
  checkOrders(); // Check if any orders are filled
}

setInterval(simulatePriceChange, 2000); // Price updates every 2 seconds

// Place an order (limit or market)
function placeOrder() {
  const orderType = document.getElementById("orderType").value;
  const amount = parseInt(document.getElementById("orderAmount").value);
  const price = parseFloat(document.getElementById("orderPrice").value);
  
  // Validate input
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }

  if (orderType === "limit" && (isNaN(price) || price <= 0)) {
    alert("Please enter a valid limit price.");
    return;
  }

  const order = {
    type: orderType,
    amount: amount,
    price: orderType === "market" ? currentPrice : price,
    status: "pending"
  };

  orders.push(order);
  updateOrderList();
  document.getElementById("status").textContent = `Order placed: ${orderType} order for ${amount} units at ${order.price}`;

  // Automatically fill market orders
  if (orderType === "market") {
    fillMarketOrder(order);
  }
}

// Check if any limit orders are filled based on the current price
function checkOrders() {
  orders.forEach(order => {
    if (order.status === "pending") {
      if (order.type === "limit") {
        if ((order.amount > 0 && order.price <= currentPrice) || (order.amount < 0 && order.price >= currentPrice)) {
          order.status = "filled";
          updateOrderList();
          document.getElementById("status").textContent = `Limit order filled: ${order.amount} units at $${currentPrice}`;
        }
      }
    }
  });
}

// Fill market orders immediately at the current price
function fillMarketOrder(order) {
  order.status = "filled";
  updateOrderList();
  document.getElementById("status").textContent = `Market order filled: ${order.amount} units at $${currentPrice}`;
}

// Update the list of orders displayed on the page
function updateOrderList() {
  const orderListDiv = document.getElementById("orderList");
  orderListDiv.innerHTML = "";
  orders.forEach((order, index) => {
    const orderItem = document.createElement("div");
    orderItem.classList.add("order-item");
    orderItem.innerHTML = `
      <p>Order #${index + 1}: ${order.type} order</p>
      <p>Amount: ${order.amount}</p>
      <p>Price: $${order.price}</p>
      <p>Status: ${order.status}</p>
    `;
    orderListDiv.appendChild(orderItem);
  });
}
