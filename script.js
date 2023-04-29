async function getMenu() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/saksham-accio/f2_contest_3/main/food.json");
    const data = await response.json();

    const menuDiv = document.getElementById("menu");

    data.forEach((item) => {
      menuDiv.innerHTML += `
        <div class="col-md-4 col-lg-3 item">
          <img src="${item.imgSrc}" alt="${item.name}" height="50" width="100">
          <h3>${item.name}</h3>
          <p>Price: ${item.price}</p>
          <button class="add-to-order-btn" onclick="addToOrder('${item.name}', ${item.price})">Add to Order</button>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error fetching data from API:", error);
    const menuDiv = document.getElementById("menu");
    menuDiv.innerHTML = "Error fetching data from API";
  }
}

getMenu();

function addToOrder(name, price) {
  const orderSummaryItemsDiv = document.getElementById("order-summary-items");
  const orderSummaryTotalDiv = document.getElementById("order-summary-total");

  let itemHtml = `<p>${name}: ${price}</p>`;
  orderSummaryItemsDiv.innerHTML += itemHtml;

  let currentTotal = parseFloat(orderSummaryTotalDiv.innerHTML.split(" ")[1]) || 0;
  let newTotal = currentTotal + price;
  orderSummaryTotalDiv.innerHTML = `<h3>Total: ${newTotal.toFixed(2)}</h3>`;
}

async function takeOrder() {
  try {
    const burgers = [
      { name: "Classic Burger", price: 10 },
      { name: "Cheeseburger", price: 12 },
      { name: "Bacon Cheeseburger", price: 14 },
      { name: "Veggie Burger", price: 10 },
      { name: "Mushroom Swiss Burger", price: 13 },
    ];

    const order = {
      burgers: [],
      total: 0,
    };

    for (let i = 0; i < 3; i++) {
      const burgerIndex = Math.floor(Math.random() * burgers.length);
      const burger = burgers[burgerIndex];
      order.burgers.push(burger);
      order.total += burger.price;
    }

    const orderSummary = getOrderSummary(order);
    const takeOrderButton = `
      <button class="btn btn-primary x" onclick="takeOrder()">Take Order</button>
    `;
    let summaryHtml = "";
    summaryHtml += takeOrderButton;

    const orderDiv = document.getElementById("order-summary");
    orderDiv.innerHTML = orderSummary + summaryHtml;

    const orderStatus = await orderPrep();
    if (orderStatus.paid) {
      throw new Error("Order has already been paid");
    }

    const paymentStatus = await payOrder();
    if (!paymentStatus.paid) {
      throw new Error("Payment has not been processed");
    }

    thankyouFnc();
  } catch (error) {
    console.error(error);
  }
}

function getOrderSummary(order) {
  let summaryHtml = "<h2>Order Summary</h2>";
  let total = 0;
  for (let i = 0; i < order.burgers.length; i++) {
    const burger = order.burgers[i];
    summaryHtml +=`<p>${burger.name} - $${burger.price}</p>`;
    total += burger.price;
  }
  summaryHtml += `<h3>Total: $${order.total}</h3>`;
  return summaryHtml;
}

// Function to prepare order
function orderPrep() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = "Order Status:True and Payment:False";
      resolve({ order_status: true, paid: false });
    }, 1500);
  });
}

// Function to process payment for order
function payOrder() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = "Order Status:True and Payment:True";
      resolve({ order_status: true, paid: true });
    }, 1000);
  });
}

// Function to display a thank you message and reload the page
function thankyouFnc() {
  alert("Thank you for eating with us today!");
  location.reload();
}

// Function to take order using promises
function takeOrder() {
  orderPrep()
    .then((order) => {
      if (order.paid) {
        throw new Error("Order has already been paid");
      }
      return payOrder();
    })
    .then((order) => {
      if (!order.paid) {
        throw new Error("Payment has not been processed");
      }
      thankyouFnc();
    })
    .catch((error) => {
      console.error(error);
    });
}

// Function to take order using async/await
async function takeOrderAsync() {
  try {
    const order = await orderPrep();
    if (order.paid) {
      throw new Error("Order has already been paid");
    }
    const payment = await payOrder();
    if (!payment.paid) {
      throw new Error("Payment has not been processed");
    }
    thankyouFnc();
  } catch (error) {
    console.error(error);
  }
}

// On load of screen, get menu
getMenu();

// Add click event listener to take order button
const takeOrderButton = document.getElementById("take-order-button");
takeOrderButton.addEventListener("click", takeOrderAsync);