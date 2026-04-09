let products = JSON.parse(localStorage.getItem("products")) || [];

const addProduct=(newProduct,oldProduct) =>{
    for(let i=0;i<products.length;i++){
      if(products[i].id.includes(id)){
        console.log("the item exsists")
      }
      else{
        return [...oldProduct,newProduct]
      }
    }
}
const deleteProduct=(products,id) =>{
  return products.filter((product) => product.id !== id)
}
const search=(products,name) =>{
  return products.filter((product) =>product.name.toLowerCase().includes(name.toLowerCase()))
}
const filterByCategory=(products,category) =>{
  if(category === "All"){
    return products
  }
  else{
    return products.filter((product) =>product.category === category)
  }
}
const calculateTotal=(products) =>{
  let sum = 0
  for(let i=0;i<products.length;i++){
      sum+=products[i].price
  }
  return sum
  // وممكن هيك 
    //   const calculateTotal = (products) => {
    //   return products.reduce((sum, product) => sum + product.price, 0);
    // };
}
const renderProducts=(products)=>{
  const tableBody = document.getElementById("product-table")
  tableBody.innerHTML=""
  products.forEach(product => {
    tableBody += `
    <tr>
      <td><img scr="${product.image}" width="50"></td>
      <td>${product.name}</td>
      <td>${product.detalis}</td>
      <td>${product.price}</td>
      <td>${product.category}</td>
      <td>
        <button onclick="editProdact(${product.id})"></button>
        <button onclick="deleteProduct(${product.id}")></button>
      </td>
    </tr>
    `
  });
}
const form = document.querySelector(".form")
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const imageValue = document.getElementById("product-image").value;
    const nameValue = document.getElementById("product-name").value;
    const detailsValue = document.getElementById("product-details").value;
    const priceValue = document.getElementById("product-price").value;
    const newProduct = {
        id: Date.now(),
        image: imageValue,
        name: nameValue,
        details: detailsValue,
        price: priceValue
    }
  })