class TreeNode {
  constructor(isbn, title, author) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.left = null;
    this.right = null;
  }
}

let root = null;

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
    renderTree();
  }
}

function renderTreeLevels(node, depth = 0, levels = []) {
  if (!node) return levels;
  if (!levels[depth]) levels[depth] = [];
  levels[depth].push(node);
  renderTreeLevels(node.left, depth + 1, levels);
  renderTreeLevels(node.right, depth + 1, levels);
  return levels;
}

function renderTree() {
  const treeContainer = document.getElementById("treeContainer");
  treeContainer.innerHTML = "";

  const levels = renderTreeLevels(root);
  levels.forEach((levelNodes) => {
    const levelDiv = document.createElement("div");
    levelDiv.className = "tree-level";
    levelNodes.forEach((node) => {
      const nodeDiv = document.createElement("div");
      nodeDiv.className = "tree-node";
      nodeDiv.innerHTML = `
        <p><strong>ISBN:</strong> ${node.isbn}</p>
        <p><strong>Autor:</strong> ${node.author}</p>
        <p><strong>Título:</strong> ${node.title}</p>
      `;
      levelDiv.appendChild(nodeDiv);
    });
    treeContainer.appendChild(levelDiv);
  });
}
