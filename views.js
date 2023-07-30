const { Styles } = require('./styles');

/*********
  Scripts
 *********/


// set Header nav anchors, skip current page
const setAnchor = (page, href) => {
  return page === href ? 'style=pointer-events:none' : `href="/${href}"`;
}

/**************
  Page Scripts
 **************/

const Scripts = () => {
  return /*js*/`

<script>

/*
  Add dropdown menu options
  -------------------------
  selectId = 'customer-add-name'
  options = ['1', '2', '3']
*/
const addoptions = (selectid, options) => {

// TODO: dynamic fetching

const selectelem = document.getelementbyid(selectid);
  options.foreach((val) => {
    const option = document.createelement('option');
    option.value = val;
    option.text = val;
    selectelem.appendchild(option);
  });
};

</script>

`;
};



/************
  Components
 ************/

// Head
const Head = (title) => {
  return /*html*/`

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  ${Styles()}
</head>

`};


// Header
const Header = (page) => {
  return /*html*/`

<body>
  <header>
    <nav>
      <h1>Ye Olde Weapons Smithery</h1>
      <ul>
        <li><a ${setAnchor(page, 'home')}>Home</a></li>
        <li><a ${setAnchor(page, 'customers')}>Customers</a></li>
        <li><a ${setAnchor(page, 'invoices')}>Invoices</a></li>
        <li><a ${setAnchor(page, 'sales')}>Sales</a></li>
        <li><a ${setAnchor(page, 'weapons')}>Weapons</a></li>
        <li><a ${setAnchor(page, 'materials')}>Materials</a></li>
        <li><a ${setAnchor(page, 'weaponMaterials')}>Weapon Materials</a></li>
      </ul>
    </nav>
  </header>
  <main>

`};


// Footer
const Footer = () => {
  return /*html*/`

  </main>
  <footer>
    <p>Created by Jawad Abdullah, Jeffrey Valcher -- &copy; 2023</p>
  </footer>
</body>
</html>

`};


/*
  Table
  -------------
  arr = [<th>, <th>, <th>]
*/
const Table = (arr, data) => {

  // th 
  let ths = '';
  arr.forEach((th) => {
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

  return /*html*/`

<div class="table-container">
  <table>
    <tr>
      ${ths}
    </tr>
    ${rows}
  </table>
</div>

`};

/*
  Form
  -----
  divClass = add
  method = POST
  legend = 'Add Customer'
  inputs = htmlObject
  button = 'Add'

*/
const Form = (divClass, action, method, legend, inputs, button) => {
  return /*html*/`

<div class="forms-container">
  <div class="${divClass}">
    <form action="${action}" method="${method}">
      <fieldset>
        <legend><strong>${legend}</strong></legend>
        ${inputs}
        <button type="button">${button}</button>
      </fieldset>
    </form>
  </div>
</div>

`};




/*
  Input
  ------
  type = 'text', 'dropdown'
  forId = 'customer-add-name'
  label = 'Name:'
  data = database object
  query = attribute match e.g. "customer_id"
  hr = 'hr', 'none'
*/
const Input = (type, forId, label, data, query, hr='') => {

  let input = '';
  let hr_elem = hr === true ? "<hr>" : "";

  if (type === 'text') {
    input = /*html*/`
      <label for="${forId}">${label}</label>
      <input id="${forId}" name="${forId}" type="text" />
      ${hr_elem}
    `;
  } else if (type === 'dropdown') {

    let options = ``;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        for (let [key, value] of Object.entries(data[i])){
          if (key === query){
            options += `<option value=${value}>${value}</option>`;
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
  } else if (type === 'date') {
    input = /*html*/`
      <label for="${forId}">${label}</label>
      <input id="${forId}" name="${forId}" type="date" />
      ${hr_elem}
    `;
  } else if (type === 'dropdown_level') {
    let options = "";
    for (let i = 1; i<=10; i++){
      options += `<option value="${i}">${i}</option>`;
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

${Head('home')}
${Header('home')}

<div id="home-img-container">
  <img
    id="home-img"
    src="https://manuscriptminiatures.com/image/21296/1000"
  />
  <p style="text-align: right;"><cite>The Gorleston Psalter</cite></p>
  <p style="text-align: right;">British Library</p>
</div>

${Footer()}

`};


// Customers
const Customers = (data) => {

  let addInputs = `
    ${Input('text', 'customer-add-name', 'Name:')}
    ${Input('dropdown_level', 'customer-add-level', 'Level:')}
  `;

  let editInputs = `
    ${Input('dropdown', 'customer-edit-ids', 'Customer ID:', data, "customer_id", 'hr')}
    ${Input('text', 'customer-edit-name', 'Name:')}
    ${Input('dropdown_level', 'customer-edit-level', 'Edit level:')}
  `;

  let deleteInput = `
    ${Input('dropdown', 'customer-delete-name', 'Customer Name:', data, "name", 'hr')}
  `;

  return `

${Head('Customers')}
${Header('customers')}

${Table(['Customer ID', 'Name', 'Level'], data)}

${Form('add', 'POST', 'Add Customer', addInputs, 'Add')}
${Form('edit', 'PUT', 'Edit Customer', editInputs, 'Edit')}
${Form('delete', 'DELETE', 'Delete Customer', deleteInput, 'Delete')}

${Footer()}

`};


// Invoices
const Invoices = () => {

  let addInputs = `
    ${Input('text', 'invoice-add-customer-id', 'Customer ID:')}
    ${Input('date', 'invoice-add-date', 'Date:')}
  `;

  let editInputs = `
    ${Input('dropdown', 'invoice-edit-ids', 'Invoice ID:', 'hr')}
    ${Input('text', 'invoice-add-customer-id', 'Customer ID:')}
    ${Input('date', 'invoice-add-date', 'Date:')}
  `;

  let deleteInput = `
    ${Input('dropdown', 'invoice-delete-ids', 'Invoice ID:', 'hr')}
  `;

  return `

${Head('Invoices')}
${Header('invoices')}

${Table(['Invoice ID', 'Customer ID', 'Total price', 'Date'])}

${Form('add', 'POST', 'Add Invoice', addInputs, 'Add')}
${Form('edit', 'PUT', 'Edit Invoice', editInputs, 'Edit')}
${Form('delete', 'DELETE', 'Delete Invoice', deleteInput, 'Delete')}

${Footer()}

`};


// Materials
const Materials = () => {

  let addInputs = `
    ${Input('text', 'material-add-name', 'Name:')}
    ${Input('text', 'material-add-pounds', 'Pounds available:')}
    ${Input('text', 'material-add-cost', 'Cost per pound:')}
  `;

  let editInputs = `
    ${Input('dropdown', 'material-edit-ids', 'Material ID:', 'hr')}
    ${Input('text', 'material-edit-name', 'Name:')}
    ${Input('text', 'material-edit-pounds', 'Pounds available:')}
    ${Input('text', 'material-edit-cost', 'Cost per pound:')}
  `;

  let deleteInput = `
    ${Input('dropdown', 'material-delete-ids', 'Material ID:', 'hr')}
  `;

  return `

${Head('Materials')}
${Header('materials')}

${Table(['Material ID', 'Name', 'Pounds available', 'Cost per pound'])}

${Form('add', 'POST', 'Add Material', addInputs, 'Add')}
${Form('edit', 'PUT', 'Edit Material', editInputs, 'Edit')}
${Form('delete', 'DELETE', 'Delete Material', deleteInput, 'Delete')}

${Footer()}

`};


// Sales
const Sales = () => {

  let addInputs = `
    ${Input('dropdown', 'sale-add-invoice-id', 'Invoice ID:')}
    ${Input('dropdown', 'sale-add-weapon-id', 'Weapon ID:')}
    ${Input('text', 'sale-add-price', 'Price:')}
  `;

  let editInputs = `
    ${Input('dropdown', 'sale-edit-sale-id', 'Sale ID:', 'hr')}
    ${Input('dropdown', 'sale-edit-invoice-id', 'Invoice ID:')}
    ${Input('dropdown', 'sale-edit-weapon-id', 'Weapon ID:')}
    ${Input('text', 'sale-edit-price', 'Price:')}
  `;

  let deleteInput = `
    ${Input('dropdown', 'sale-delete-ids', 'Sale ID:', 'hr')}
  `;

  return `

${Head('Sales')}
${Header('sales')}

${Table(['Sale ID', 'Invoice ID', 'Weapon ID', 'Price'])}

${Form('add', 'POST', 'Add Sale', addInputs, 'Add')}
${Form('edit', 'PUT', 'Edit Sale', editInputs, 'Edit')}
${Form('delete', 'DELETE', 'Delete Sale', deleteInput, 'Delete')}

${Footer()}

`};


// Weapons
const Weapons = () => {

  let addInputs = `
    ${Input('text', 'weapon-add-name', 'Name:')}
    ${Input('dropdown', 'weapon-add-level', 'Level:')}
    ${Input('text', 'weapon-add-magic', 'Magical ability:')}
    ${Input('dropdown', 'weapon-add-weapon-id', 'Weapon ID:')}
    ${Input('text', 'weapon-add-cost', 'Total cost:')}
  `;

  let editInputs = `
    ${Input('dropdown', 'weapon-edit-weapon-id', 'Weapon ID:', 'hr')}
    ${Input('text', 'weapon-edit-name', 'Name:')}
    ${Input('dropdown', 'weapon-edit-level', 'Level:')}
    ${Input('text', 'weapon-edit-magic', 'Magical ability:')}
    ${Input('text', 'weapon-edit-cost', 'Total cost:')}
  `;

  let deleteInput = `
    ${Input('dropdown', 'weapon-delete-id', 'Weapon ID:', 'hr')}
  `;

  return `

${Head('Weapons')}
${Header('weapons')}

${Table(['Weapon ID', 'Name', 'Level', 'Magical Ability', 'Total Cost'])}

${Form('add', 'POST', 'Add Weapon', addInputs, 'Add')}
${Form('edit', 'PUT', 'Edit Weapon', editInputs, 'Edit')}
${Form('delete', 'DELETE', 'Delete Weapon', deleteInput, 'Delete')}

${Footer()}

`};


// WeaponMaterials
const WeaponMaterials = () => {

  let addInputs = `
    ${Input('dropdown', 'weapmat-add-weapon-id', 'Weapon ID:')}
    ${Input('dropdown', 'weapmat-add-material-id', 'Material ID:')}
    ${Input('text', 'weapmat-add-pounds', 'Pounds used:')}
  `;

  let editInputs = `
    ${Input('dropdown', 'weapmat-edit-weapon-id', 'Weapon ID:')}
    ${Input('dropdown', 'weapmat-edit-material-id', 'Material:')}
    ${Input('text', 'weapmat-add-pounds', 'Pounds used:')}
  `;

  let deleteInput = `
    ${Input('dropdown', 'weapmat-delete-weapon-id', 'Weapon ID:')}
    ${Input('dropdown', 'weapmat-delete-material-id', 'Material ID:')}
  `;

  return `

${Head('Weapon Materials')}
${Header('weaponMaterials')}

${Table(['Weapon ID', 'Material ID', 'Pounds Used'])}

${Form('add', 'POST', 'Add Weapon Material', addInputs, 'Add')}
${Form('edit', 'PUT', 'Edit Weapon Material', editInputs, 'Edit')}
${Form('delete', 'DELETE', 'Delete Weapon Material', deleteInput, 'Delete')}

${Footer()}
${Scripts()}

`};

module.exports = {
  Home,
  Customers,
  Invoices,
  Sales,
  Weapons,
  Materials,
  WeaponMaterials
};
