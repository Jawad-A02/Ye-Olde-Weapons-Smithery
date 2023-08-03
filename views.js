const { Styles } = require("./styles");

/*********
  Scripts
 *********/

// set Header nav anchors, skip current page
const setAnchor = (page, href) => {
  return page === href ? "style=pointer-events:none" : `href="/${href}"`;
};

/************
  Components
 ************/

// Head
const Head = title => {
  return /*html*/ `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${Styles()}
</head>

`;
};

// Header
const Header = (title, page) => {
  return /*html*/ `

<body>
  <header>
    <nav>
      <h1>Ye Olde Weapons Smithery</h1>
      <h2>${title}</h2>
      <ul>
        <li><a href="/home">Home</a></li>
        <li><a href="/customers">Customers</a></li>
        <li><a href="/invoices">Invoices</a></li>
        <li><a href="/sales">Sales</a></li>
        <li><a href="/weapons">Weapons</a></li>
        <li><a href="/materials">Materials</a></li>
        <li><a href="/weaponmaterials">Weapon Materials</a></li>
      </ul>
    </nav>
  </header>
  <main>

`;
};

// Footer
const Footer = () => {
  return /*html*/ `

  </main>
  <footer>
    <p>Created by Jawad Abdullah, Jeffrey Valcher -- &copy; 2023</p>
  </footer>
</body>
</html>

`;
};

/*
  Table
  -------------
  arr = [<th>, <th>, <th>]
  data = obj
*/
const Table = (arr, data) => {
  // th
  let ths = "";
  arr.forEach(th => {
    ths += `<th>${th}</th>`;
  });

  // td
  let rows = ``;
  for (let i = 0; i < data.length; i++) {
    let tds = "";
    for (let [key, value] of Object.entries(data[i])) {
      tds += `<td>${value}</td>`;
    }
    rows += `<tr>${tds}</tr>`;
  }

  return /*html*/ `

<div class="table-container">
  <table>
    <tr>
      ${ths}
    </tr>
    ${rows}
  </table>
</div>

`;
};

/*
  Form
  -----
  divClass = add
  method = POST
  legend = 'Add Customer'
  inputs = htmlObject
  button = 'Add'

*/
const Form = (divClass, method, path, action, legend, inputs, button) => {
  return /*html*/ `

  <div class="${divClass}">
    <form method="${method}" action="${path}?_method=${action}">
      <fieldset>
        <legend><strong>${legend}</strong></legend>
          ${inputs}
        <button type="submit">${button}</button>
      </fieldset>
    </form>
  </div>

`;
};

/*
  Input
  ------
  type = 'text', 'dropdown'
  forId = 'customer-add-name'
  label = 'Name:'
  data = database object
  query = attribute match e.g. "customer_id"
  hr = 'hr', ''
*/
const Input = (type, forId, label, data, query, hr = "") => {
  let input = "";
  let hr_elem = hr === "hr" ? "<hr>" : "";

  if (type === "text") {
    input = /*html*/`

      <label for="${forId}">${label}</label>
      <input id="${forId}" name="${forId}" type="text" />
      ${hr_elem}

    `;

  } else if (type === "dropdown") {
    let options = "";
    if (data) {
      for (let i = 0; i < data.length; i++) {
        for (let [key, value] of Object.entries(data[i])) {
          if (key === query) {
            options += /*html*/`

              <option value="${value}">${value}</option>

            `;
          }
        }
      }
      input = /*html*/`

      <label for="${forId}">${label}</label>
      <select name="${forId}" id="${forId}">
        ${options}
      </select>
      ${hr_elem}

    `;
    } else {
      input = /*html*/`

      <label for="${forId}">${label}</label>
      <select name="${forId}" id="${forId}">
        <!-- populated with addOptions() -->
      </select>

      ${hr_elem}
    `;
    }

  } else if (type === "date") {
    input = /*html*/`

      <label for="${forId}">${label}</label>
      <input id="${forId}" name="${forId}" type="date"
             placeholder="dd-mm-yyy" />
      ${hr_elem}

    `;

  } else if (type === "dropdown_level") {
    let options = "";
    for (let i = 1; i <= 10; i++) {
      options += `

        <option value="${i}">${i}</option>

      `;
    }
    input = /*html*/`

      <label for="${forId}">${label}</label>
      <select name="${forId}" id="${forId}">
        ${options}
      </select>
      ${hr_elem}

    `;
  }

  return input;
};

/*******
  Views
 *******/

// Home
const Home = () => {
  return `

${Head("home")}
${Header("home")}

<div id="home-container">
<div id="home-img-container">
  <img
    id="home-img"
    src="https://manuscriptminiatures.com/image/21296/1000"
  />
  <p style="text-align: right;"><cite>The Gorleston Psalter</cite></p>
  <p style="text-align: right;">British Library</p>
</div>
</div>

${Footer()}

`;
};

// Customers
const Customers = data => {
  let addInputs = `
    ${Input("text", "customer-add-name", "Name:")}
    ${Input("dropdown_level", "customer-add-level", "Level:")}
  `;

  let editInputs = `
    ${Input("dropdown", "customer-edit-id", "Customer ID:", data, "customer_id", "hr")}
    ${Input("text", "customer-edit-name", "Name:")}
    ${Input("dropdown_level", "customer-edit-level", "Edit level:")}
  `;

  let deleteInput = `
    ${Input("dropdown", "customer-delete-name", "Customer Name:", data, "name", "hr")}
  `;

  return `

${Head("Customers")}
${Header("Customers", "customers")}

${Table(["Customer ID", "Name", "Level"], data)}

<div class="forms-container">
  ${Form("add", "POST", "/customers", "POST", "Add Customer", addInputs, "Add")}
  ${Form("edit", "POST", "/customers", "PUT", "Edit Customer", editInputs, "Edit")}
  ${Form("delete", "POST", "/customers", "DELETE", "Delete Customer", deleteInput, "Delete")}
</div>

${Footer()}

`;
};

// Invoices
const Invoices = (invoiceData, customerData) => {

  console.log(invoiceData)

  // format date values to yyyy-mm-dd, total_price to two decimal places
  const invoiceObj = invoiceData.map(item => {
    const date = new Date(item.date);
    const formattedDate = date.toISOString().slice(0, 10);
    //const formattedPrice = item.total_price.toFixed(2);
    return {
      ...item,
      date: formattedDate,
      //total_price: formattedPrice
    };
  });

  let addInputs = `
    ${Input("dropdown", "invoice-add-customer-name", "Customer Name:", customerData, "name")}
    ${Input("date", "invoice-add-date", "Date:")}
  `;

  let editInputs = `
    ${Input("dropdown", "invoice-edit-ids", "Invoice ID:", invoiceObj, "invoice_id", "hr")}
    ${Input("dropdown", "invoice-edit-customer-name", "Customer Name:", customerData, "name")}
    ${Input("date", "invoice-edit-date", "Date:")}
  `;

  let deleteInput = `
    ${Input("dropdown", "invoice-delete-ids", "Invoice ID:", invoiceObj, "invoice_id", "hr")}
  `;

  return `

${Head("Invoices")}
${Header("Invoices", "invoices")}

${Table(["Invoice ID", "Customer Name", "Date", "Total price"], invoiceObj)}

<div class="forms-container">
  ${Form("add", "POST", "/invoices", "POST", "Add Invoice", addInputs, "Add")}
  ${Form("edit", "POST", "/invoices", "PUT", "Edit Invoice", editInputs, "Edit")}
  ${Form("delete", "POST", "/invoices", "DELETE", "Delete Invoice", deleteInput, "Delete")}
</div>

${Footer()}

`;
};

// Materials
const Materials = data => {
  let addInputs = `
    ${Input("text", "material-add-name", "Name:")}
    ${Input("text", "material-add-pounds", "Pounds available:")}
    ${Input("text", "material-add-cost", "Cost per pound:")}
  `;

  let editInputs = `
    ${Input("dropdown", "material-edit-ids", "Material ID:", data, "material_id", "hr")}
    ${Input("text", "material-edit-name", "Name:")}
    ${Input("text", "material-edit-pounds", "Pounds available:")}
    ${Input("text", "material-edit-cost", "Cost per pound:")}
  `;

  let deleteInput = `
    ${Input("dropdown", "material-delete-name", "Material Name:", data, "name", "hr")}
  `;

  return `

${Head("Materials")}
${Header("Materials", "materials")}

${Table(["Material ID", "Name", "Pounds available", "Cost per pound"], data)}

<div class="forms-container">
  ${Form("add", "POST", "/materials", "POST", "Add Material", addInputs, "Add")}
  ${Form("edit", "POST", "/materials", "PUT", "Edit Material", editInputs, "Edit")}
  ${Form("delete", "POST", "/materials", "DELETE", "Delete Material", deleteInput, "Delete")}
</div>

${Footer()}

`;
};

// Sales
const Sales = (salesData, weaponData, invoiceData) => {

  let addInputs = `
    ${Input("dropdown", "sale-add-invoice-id", "Invoice ID:", invoiceData, "invoice_id")}
    ${Input("dropdown", "sale-add-weapon-name", "Weapon Name:", weaponData, "name")}
    ${Input("text", "sale-add-price", "Price:")}
  `;

  let editInputs = `
    ${Input("dropdown", "sale-edit-sale-id", "Sale ID:", salesData, "sale_id", "hr")}
    ${Input("dropdown", "sale-edit-invoice-id", "Invoice ID:", invoiceData, "invoice_id")}
    ${Input("dropdown", "sale-edit-weapon-name", "Weapon Name:", weaponData, "name")}
    ${Input("text", "sale-edit-price", "Price:")}
  `;

  let deleteInput = `
    ${Input("dropdown", "sale-delete-ids", "Sale ID:", salesData, "sale_id", "hr")}
  `;

  return `

${Head("Sales")}
${Header("Sales", "sales")}

${Table(["Sale ID", "Invoice ID", "Weapon Name", "Price"], salesData)}

<div class="forms-container">
  ${Form("add", "POST", "/sales", "POST", "Add Sale", addInputs, "Add")}
  ${Form("edit", "POST", "/sales", "PUT", "Edit Sale", editInputs, "Edit")}
  ${Form("delete", "POST", "/sales", "DELETE", "Delete Sale", deleteInput, "Delete")}
</div>

${Footer()}

<script>
  


</script>

`;
};

// Weapons
const Weapons = (data) => {
  let addInputs = `
    ${Input("text", "weapon-add-name", "Name:")}
    ${Input("dropdown_level", "weapon-add-level", "Level:")}
    ${Input("text", "weapon-add-magic", "Magical ability:")}
    ${Input("text", "weapon-add-cost", "Total cost:")}
  `;

  let editInputs = `
    ${Input("dropdown", "weapon-edit-weapon-id", "Weapon ID:", data, "weapon_id", "hr")}
    ${Input("text", "weapon-edit-name", "Name:")}
    ${Input("dropdown_level", "weapon-edit-level", "Level:")}
    ${Input("text", "weapon-edit-magic", "Magical ability:")}
    ${Input("text", "weapon-edit-cost", "Total cost:")}
  `;

  let deleteInput = `
    ${Input("dropdown", "weapon-delete-name", "Weapon Name:", data, "name", "hr")}
  `;

  return `

${Head("Weapons")}
${Header("Weapons", "weapons")}

${Table(["Weapon ID", "Name", "Level", "Magical Ability", "Total Cost"], data)}

<div class="forms-container">
  ${Form("add", "POST", "/weapons", "POST", "Add Weapon", addInputs, "Add")}
  ${Form("edit", "POST", "/weapons", "PUT", "Edit Weapon", editInputs, "Edit")}
  ${Form("delete", "POST", "/weapons", "DELETE", "Delete Weapon", deleteInput, "Delete")}
</div>

${Footer()}

`;
};

// WeaponMaterials
const WeaponMaterials = (weapMatData, weaponData, materialData) => {

  let addInputs = `
    ${Input("dropdown", "weapmat-add-weapon-name", "Weapon Name:", weaponData, "name")}
    ${Input("dropdown", "weapmat-add-material-name", "Material Name:", materialData, "name")}
    ${Input("text", "weapmat-add-pounds", "Pounds used:")}
  `;

  let editInputs = `
    ${Input("dropdown", "weapmat-edit-weapon-name", "Weapon Name:", weaponData, "name", "hr")}
    ${Input("dropdown", "weapmat-edit-material-name", "Material Name:", materialData, "name")}
    ${Input("text", "weapmat-edit-pounds", "Pounds used:")}
  `;

  let deleteInput = `
    ${Input("dropdown", "weapmat-delete-weapon-name", "Weapon Name:", weapMatData, "weaponName")}
    ${Input("dropdown", "weapmat-delete-material-name", "Material Name:", weapMatData, "materialName")}
  `;

  return `

${Head("Weapon Materials")}
${Header("Weapon Materials", "weaponmaterials")}

${Table(["Weapon Name", "Material Name", "Pounds Used"], weapMatData)}

<div class="forms-container">
  ${Form("add", "POST", "/weaponMaterials", "POST", "Add Weapon Material", addInputs, "Add")}
  ${Form("edit", "POST", "/weaponMaterials", "PUT", "Edit Weapon Material", editInputs, "Edit")}
  ${Form("delete", "POST", "/weaponMaterials", "DELETE", "Delete Weapon Material", deleteInput, "Delete")}
</div>

${Footer()}

<script>
  
const weaponAddDropdown = document.getElementById('weapmat-add-weapon-name');
const materialAddDropdown = document.getElementById('weapmat-add-material-name');
const weaponEditDropdown = document.getElementById('weapmat-edit-weapon-name');
const materialEditDropdown = document.getElementById('weapmat-edit-material-name');
const weaponDeleteDropdown = document.getElementById('weapmat-delete-weapon-name');
const materialDeleteDropdown = document.getElementById('weapmat-delete-material-name');

// store all materials from dropdown
let allMaterials = [];
for (let i = 0; i < materialAddDropdown.options.length; i++) {
  allMaterials.push(materialAddDropdown.options[i].value);
}

// add options to dropdown from array of values
const addOptions = (valsArr, dropdown) => {
  valsArr.forEach(val => {
    const option = document.createElement('option');
    option.value = val;
    option.innerText = val;
    dropdown.appendChild(option);
  });
}


// remove duplicate options from dropdowns
const removeMaterialDuplicates = (inputId) => {
  let optionVals = [];
  const dropdown = document.getElementById(inputId);
  for (let i = 0; i < dropdown.length; i++) {
    if (!optionVals.includes(dropdown.options[i].value)) {
      optionVals.push(dropdown.options[i].value);
    }
  }
  dropdown.innerHTML = '';
  addOptions(optionVals, dropdown);
};
removeMaterialDuplicates('weapmat-add-material-name'); 
removeMaterialDuplicates('weapmat-edit-material-name'); 
removeMaterialDuplicates('weapmat-delete-material-name'); 
removeMaterialDuplicates('weapmat-delete-weapon-name');


// autopopulate material dropdown based on weapon selection
// assoc === true -> materials already used in weapon
const adjustEditMaterials = (weapDropdown, matDropdown, assoc) => {

  let weapon = weapDropdown.value;

  // get materials associated with weapon
  const table = document.getElementsByTagName('table')[0];
  let tableMaterials = [];
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const matName = row.children[1].innerText;
    if (weapon === row.children[0].innerText) {
      tableMaterials.push(matName);
    }
  }

  // get materials not associated with weapon if assoc === false
  let finalMaterials = [];
  if (!assoc) {
    finalMaterials = allMaterials.filter(m => !tableMaterials.includes(m)); 
  } else {
    finalMaterials = tableMaterials;
  }

  // repopulate material dropdown with those associated with weapon selection
  matDropdown.innerHTML = '';
  addOptions(finalMaterials, matDropdown);
};


// adjust edit materials based on weapon selection for edit, delete forms
adjustEditMaterials(weaponAddDropdown, materialAddDropdown, false);
adjustEditMaterials(weaponEditDropdown, materialEditDropdown, true);
adjustEditMaterials(weaponDeleteDropdown, materialDeleteDropdown, true);

weaponAddDropdown.addEventListener('change', (e) => {
  adjustEditMaterials(weaponAddDropdown, materialAddDropdown, false);
});
weaponEditDropdown.addEventListener('change', (e) => {
  adjustEditMaterials(weaponEditDropdown, materialEditDropdown, true);
});
weaponDeleteDropdown.addEventListener('change', (e) => {
  adjustEditMaterials(weaponDeleteDropdown, materialDeleteDropdown, true);
});

</script>

`;
};


module.exports = {
  Home,
  Customers,
  Invoices,
  Sales,
  Weapons,
  Materials,
  WeaponMaterials,
};
