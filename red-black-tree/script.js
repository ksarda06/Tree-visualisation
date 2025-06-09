// Red-Black Tree Node
class Node {
    constructor(value) {
      this.value = value;
      this.color = 'red'; // New nodes are always red
      this.left = null;
      this.right = null;
      this.parent = null;
    }
  }
  //let canvas = document.getElementById("canvas");
  //let ctx = canvas.getContext("2d");
  // Red-Black Tree Class
  class RedBlackTree {
    constructor() {
      this.TNULL = new Node(null); // Sentinel node (NIL)
      this.TNULL.color = 'black';
      this.root = this.TNULL;
    }
  
    // Rotate left
    leftRotate(x) {
      let y = x.right;
      x.right = y.left;
      if (y.left !== this.TNULL) {
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
  
    // Rotate right
    rightRotate(x) {
      let y = x.left;
      x.left = y.right;
      if (y.right !== this.TNULL) {
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
  
    // Balance the tree after insertion
    balanceInsert(k) {
      let u;
      while (k.parent.color === 'red') {
        if (k.parent === k.parent.parent.right) {
          u = k.parent.parent.left;
          if (u.color === 'red') {
            u.color = 'black';
            k.parent.color = 'black';
            k.parent.parent.color = 'red';
            k = k.parent.parent;
          } else {
            if (k === k.parent.left) {
              k = k.parent;
              this.rightRotate(k);
            }
            k.parent.color = 'black';
            k.parent.parent.color = 'red';
            this.leftRotate(k.parent.parent);
          }
        } else {
          u = k.parent.parent.right;
          if (u.color === 'red') {
            u.color = 'black';
            k.parent.color = 'black';
            k.parent.parent.color = 'red';
            k = k.parent.parent;
          } else {
            if (k === k.parent.right) {
              k = k.parent;
              this.leftRotate(k);
            }
            k.parent.color = 'black';
            k.parent.parent.color = 'red';
            this.rightRotate(k.parent.parent);
          }
        }
        if (k === this.root) {
          break;
        }
      }
      this.root.color = 'black';
    }
  
    // Insert a new value
    insert(value) {
      let node = new Node(value);
      node.parent = null;
      node.value = value;
      node.left = this.TNULL;
      node.right = this.TNULL;
      node.color = 'red';
  
      let y = null;
      let x = this.root;
  
      while (x !== this.TNULL) {
        y = x;
        if (node.value < x.value) {
          x = x.left;
        } else {
          x = x.right;
        }
      }
  
      node.parent = y;
      if (y === null) {
        this.root = node;
      } else if (node.value < y.value) {
        y.left = node;
      } else {
        y.right = node;
      }
  
      if (node.parent === null) {
        node.color = 'black';
        return;
      }
  
      if (node.parent.parent === null) {
        return;
      }
  
      this.balanceInsert(node);
    }
  
    // Search for a value
    searchTreeHelper(node, key) {
      if (node === this.TNULL || key === node.value) {
        return node;
      }
  
      if (key < node.value) {
        return this.searchTreeHelper(node.left, key);
      }
      return this.searchTreeHelper(node.right, key);
    }
  
    // Delete a node
    deleteNodeHelper(node, key) {
      let z = this.TNULL;
      let x, y;
      while (node !== this.TNULL) {
        if (node.value === key) {
          z = node;
        }
  
        if (node.value <= key) {
          node = node.right;
        } else {
          node = node.left;
        }
      }
  
      if (z === this.TNULL) {
        console.log("Couldn't find key in the tree");
        return;
      }
  
      y = z;
      let yOriginalColor = y.color;
      if (z.left === this.TNULL) {
        x = z.right;
        this.transplant(z, z.right);
      } else if (z.right === this.TNULL) {
        x = z.left;
        this.transplant(z, z.left);
      } else {
        y = this.minimum(z.right);
        yOriginalColor = y.color;
        x = y.right;
        if (y.parent === z) {
          x.parent = y;
        } else {
          this.transplant(y, y.right);
          y.right = z.right;
          y.right.parent = y;
        }
  
        this.transplant(z, y);
        y.left = z.left;
        y.left.parent = y;
        y.color = z.color;
      }
      if (yOriginalColor === 'black') {
        this.fixDelete(x);
      }
    }
  
    fixDelete(x) {
      let w;
      while (x !== this.root && x.color === 'black') {
        if (x === x.parent.left) {
          w = x.parent.right;
          if (w.color === 'red') {
            w.color = 'black';
            x.parent.color = 'red';
            this.leftRotate(x.parent);
            w = x.parent.right;
          }
  
          if (w.left.color === 'black' && w.right.color === 'black') {
            w.color = 'red';
            x = x.parent;
          } else {
            if (w.right.color === 'black') {
              w.left.color = 'black';
              w.color = 'red';
              this.rightRotate(w);
              w = x.parent.right;
            }
            w.color = x.parent.color;
            x.parent.color = 'black';
            w.right.color = 'black';
            this.leftRotate(x.parent);
            x = this.root;
          }
        } else {
          w = x.parent.left;
          if (w.color === 'red') {
            w.color = 'black';
            x.parent.color = 'red';
            this.rightRotate(x.parent);
            w = x.parent.left;
          }
  
          if (w.right.color === 'black' && w.left.color === 'black') {
            w.color = 'red';
            x = x.parent;
          } else {
            if (w.left.color === 'black') {
              w.right.color = 'black';
              w.color = 'red';
              this.leftRotate(w);
              w = x.parent.left;
            }
            w.color = x.parent.color;
            x.parent.color = 'black';
            w.left.color = 'black';
            this.rightRotate(x.parent);
            x = this.root;
          }
        }
      }
      x.color = 'black';
    }
  
    transplant(u, v) {
      if (u.parent === null) {
        this.root = v;
      } else if (u === u.parent.left) {
        u.parent.left = v;
      } else {
        u.parent.right = v;
      }
      v.parent = u.parent;
    }
  
    minimum(node) {
      while (node.left !== this.TNULL) {
        node = node.left;
      }
      return node;
    }
  
    // Render tree on canvas
    render(ctx, node, x, y, level) {
      if (node === this.TNULL) return;
      ctx.fillStyle = node.color === 'red' ? 'red' : 'black';
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.fillText(node.value, x-10 , y+5);
      if (node.left !== this.TNULL) {
        ctx.beginPath();
        ctx.moveTo(x-10, y+40);
        ctx.lineTo(x-level, y + 100);
        ctx.stroke();
        this.render(ctx, node.left, x - level, y + 100, 100);
      }
  
      if (node.right !== this.TNULL) {
        ctx.beginPath();
        ctx.moveTo(x-10, y+40);
        ctx.lineTo(x+level,y+100);
        ctx.stroke();
        this.render(ctx, node.right, x + level, y + 100,100);
      }
    }
  }
  
  // Global Tree Instance
  let tree = new RedBlackTree();
  //let canvas = document.getElementById("canvas");
  //let ctx = canvas.getContext("2d");
  
  // Insert Button Handler
  function insert() {
    let value = parseInt(document.getElementById("valueInput").value);
    tree.insert(value);
    drawTree();
  }
  
  // Search Button Handler
  function search() {
    let value = parseInt(document.getElementById("valueInput").value);
    let node = tree.searchTreeHelper(tree.root, value);
    alert(node !== tree.TNULL ? "Node found!" : "Node not found.");
  }
  
  // Delete Button Handler
  function deleteNode() {
    let value = parseInt(document.getElementById("valueInput").value);
    tree.deleteNodeHelper(tree.root, value);
    drawTree();
  }
  function changeCanvasSize(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newWidth = document.getElementById('userInputWidth').value;
    const newHeight = document.getElementById('userInputHeight').value;
    canvas.width = newWidth;
    canvas.height = newHeight;
    ctx.putImageData(imageData, 0, 0);
  }
  // Draw Tree on Canvas
  function drawTree() {
     let canvas = document.getElementById("canvas");
     let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    tree.render(ctx, tree.root, canvas.width / 2, 50, 200);
  }
  document.getElementById("Change-size").addEventListener('click',changeCanvasSize);
