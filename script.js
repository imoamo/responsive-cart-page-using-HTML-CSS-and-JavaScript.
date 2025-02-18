// Function to toggle the menu
function toggleMenu() {
  const menu = document.getElementById("menu");
  if (menu) {
    menu.classList.toggle("active");
  }
}

// Function to handle the responsive navbar behavior
function checkScreenSize() {
  const mediaQuery = window.matchMedia("(max-width: 1100px)");
  const hideLogo = window.matchMedia("(max-width: 660px)");


  if (mediaQuery.matches) {
    document.getElementById("responsiveNavbar").style.display = "flex";
    document.getElementById("normalNavbar").style.display = "none";
  } else {
    document.getElementById("responsiveNavbar").style.display = "none";
    document.getElementById("normalNavbar").style.display = "flex";
  }


  if (hideLogo.matches) {
    document.getElementById('hideLogo').style.display = "none";
  } else {
    document.getElementById('hideLogo').style.display = "flex";
  }
}


document.addEventListener("DOMContentLoaded", function () {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});



// Fetch cart data and populate cart
fetch('https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889')
  .then(response => response.json())
  .then(cartData => {
    // Populate the cart with items from the fetched data
    populateCart(cartData);
  })
  .catch(error => {
    console.error("Error fetching cart data:", error);
  });

// Function to format currency (Indian Rupees)
function formatCurrency(amount) {
  if (amount >= 100000) {
    return `₹ ${(amount / 100000).toFixed(1)}L`;
  }
  return `₹ ${amount.toLocaleString('en-IN')}`;
}
// Function to populate cart items dynamically
function populateCart(cartData) {
  const cartProductsContainer = document.getElementById("cartProducts");
  const subtotalElement = document.getElementById("subtotalPrice");
  const totalElement = document.getElementById("totalPrice");

  let subtotal = 0;

  // Loop through each cart item
  cartData.items.forEach(item => {
    const cartProduct = document.createElement("div");
    cartProduct.classList.add("cart_product");
    cartProduct.dataset.productId = item.id;

    // Create product image
    const productImageContainer = document.createElement("div");
    productImageContainer.setAttribute("data-label", "Image"); // Add label
    const productImage = document.createElement("img");
    productImageContainer.classList.add("product_image");
    productImage.src = item.image;
    productImage.alt = item.title;
    productImageContainer.appendChild(productImage);

    // Product title
    const productTitle = document.createElement("p");
    productTitle.setAttribute("data-label", "Product"); // Add label
    productTitle.textContent = item.title;

    // Product price
    const productPrice = document.createElement("p");
    productPrice.setAttribute("data-label", "Price"); // Add label
    productPrice.textContent = formatCurrency(item.price / 100);

    // Quantity box
    const quantityBox = document.createElement("div");
    quantityBox.setAttribute("data-label", "Quantity"); // Add label
    quantityBox.classList.add("quantity-box");

    const quantitySpan = document.createElement("span");
    quantitySpan.classList.add("quantity");
    quantitySpan.innerHTML = item.quantity;
    quantitySpan.addEventListener("click", () => {
      const newQuantity = prompt("Enter new quantity:", item.quantity);
      if (newQuantity && !isNaN(newQuantity) && newQuantity > 0) {
        item.quantity = newQuantity;
        quantitySpan.innerHTML = newQuantity;
        updateSubtotal(item, newQuantity);
      }
    });

    // Subtotal
    const productSubtotal = document.createElement("p");
    productSubtotal.setAttribute("data-label", "Subtotal"); // Add label
    productSubtotal.textContent = formatCurrency((item.price * item.quantity) / 100);
    productSubtotal.classList.add("product-subtotal");

    // Trash icon
    const trashIcon = document.createElement("div");
    const trashImg = document.createElement("img");
    trashImg.src = "./images/trash.png";
    trashImg.alt = "Remove Item";
    trashImg.style.width = "20px";
    trashImg.style.height = "auto";
    trashImg.style.cursor = "pointer";
    trashIcon.appendChild(trashImg);
    trashIcon.addEventListener("click", () => removeItem(item.id));

    // Append elements to cart product
    quantityBox.appendChild(quantitySpan);
    cartProduct.append(productImageContainer, productTitle, productPrice, quantityBox, productSubtotal, trashIcon);

    // Append cart product to container
    cartProductsContainer.appendChild(cartProduct);

    // Update subtotal
    subtotal += (item.price * item.quantity) / 100;
  });

  // Update the totals
  updateCartTotal(subtotal);
}
// Function to update the cart subtotal when the quantity changes
function updateSubtotal(item, quantity) {
  const newLinePrice = (item.price * quantity) / 100;
  item.line_price = newLinePrice;


  const productElement = document.querySelector(`[data-product-id="${item.id}"]`);
  const productSubtotal = productElement.querySelector(".product-subtotal");
  productSubtotal.textContent = formatCurrency(newLinePrice);


  const subtotal = Array.from(document.querySelectorAll(".product-subtotal"))
    .reduce((total, sub) => total + parseFloat(sub.textContent.replace('₹ ', '').replace('L', '') * 100000), 0);

  updateCartTotal(subtotal);
}
// Function to remove item from the cart
function removeItem(productId) {

  const productElement = document.querySelector(`[data-product-id="${productId}"]`);
  productElement.remove();


  const subtotal = Array.from(document.querySelectorAll(".product-subtotal"))
    .reduce((total, sub) => total + parseFloat(sub.textContent.replace('₹ ', '').replace(',', '')), 0);

  updateCartTotal(subtotal);
}

function updateCartTotal(subtotal) {
  const subtotalElement = document.getElementById("subtotalPrice");
  const totalElement = document.getElementById("totalPrice");
  subtotalElement.textContent = formatCurrency(subtotal);
  totalElement.textContent = formatCurrency(subtotal);
}