class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
      this.x = 0; // X position for rendering
      this.y = 0; // Y position for rendering
    }
  }
  
class BinaryTree {
  constructor() {
    this.root = null;
    this.canvas = document.getElementById('treeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.offsetX = 50; // Initial offset for drawing
    this.offsetY = 50;
    this.nodeRadius = 20;
   }

  // Render the tree
  renderTree() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.root !== null) {
      this._renderNode(this.root, this.canvas.width / 2, this.offsetY, this.canvas.width / 4);
    }
}
  
  _renderNode(node, x, y, levelWidth) {
    if (!node) return;
  
    node.x = x;
    node.y = y;
    this._drawNode(node);
    if (node.left) {
      this._renderNode(node.left, x - levelWidth, y + 100, levelWidth / 2);
      this._drawLine(node.x, node.y, node.left.x, node.left.y);
    }
  
    if (node.right) {
      this._renderNode(node.right, x + levelWidth, y + 100, levelWidth / 2);
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
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  } 
  
  // Insert a new node
  insert(value) {
    const newNode = new TreeNode(value);
    if (this.root === null) {
      this.root = newNode;
    } else {
      this._insertNode(this.root, newNode);
    }
    this.renderTree();
  }
  
  _insertNode(node, newNode) {
    if (newNode.value < node.value) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this._insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this._insertNode(node.right, newNode);
      }
    }
  }

  searchNodeParent(value) {
    let currNode=this.root;
    let parent=this.root;
    while(currNode!==null && currNode.value!==value) {
          parent=currNode;  
          if(currNode.value>value ) currNode=currNode.left;
          else currNode=currNode.right;
    }
    if(currNode!==null) return parent;
    else return null;
  }

  successor(node) {
    if(node.right===null) return null;
    else {
      let temp=node.right;
      if(temp.left!==null) {
          while(temp.left.left!=null) temp=temp.left;
          node=temp;
          temp=node.left;
          node.left=temp.right;
        }
      return temp;  
    } 
  }

  delete(value) {
    if(this.root===null) return;
    let delNode,succesorNode;  
      if(this.root.value===value) {
          delNode=this.root;
          succesorNode=this.successor(this.root);
          
          if(succesorNode===null) {this.root=this.root.left;}
          else if(this.root.left===null || this.root.right===succesorNode) {
                this.root.right.left=this.root.left;
                this.root=this.root.right;                
              }
          else {
                succesorNode.right=this.root.right;
                succesorNode.left=this.root.left;
                this.root=succesorNode;
          }
        }

      else {
          let parent=this.searchNodeParent(value);
          if(parent!=null) {
            
            if(parent.left!=null && parent.left.value===value) delNode=parent.left;
            else delNode=parent.right;

            let succesorNode=this.successor(delNode);
            if(succesorNode===null) {
               if(delNode===parent.left) parent.left=delNode.left;
               else parent.right=delNode.left;                  
              }
            else if(delNode.left===null || delNode.right===succesorNode) {
              delNode.right.left=delNode.left;
              if(delNode===parent.left) parent.left=delNode.right;
              else parent.right=delNode.right;
              }  
            else {
               succesorNode.right=delNode.right;
               succesorNode.left=delNode.left;
               if(delNode===parent.left) parent.left=succesorNode;
               else parent.right=succesorNode;
            }
             
          }
        }
       this.renderTree(); 
      }
  
  // In-Order Traversal
  inOrderTraversal() {
    const result = [];
    this._inOrder(this.root, result);
    alert("In-Order Traversal: " + result.join(" -> "));
  }
  
  _inOrder(node, result) {
    if (node) {
      this._inOrder(node.left, result);
      result.push(node.value);
      this._inOrder(node.right, result);
    }
  }
  
  // Pre-Order Traversal
  preOrderTraversal() {
    const result = [];
    this._preOrder(this.root, result);
    alert("Pre-Order Traversal: " + result.join(" -> "));
  }
  
  _preOrder(node, result) {
    if (node) {
      result.push(node.value);
      this._preOrder(node.left, result);
      this._preOrder(node.right, result);
    }
  }
  
  // Post-Order Traversal
  postOrderTraversal() {
    const result = [];
    this._postOrder(this.root, result);
    alert("Post-Order Traversal: " + result.join(" -> "));
  }
  
  _postOrder(node, result) {
    if (node) {
      this._postOrder(node.left, result);
      this._postOrder(node.right, result);
      result.push(node.value);
    }
   }
 }
function insertion() {
  const value = parseInt(document.getElementById('nodeValue').value);
  if (!isNaN(value)) {
    binaryTree.insert(value);
    document.getElementById('nodeValue').value = '';
  }
}

function deletion() {
  const value = parseInt(document.getElementById('nodeValue').value);
  if (!isNaN(value)) {
    binaryTree.delete(value);
    document.getElementById('nodeValue').value = '';
  }
}

// Initialize Binary Tree
const binaryTree = new BinaryTree();
  
// Button Actions
document.getElementById('insertNode').addEventListener('click', insertion);

document.getElementById('deleteNode').addEventListener('click', deletion);
  
document.getElementById('inOrder').addEventListener('click', function () {
  binaryTree.inOrderTraversal();
});
  
document.getElementById('preOrder').addEventListener('click', function () {
  binaryTree.preOrderTraversal();
});
  
document.getElementById('postOrder').addEventListener('click', function () {
  binaryTree.postOrderTraversal();
});
  