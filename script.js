class TreeNode {
  constructor(isbn, title, author) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.left = null;
    this.right = null;
  }
}

let root = null; // Nodo raíz
let allNodes = []; // Lista de todos los nodos en orden ascendente (para paginación)

// Función para obtener datos de libros usando la API
async function fetchBookData(isbn) {
  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
    const data = await response.json();
    const bookKey = `ISBN:${isbn}`;
    if (data[bookKey]) {
      const title = data[bookKey].title || "Título desconocido";
      const author = data[bookKey].authors ? data[bookKey].authors[0].name : "Autor desconocido";
      return { isbn, title, author };
    } else {
      alert("No se encontró información para este ISBN.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos del libro:", error);
    return null;
  }
}

// Insertar nodo en el árbol binario
function insertNode(root, newNode) {
  if (!root) {
    return newNode;
  }
  if (newNode.isbn < root.isbn) {
    root.left = insertNode(root.left, newNode);
  } else if (newNode.isbn > root.isbn) {
    root.right = insertNode(root.right, newNode);
  }
  return root;
}

// Función para añadir un nodo al árbol
async function addBook() {
  const isbn = document.getElementById("isbnInput").value.trim();
  if (!isbn) {
    alert("Por favor, ingrese un ISBN.");
    return;
  }

  const bookData = await fetchBookData(isbn);
  if (bookData) {
    const newNode = new TreeNode(bookData.isbn, bookData.title, bookData.author);
    root = insertNode(root, newNode);
    allNodes = [];
    inOrderTraversal(root, allNodes);
    renderPagination(1);
  }
}

// Recorrido in-order para ordenar los nodos
function inOrderTraversal(node, nodes) {
  if (!node) return;
  inOrderTraversal(node.left, nodes);
  nodes.push(node);
  inOrderTraversal(node.right, nodes);
}

// Función para renderizar la paginación
function renderPagination(pageNumber) {
  const itemsPerPage = 5;
  const startIndex = (pageNumber - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const nodesToDisplay = allNodes.slice(startIndex, endIndex);

  const treeContainer = document.getElementById("treeContainer");
  treeContainer.innerHTML = ""; // Limpiar contenedor

  nodesToDisplay.forEach((node) => {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "tree-node";
    nodeDiv.innerHTML = `
      <p><strong>ISBN:</strong> ${node.isbn}</p>
      <p><strong>Autor:</strong> ${node.author}</p>
      <p><strong>Título:</strong> ${node.title}</p>
    `;
    treeContainer.appendChild(nodeDiv);
  });

  renderPaginationControls(pageNumber, Math.ceil(allNodes.length / itemsPerPage));
}

// Renderizar controles de paginación
function renderPaginationControls(currentPage, totalPages) {
  const paginationControls = document.getElementById("paginationControls");
  paginationControls.innerHTML = ""; // Limpiar controles

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.className = i === currentPage ? "active" : "";
    button.onclick = () => renderPagination(i);
    paginationControls.appendChild(button);
  }
}

// Función para eliminar un nodo
function deleteNode(root, isbn) {
  if (!root) return null;
  if (isbn < root.isbn) {
    root.left = deleteNode(root.left, isbn);
  } else if (isbn > root.isbn) {
    root.right = deleteNode(root.right, isbn);
  } else {
    if (!root.left && !root.right) return null;
    if (!root.left) return root.right;
    if (!root.right) return root.left;

    let minRight = root.right;
    while (minRight.left) {
      minRight = minRight.left;
    }
    root.isbn = minRight.isbn;
    root.title = minRight.title;
    root.author = minRight.author;
    root.right = deleteNode(root.right, minRight.isbn);
  }
  return root;
}

// Función para eliminar un libro
function deleteBook() {
  const isbn = document.getElementById("isbnInput").value.trim();
  if (!isbn) {
    alert("Por favor, ingrese un ISBN para eliminar.");
    return;
  }
  root = deleteNode(root, isbn);
  allNodes = [];
  inOrderTraversal(root, allNodes);
  renderPagination(1);
}
