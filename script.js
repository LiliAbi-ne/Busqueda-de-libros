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
  
  function deleteNode(root, isbn) {
    if (!root) {
      return null;
    }
    if (isbn < root.isbn) {
      root.left = deleteNode(root.left, isbn);
    } else if (isbn > root.isbn) {
      root.right = deleteNode(root.right, isbn);
    } else {
      if (!root.left && !root.right) {
        return null;
      }
      if (!root.left) {
        return root.right;
      }
      if (!root.right) {
        return root.left;
      }
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
  
  function deleteBook() {
    const isbn = document.getElementById("isbnInput").value.trim();
    if (!isbn) {
      alert("Por favor, ingrese un ISBN para eliminar.");
      return;
    }
    root = deleteNode(root, isbn);
    renderTree();
  }
  
  function displayTree(node, depth = 0) {
    if (!node) {
      return "";
    }
    const left = displayTree(node.left, depth + 1);
    const right = displayTree(node.right, depth + 1);
  
    return `
      <div class="tree-level">
        <div class="tree-node">
          <p><strong>${node.isbn}</strong></p>
          <p>${node.author}</p>
          <p>${node.title}</p>
        </div>
      </div>
      <div class="tree-level">
        ${left}
        ${right}
      </div>
    `;
  }
  
  function renderTree() {
    const treeContainer = document.getElementById("treeContainer");
    treeContainer.innerHTML = displayTree(root);
  }
  