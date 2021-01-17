const fileURL = "http://127.0.0.1:8887/products.json";

const search_input = document.getElementById("search");
const search_category = document.getElementById("category-dropdown");

const item_name = document.getElementById("new-item-name");
const item_type = document.getElementById("new-item-type");
const item_cp = document.getElementById("new-item-cp");
const item_cartage = document.getElementById("new-item-cartage");
const item_sp = document.getElementById("new-item-sp");

const results = document.getElementById("results");

let search_term = "";
let selected_category = "";
let products;

let selectedIDforEditing = "";
$.support.cors = true;

const fetchItems = async () => {
  products = await fetch(fileURL).then((res) => res.json());
};

const updateItems = async (prods) => {
  fetch(fileURL, {
    method: "PUT",
    body: JSON.stringify(prods),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
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
                    <th>Sr. No.</th>
                    <th style="width: 60px;">Name</th>
                    <th>Type</th>
                    <th>Cost Price</th>
                    <th>Cartage</th>
                    <th>Total Cost Price</th>
                    <th>Selling Price</th>
                    <th>Badalna hai?</th>
                </tr>`;
  table.innerHTML += th;
  let i = 1;
  //products.sort((a, b) => (a.type > b.type) ? 1 : -1);

  products
    .filter((product) =>
      product.type.toLowerCase().includes(selected_category.toLowerCase())
    )
    .filter((product) =>
      product.name.toLowerCase().includes(search_term.toLowerCase())
    )
    .forEach((product) => {
      const tr = document.createElement("tr");

      const product_index = document.createElement("td");
      const product_name = document.createElement("td");
      const product_type = document.createElement("td");
      const product_cp = document.createElement("td");
      const product_cartage = document.createElement("td");
      const product_tcp = document.createElement("td");
      const product_sp = document.createElement("td");
      const product_edit = document.createElement("td");
      const product_delete = document.createElement("td");

      product_index.innerText = i++;
      product_name.innerText = product.name;
      product_name.style.cssText = "font-size: 20px; font-weight: 700;";
      product_type.innerText = product.type.toUpperCase();
      switch (product.type) {
        case "paint":
          tr.style.cssText = "background-color: salmon";
          break;
        case "hardware":
          tr.style.cssText = "background-color: cornflowerblue;";
          break;
        case "sanitory":
          tr.style.cssText = "background-color: aquamarine;";
          break;
        default:
      }
      product_cp.innerText = numberWithCommas(product.costPrice);
      //product_cp.style.cssText = "background-color: bisque;";
      product_cartage.innerText = numberWithCommas(product.cartage);
      //product_cartage.style.cssText = "background-color: cornsilk;";
      product_tcp.innerText = numberWithCommas(
        +product.costPrice + +product.cartage
      );
      //product_tcp.style.cssText = "background-color: bisque;";
      product_sp.innerText = numberWithCommas(product.sellingPrice);
      product_sp.style.cssText = "font-size: 20px;font-weight: 700;";//"background-color: lawngreen;";
      product_edit.innerHTML +=
        `<a class="btn" onclick="editModeON(` +
        product.id +
        `)"><i class="icon-edit"></i> Edit</a>`;
      product_delete.innerHTML +=
        `<a class="btn" style="background-color: red;" onclick="deleteElement(` +
        product.id +
        `)"><i class="icon-edit"></i> Delete</a>`;

      tr.appendChild(product_index);
      tr.appendChild(product_name);
      tr.appendChild(product_type);
      tr.appendChild(product_cp);
      tr.appendChild(product_cartage);
      tr.appendChild(product_tcp);
      tr.appendChild(product_sp);
      tr.appendChild(product_edit);
      tr.appendChild(product_delete);

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

search_category.addEventListener("input", (e) => {
  selected_category = e.target.value;
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

    if (selectedIDforEditing != "")
      AddOrUpdateItem(name, type, cp, cartage, sp, selectedIDforEditing);
    else AddOrUpdateItem(name, type, cp, cartage, sp);
    emptyForm();
  });

document.getElementById("close-edit-button").addEventListener("click", (e) => {
  emptyForm();
});

const AddOrUpdateItem = (name, type, cp, cartage, sp, id) => {
  if (name == "") return;
  if (id == null) {
    let new_id = products
      ? Math.max.apply(
          Math,
          products.map(function (o) {
            return o.id;
          })
        ) + 1
      : 1;
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
    if (!!prod) {
      prod[0].name = name;
      prod[0].type = type;
      prod[0].costPrice = cp;
      prod[0].cartage = cartage;
      prod[0].sellingPrice = sp;
    }
  }
  updateItems(products);
};

const deleteElement = (id) => {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) {
      products.splice(i, 1);
      break;
    }
  }
  updateItems(products);
};

const editModeON = (id) => {
  selectedIDforEditing = id;
  let prod = products.filter((obj) => {
    return obj.id == id;
  });
  if (!!prod) {
    item_name.value = prod[0].name;
    item_type.value = prod[0].type;
    item_cp.value = prod[0].costPrice;
    item_cartage.value = prod[0].cartage;
    item_sp.value = prod[0].sellingPrice;
  }
  $("#exampleModal").modal("show");
};

const emptyForm = () => {
  item_name.value = "";
  item_cp.value = "";
  item_cartage.value = "";
  item_sp.value = "";
  selectedIDforEditing = "";
};

// From StackOverflow https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
