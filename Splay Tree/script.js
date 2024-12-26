// splayTree.js
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
  }
}
class SplayTree {
  constructor() {
    this.root = null;
    this.canvas = document.getElementById('treeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.offsetX = 50; // Initial offset for drawing
    this.offsetY = 50;
    this.nodeRadius = 40;
  }

  // Perform a single right rotation
  rightRotate(x) {
    const y = x.left;
    x.left = y.right;

    if (y.right !== null) {
      y.right.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }

    y.right = x;
    x.parent = y;
  }

  // Perform a single left rotation
  leftRotate(x) {
    const y = x.right;
    x.right = y.left;

    if (y.left !== null) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  // Splay the tree to bring the node with value to the root
  splay(node) {
    while (node.parent !== null) {
      if (node.parent.parent === null) {
        // Zig step
        if (node === node.parent.left) {
          this.rightRotate(node.parent);
        } else {
          this.leftRotate(node.parent);
        }
      } else if (node === node.parent.left && node.parent === node.parent.parent.left) {
        // Zig-Zig step
        this.rightRotate(node.parent.parent);
        this.rightRotate(node.parent);
      } else if (node === node.parent.right && node.parent === node.parent.parent.right) {
        // Zig-Zig step
        this.leftRotate(node.parent.parent);
        this.leftRotate(node.parent);
      } else if (node === node.parent.left && node.parent === node.parent.parent.right) {
        // Zig-Zag step
        this.rightRotate(node.parent);
        this.leftRotate(node.parent);
      } else {
        // Zig-Zag step
        this.leftRotate(node.parent);
        this.rightRotate(node.parent);
      }
    }
  }

  // Insert a new value into the tree
  insert(value) {
    let newNode = new Node(value);
    let parent = null;
    let current = this.root;

    while (current !== null) {
      parent = current;
      if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    newNode.parent = parent;

    if (parent === null) {
      this.root = newNode;
    } else if (value < parent.value) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    // Splay the tree after insertion
    this.splay(newNode);
  }

  // Search for a value in the tree
  search(value) {
    let current = this.root;

    while (current !== null) {
      if (value === current.value) {
        this.splay(current);
        return current;
      } else if (value < current.value) {
        current = current.left;
      } else {
        current = current.right;
      }
    }

    return null;
  }

  // Delete a value from the tree
  delete(value) {
    let node = this.search(value);

    if (node === null) return;

    // Splay the node to the root
    this.splay(node);

    if (node.left === null) {
      this.transplant(node, node.right);
    } else if (node.right === null) {
      this.transplant(node, node.left);
    } else {
      let y = this.minimum(node.right);
      if (y.parent !== node) {
        this.transplant(y, y.right);
        y.right = node.right;
        y.right.parent = y;
      }

      this.transplant(node, y);
      y.left = node.left;
      y.left.parent = y;
    }
  }

  // Transplant helper method
  transplant(u, v) {
    if (u.parent === null) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }

    if (v !== null) {
      v.parent = u.parent;
    }
  }
   //Render the tree
  renderTree() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.root !== null) {
      this._renderNode(this.root,this.canvas.width/2, this.offsetY, 200);
    }
  }

  _renderNode(node, x, y, levelWidth) {
    if (!node) return;

    node.x = x;
    node.y = y;
    this._drawNode(node);
    if (node.left) {
      this._renderNode(node.left, x - levelWidth, y + 100, 100);
      this._drawLine(node.x, node.y, node.left.x, node.left.y);
    }

    if (node.right) {
      this._renderNode(node.right, x + levelWidth, y + 100, 100);
      this._drawLine(node.x, node.y, node.right.x, node.right.y);
    }
  }

  _drawNode(node) {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = '#4CAF50';
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(node.value, node.x - 10, node.y + 5);
  }

  _drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1+40);
    this.ctx.lineTo(x2, y2-40);
    this.ctx.stroke();
  }

}

const splayTree = new SplayTree();

// Insert a node into the tree from the input field
function insertNode() {
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    splayTree.insert(value);
    splayTree.renderTree();
  }
}

// Delete a node from the tree
function deleteNode() {
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    splayTree.delete(value);
    splayTree.renderTree();
  }
}

// Search a node in the tree
function searchNode() {
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    splayTree.search(value);
    splayTree.renderTree();
  }
}
function changeCanvasSize(){
    const canvas = document.getElementById('treeCanvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newWidth = document.getElementById('userInputWidth').value;
    const newHeight = document.getElementById('userInputHeight').value;
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.putImageData(imageData, 0, 0);
}
document.getElementById("Change-size").addEventListener('click',changeCanvasSize);