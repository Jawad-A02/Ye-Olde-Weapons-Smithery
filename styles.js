const Styles = () => {
  return /*css*/`

<style>

  body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    background-color: wheat;  
    color: beige;
    text-align: center;
    margin: 0;
    min-height: 100vh;
    width: 100vw;
  }

  main, header, footer {
      width: 75%;
  }

  header {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  main {
      display: flex;
      flex-direction: column;
      flex: 1;
  }

  footer {
      position: fixed;
      background-color: #464CA9;
      height: 50px;
      bottom: 0;
      color: white;
  }

  h1 {
      font-size: 2.5rem;
      margin-top: 0;
  }

  h2 {
    margin-top: 0;
    font-size: 2rem;
  }

  nav {
    padding-top: 25px;
    padding-bottom: 10px;
    background-color: olivedrab;
    color:white;
    justify-content: center;
  }

  #home-img-container {
    margin: auto;
  }

  #home-img {
      height: 500px;
  }

  #home-img-container p {
    margin: 0;
  }


  .table-container {
    padding-top: 25px;
    background-color: #C87E1D;
    flex-direction: column;
    padding-bottom: 25px;
  }

  #home-container,
  .forms-container {
    padding-top: 25px;
    display: flex;
    flex-direction: row;
    background-color: #A13D51;
    justify-content: space-around;
    align-items: top;
    padding-bottom: 25px;
    width: 100%;
    flex: 1;
  }


  ul {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 0;
    max-width: 800px;
    margin: 0 auto 10px;
  }

  li {
    list-style-type: none;
  }

  table {
    color: white;
    border-collapse: collapse;
    table-layout: fixed; /* Set the table layout to fixed */
    margin: 0 auto;
  }

  tbody {
    display: table;
    width: 100%;
  }

  tr {
    display: table-row;
  }

  th,td {
    display: table-cell; /* Make each cell behave like a table cell */
    text-align: center; /* Align the content within the cell horizontally (center, left, right, etc.) */
    padding: 3px 10px; /* Add padding to create space around the content */
    border: 1px solid white; /* Add borders to the cells (optional) */
  }

  a {
    text-decoration: none;
    color: white;
  }

  a:hover {
    text-decoration: bold;
  }

  a:hover {
    color: burlywood;
  }

  fieldset {
    width: fit-content;
    min-width: 200px;
    margin: 20px auto;
  }

  input, label {
    display: block;
    width: 80%;
  }

  label {
    margin-top: 10px;
    text-align: left;
  }

  input[type="text"] {
    margin: 5px 0;
    width: 100px;
  }

  #weapon-edit-magic,
  #weapon-add-magic {
    width: 90%;
  }

  button {
      margin: 10px 0;
  }

  select {
    display: block;
    margin-top: 5px;
    min-width: 50px;
  }

  hr {
    margin: 20px;
  }
</style>

`};

module.exports = { Styles };
