<!DOCTYPE html>
<html>
<head>
    <title>Mini POS</title>
</head>
<body>

    <h1>Mini POS System </h1>

    <h3>Add Product</h3>
    <input type="text" id="name" placeholder="Product Name">
    <input type="number" id="price" placeholder="Price">
    <button onclick="addProduct()">Add Product</button>

    <h3>Products</h3>
    <button onclick="getProducts()">Load Products</button>
    <ul id="productList"></ul>

<script>

async function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;

    await fetch("http://localhost:3000/add-product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, price })
    });

    alert("Product Added ✅");
}
consol.log async (params) => {
    
}

async function getProducts() {
    const response = await fetch("http://localhost:3000/products");
    const products = await response.json();

    const list = document.getElementById("productList");
    list.innerHTML = "";

    products.forEach(product => {
        const li = document.createElement("li");
        li.textContent = product.name + " - ₦" + product.price;
        list.appendChild(li);
    });
}

</script>

</body>
</html>