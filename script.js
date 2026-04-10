// تخزين المصفوفة في ال localStorage
let products = JSON.parse(localStorage.getItem("products")) || []

// pure function لاضافة منتج
const addProduct = (oldProducts, newProduct) => {
  const exists = oldProducts.some(p => p.id === newProduct.id)
  if (exists) return oldProducts
  return [...oldProducts, newProduct]
}

// pure function للحذف
const deleteProduct=(products,id) =>{
  return products.filter((product) => product.id !== id)
}
// edit product
const editProduct = (products,updatedProduct) => {
  return products.map(p => p.id === updatedProduct.id ? updatedProduct : p)
}

// pure function للبحث
const search=(products,name) =>{
  return products.filter((product) =>product.name.toLowerCase().includes(name.toLowerCase()))
}

// pure function for filter by category
const filterByCategory=(products,category) =>{
  if(category === "all"){
    return products
  }
  return products.filter((product) =>product.category.toLowerCase() === category.toLowerCase())
}

// pure function لحساب التوتل لل price
const calculateTotal=(products) =>{
  let sum = 0
  for(let i=0;i<products.length;i++){
      sum+= Number(products[i].price)
  }
  return sum
  // وممكن هيك 
    //   const calculateTotal = (products) => {
    //   return products.reduce((sum, product) => sum + product.price, 0);
    // };
}

// function for render products (لعرض المنتاجات الموجودة في الاري بروداكتس في الصفحة)
const renderProducts=(products)=>{
  const tableBody = document.getElementById("product-list")
  tableBody.innerHTML=""
  products.forEach(product => {
    tableBody.innerHTML += `
    <tr>
      <td><img src="${product.image}" class="table-img" width="50"></td>
      <td>${product.name}</td>
      <td>${product.details}</td>
      <td>${product.price}</td>
      <td>${product.category}</td>
      <td>
        <button onclick="editProdact(${product.id})"><i class="fas fa-edit"></i></button>
        <button onclick="deleteProduct(${product.id})"><i class="fas fa-trash"></i></button>
        <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})"></button>
      </td>
    </tr>
    `
  });
}

// عرض المنتاجات للمشتري
const renderBuyerProducts = (productList) => {
  const section = document.getElementById("products") 
  section.innerHTML =""
  productList.forEach(product =>{
        section.innerHTML += `
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
            <h4>${product.name}</h4>
            <span class="price">${product.price}$</span>
            <button class="add-to-cart-btn" onclick="handleAddToCart(${product.id})">Add to cart</button>
          </div>
          `
  })
} 

const form = document.querySelector(".form")

// فانكشين لاظهار او اخفاء الفورم

document.getElementById("add-product").addEventListener("click", () => {
  const addItem = document.getElementById("add-item")
  addItem.classList.toggle("item-hidden")
  if (!addItem.classList.contains("item-hidden") && editingId === null) {
    form.reset()
    document.querySelector(".form button[type='submit']").textContent = "Add Item"
  }
})

// الايفنت ليسينر اذا صار في عملية submit
  form.addEventListener("submit", (event) => {
    event.preventDefault()
    const imageValue = document.getElementById("product-image").value;
    const nameValue = document.getElementById("product-name").value;
    const detailsValue = document.getElementById("product-details").value;
    const priceValue = document.getElementById("product-price").value;
    const categoryValue = document.getElementById("product-category").value;
    const newProduct = {
        id: Date.now(),
        image: imageValue,
        name: nameValue,
        details: detailsValue,
        price: parseFloat(priceValue),
        category: categoryValue
    }
    if (editingId !== null) {
    // وضع التعديل
      products = editProduct(products, { ...newProduct, id: editingId })
      editingId = null
      document.querySelector(".form button[type='submit']").textContent = "Add Item";
    } 
    else {
      products = addProduct(products,newProduct)
      renderProducts(products)
    }
    localStorage.setItem("products",JSON.stringify(products))
    renderProducts(products)
    renderBuyerProducts(products)
    form.reset()
    document.getElementById("add-item").classList.add("item-hidden")
  })

  // بنستخدم هي الدالة عشان اربط بين البيور فانكشن للحذف و ال html 
  const handleDelete = (id) => {
    products = deleteProduct(products,id)
    // بعد الحذف بحدّث اللوكال ستوريج
    localStorage.setItem("products",JSON.stringify(products))
    // بعمل عرض للبروداكتس بعد الحذف بدون ما اعمل تحديث للصفحة
    renderProducts(products)
    renderBuyerProducts(products)
  }

  // بترتب مع البيور فانكشن اللي بتعمل filter by category
  const handleCategoryClick = (categoryName ,btn) => {
    const  filteredProducts = filterByCategory(products , categoryName)
    renderBuyerProducts(filteredProducts)
    document.querySelectorAll("aside button").forEach(b => b.classList.remove("category-activeBtn"));
    if (btn){ 
      btn.classList.add("category-activeBtn")
    }
  }
  
  const filterByPrice = (products , maxPrice) => {
    return products.filter(product => product.price <= Number(maxPrice))
  }

  const priceRange = document.getElementById("price-filter")
  const priceValueLabel = document.getElementById("price-value")

  priceRange.addEventListener("input" , (event) => {
    const price = event.target.value
    priceValueLabel.innerText = price
    // فلترةالمنتاجات حسب القيمة المحددة
    const filtered = filterByPrice(products,price)
    // عرض المفلتر حسب السعر المحدد
    renderProducts(filtered)
  })

  // add to cart function (pure function)
  const addToCart = (products,cart,id) =>{
    const addProductToCart = products.find(p => p.id === id)
    return [...cart, addProductToCart]
  }
  
  // remove product 
  const deleteFromCart= (cart , index) => {
    return[...cart.slice(0,index),...cart.slice(index+1)]
  }

  // مصفوفة السلة هيتم تخزين فيها البروداكتس اللي هنضيفهم الها
let cart = JSON.parse(localStorage.getItem("cart")) || []

// بدي اعمل handel للاشيا اللي بدي اضيفها للسلة
const handleAddToCart = (productId) =>{
  // تحديث السلة
  cart = addToCart(products,cart,productId)
  // حفظ لل local storage
  localStorage.setItem("cart",JSON.stringify(cart))
  renderCart()
}

const handleDeleteFromCart = (productId) =>{
  //حذف منتج من السلة
  cart = deleteFromCart(cart, productId)
  // حفظ لل local storage
  localStorage.setItem("cart",JSON.stringify(cart))
  renderCart()
}

const renderCart = () => {
  const cartList = document.getElementById("cart-list")
  const totalPrice = document.getElementById("total-price")
  const cartCount= document.getElementById("cart-count")
  cartList.innerHTML = ""
  // قائمة المنتاجات باسعارها
  cart.forEach((item) => {
    cartList.innerHTML += `<li>${item.name} - ${item.price}</li>`
  });
  // حساب السعر الإجمالي
  const total = calculateTotal(cart)
  totalPrice.innerText = ` Total Price: ${total}$`
  cartCount.innerText = `(${cart.length})`
}

const searchBtn = document.getElementById("search")
searchBtn.addEventListener("input", (e) => {
  const filtered = search(products, e.target.value)
  renderBuyerProducts(filtered)
});

let editingId = null

// تعديل product
const editProdact = (id) => {
  const product = products.find(p => p.id === id)
  if(product){
    document.getElementById("product-image").value = product.image
    document.getElementById("product-name").value = product.name
    document.getElementById("product-details").value = product.details
    document.getElementById("product-price").value = product.price
    editingId = id
    document.getElementById("add-item").classList.remove("item-hidden")
  document.querySelector(".form button[type='submit']").textContent = "Update Item"
  }
  return
}

// التبديل من المشتري للبائع
const switchToSellerPage=document.getElementById("switch-to-seller")
switchToSellerPage.addEventListener("click", () => {
  document.getElementById("buyer-page").classList.add("hidden")
  document.getElementById("buyer-page").classList.remove("active")
  document.getElementById("seller-page").classList.add("active")
  document.getElementById("seller-page").classList.remove("hidden")
})

// التبديل من البائع للمشتري

const switchToBuyerPage = document.getElementById("switch-to-buyer")
switchToBuyerPage.addEventListener("click", () => {
  document.getElementById("seller-page").classList.remove("active")
  document.getElementById("seller-page").classList.add("hidden")
  document.getElementById("buyer-page").classList.remove("hidden")
  document.getElementById("buyer-page").classList.add("active")
})

renderProducts(products)
renderBuyerProducts(products)
renderCart()