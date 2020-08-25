if (document.location.pathname === "/cart1.html") {
  document.addEventListener("DOMContentLoaded", show);
} else {
  document.addEventListener("DOMContentLoaded", ready);
}

function onLoadCartNumbers() {
  let productNumbers = localStorage.getItem("cartNumbers");
  if (productNumbers) {
    document.querySelector(".cart span").textContent = productNumbers;
  } else {
    localStorage.setItem("cartNumbers", 0);
  }
}

function ready() {
  onLoadCartNumbers();
  var addToCartButtons = document.getElementsByClassName("add-cart");
  for (var i = 0; i < addToCartButtons.length; i++) {
    var button = addToCartButtons[i];
    button.addEventListener("click", addToCartClicked);
  }
}

let products = [];
function addToCartClicked(event) {
  let productNumbers = localStorage.getItem("cartNumbers");
  productNumbers = parseInt(productNumbers);

  var button = event.target;
  var price = button.previousElementSibling.innerText;
  var title = button.previousElementSibling.previousElementSibling.innerText;

  var imageSrc = button.parentElement.getElementsByClassName("pic")[0].src;

  let obj = {
    image: imageSrc,
    titre: title,
    prix: price,
  };

  let tab = JSON.parse(localStorage.getItem("tab"));
  if (tab != null) {
    let index = 0;
    for (var i = 0; i < tab.length; i++) {
      if (tab[i].titre === title) {
        index++;
      }
    }
    if (index != 0) {
      alert("existe");
    } else {
      localStorage.setItem("cartNumbers", productNumbers + 1);
      document.querySelector(".cart span").textContent = productNumbers + 1;
      tab.push(obj);
      localStorage.setItem("tab", JSON.stringify(tab));
      return;
    }
  } else if (tab == null) {
    localStorage.setItem("cartNumbers", productNumbers + 1);
    document.querySelector(".cart span").textContent = productNumbers + 1;
    products.push(obj);
    localStorage.setItem("tab", JSON.stringify(products));
  }
}

function show() {
  let tab = JSON.parse(localStorage.getItem("tab"));
  if (tab.length != 0) {
    document.getElementById("title").style.display = "none";
    document.getElementById("myP").style.display = "block";
  }
  for (var i = 0; i < tab.length; i++) {
    elements(tab, tab[i].titre, tab[i].prix, tab[i].image);
  }
}

function elements(tab, title, price, imageSrc) {
  var cartRow = document.createElement("div");
  cartRow.classList.add("cart-row");
  var cartItems = document.getElementsByClassName("cart-items")[0];
  var cartItemNames = cartItems.getElementsByClassName("cart-item-title");

  var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
            <a href="#!" type="button" class="card-link-secondary small text-uppercase"><i
                        class="fas fa-heart mr-1"></i></a>
        </div>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  cartRow
    .getElementsByClassName("btn-danger")[0]
    .addEventListener("click", removeCartItem);
  cartRow
    .getElementsByClassName("cart-quantity-input")[0]
    .addEventListener("change", quantityChanged);
  let hearts = Array.from(document.getElementsByClassName("fas fa-heart mr-1"));
  for (let heart of hearts) {
    heart.addEventListener("click", function () {
      if (heart.style.color === "red") {
        heart.style.color = "#007bff";
      } else {
        heart.style.color = "red";
      }
    });
    updateCartTotal();
  }

  function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    title = buttonClicked.parentElement.parentElement.children[0].innerText.trim();
    for (var i = 0; i < tab.length; i++) {
      if (tab[i].titre === title) {
        tab.splice(i, 1);
        localStorage.setItem("tab", JSON.stringify(tab));
        localStorage.setItem("cartNumbers", tab.length);
      }
    }
    if (tab.length == 0) {
      document.getElementById("myP").style.display = "none";
      document.getElementById("title").style.display = "block";
    }
    updateCartTotal();
  }

  function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updateCartTotal();
  }

  function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0];
    var cartRows = cartItemContainer.getElementsByClassName("cart-row");
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
      var cartRow = cartRows[i];
      var priceElement = cartRow.getElementsByClassName("cart-price")[0];
      var quantityElement = cartRow.getElementsByClassName(
        "cart-quantity-input"
      )[0];
      var price = parseFloat(priceElement.innerText.replace("$", ""));
      var quantity = quantityElement.value;
      total = total + price * quantity;
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName("cart-total-price")[0].innerText =
      total + " TND";
  }
}
