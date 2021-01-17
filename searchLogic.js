const fileURL = "http://127.0.0.1:8887/products.json";

const search_input = document.getElementById("search");

const item_name = document.getElementById("new-item-name");
const item_type = document.getElementById("new-item-type");
const item_cp = document.getElementById("new-item-cp");
const item_cartage = document.getElementById("new-item-cartage");
const item_sp = document.getElementById("new-item-sp");

const results = document.getElementById("results");

let search_term = "";
let products;

$.support.cors = true;

const fetchItems = async () => {
  products = await fetch(fileURL).then((res) => res.json());
};

const updateItems = async (prods) => {
  fetch(fileURL, {
    method: "PUT",
    body: JSON.stringify(prods),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
  })
    .then((data) => {
        console.log(data);
        showItems();
    })
    .catch((err) => console.log(err));
};

const showItems = async () => {
  // clearHTML
  results.innerHTML = "";

  // getting the data
  await fetchItems();

  // creating the structure
  const table = document.createElement("table");
  table.classList.add("table");
  table.classList.add("table-striped");

  const th = `<tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Cost Price</th>
                    <th>Cartage</th>
                    <th>Total Cost Price</th>
                    <th>Selling Price</th>
                </tr>`;
  table.innerHTML += th;

  products
    .filter((product) =>
      product.name.toLowerCase().includes(search_term.toLowerCase())
    )
    .forEach((product) => {
      const tr = document.createElement("tr");

      const product_name = document.createElement("td");
      const product_type = document.createElement("td");
      const product_cp = document.createElement("td");
      const product_cartage = document.createElement("td");
      const product_tcp = document.createElement("td");
      const product_sp = document.createElement("td");

      product_name.innerText = product.name;
      product_type.innerText = product.type;
      product_cp.innerText = product.costPrice;
      product_cartage.innerText = product.cartage;
      product_tcp.innerText = +product.costPrice + +product.cartage;
      product_sp.innerText = product.sellingPrice;

      tr.appendChild(product_name);
      tr.appendChild(product_type);
      tr.appendChild(product_cp);
      tr.appendChild(product_cartage);
      tr.appendChild(product_tcp);
      tr.appendChild(product_sp);

      table.appendChild(tr);
    });
  results.appendChild(table);
};

// display initial countries
showItems();

search_input.addEventListener("input", (e) => {
  search_term = e.target.value;
  // re-display countries again based on the new search_term
  showItems();
});

document
  .getElementById("save-details-button")
  .addEventListener("click", (e) => {
    const name = item_name.value;
    const type = item_type.value;
    const cp = item_cp.value;
    const cartage = item_cartage.value;
    const sp = item_sp.value;

    AddOrUpdateItem(name, type, cp, cartage, sp);
    console.log(name, type, cp, cartage, sp);
    emptyForm();
  });

const AddOrUpdateItem = (name, type, cp, cartage, sp, id) => {
  if (name == "") return;
  if (id == null) {
    let new_id = products ? products.length + 1 : 1;
    let data = {
      id: new_id,
      name: name,
      type: type,
      costPrice: cp,
      cartage: cartage,
      sellingPrice: sp,
    };
    products.push(data);
  } else {
    let prod = products.filter((obj) => {
      return obj.id == id;
    });
    if (prod) {
      prod.name = name;
      prod.type = type;
      prod.costPrice = cp;
      prod.cartage = cartage;
      prod.sellingPrice = sp;
    }
  }
  updateItems(products);
};

const emptyForm = () => {
  item_name.value = "";
  item_cp.value = "";
  item_cartage.value = "";
  item_sp.value = "";
};

// From StackOverflow https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
