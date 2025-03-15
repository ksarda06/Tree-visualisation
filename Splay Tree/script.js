// splayTree.js
class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.parent = null;
    this.levelWidth=null;
    this.x=null;
    this.y=null;
  }
}

class SplayTree {
  constructor() {
    this.root = null;
    this.canvas = document.getElementById('treeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.offsetX = 50; // Initial offset for drawing
    this.offsetY = 70;
    this.nodeRadius =40;
  }

   //Render the tree
  renderTree() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.root !== null) {
      this._renderNode(this.root,this.canvas.width/2, this.offsetY, this.canvas.width/4);
    }
  }

  _renderNode(node, x, y, levelWidth) {
    if (!node) return;
    node.levelWidth=levelWidth;
    node.x = x;
    node.y = y;
    this._drawNode(node,'#4CAF50',this.nodeRadius);
    if (node.left) {
      this._renderNode(node.left, x - levelWidth, y + 100, levelWidth/2);
      this._drawLine(node.x, node.y, node.left.x, node.left.y);
    }

    if (node.right) {
      this._renderNode(node.right, x + levelWidth, y + 100, levelWidth/2);
      this._drawLine(node.x, node.y, node.right.x, node.right.y);
    }
  }

  _drawNode(node,color,radius) {
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2, false);
    this.ctx.fillStyle = color;
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.fillStyle = 'black';
    this.ctx.font = '700 30px Arial';
    this.ctx.textAlign="center";
    this.ctx.textBaseline="middle";
    this.ctx.fillText(node.value, node.x, node.y);
  }

  _drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1+this.nodeRadius);
    this.ctx.lineTo(x2, y2-this.nodeRadius);
    this.ctx.stroke();
  }

  // Perform a single right rotation
  rightRotate(x) {
    const y = x.left;
    y.levelWidth=x.levelWidth;
    y.x=x.x;
    y.y=x.y;
    x.left = y.right;

    if (y.right !== null)  y.right.parent = x;

    y.parent = x.parent;

    if (x.parent === null)  this.root = y; 
    else if (x === x.parent.right)  x.parent.right = y; 
    else x.parent.left = y;

    y.right = x;
    x.parent = y;
  } 

  // Perform a single left rotation
  leftRotate(x) {
    const y = x.right;
    y.levelWidth=x.levelWidth;
    y.x=x.x;
    y.y=x.y;
    x.right = y.left;

    if (y.left !== null) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === null) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;

    y.left = x;
    x.parent = y;
  }

  // Insert a new value into the tree
  insert(path,value) {
    let newNode = new Node(value);
    let parent = null;
    let current = this.root;

    while (current !== null) {
      path.push(current);
      parent = current;
      if (value < current.value)  current = current.left;
      else  current = current.right;
    }
    
    newNode.parent = parent;

    if (parent === null)  {
      this.root = newNode;
      newNode.x=this.canvas.width/2;
      newNode.y=this.offsetY;
      newNode.levelWidth=this.canvas.width/4;
    }
    else if (value < parent.value)  {
      parent.left = newNode;
      newNode.x=parent.x-parent.levelWidth;
    }
    else  {
      parent.right = newNode;
      newNode.x=parent.x+parent.levelWidth;
    }
    
    if(parent) {
      newNode.levelWidth=parent.levelWidth/2;
      newNode.y=parent.y+100; 
    }
    path.push(newNode);
    
  }

  // Search for a value in the tree
  search(path,value) {
    let current = this.root;
    
    while (current !== null) {
      path.push(current);
      if (value === current.value) return current;
      else if (value < current.value) current = current.left;
      else current = current.right;
    }

    return null;
  }

  // return rightmost node in a given subTree
  maxNode(path,root) {
    let current=root;
    if(!current) return current;
    while(current.right!=null) {
      path.push(current);
      current=current.right;
    }
    path.push(current);
    return current;
  }

}

const splayTree = new SplayTree();

// Insert a node into the tree from the input field
function insertNode() {
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    let path=[];
    splayTree.insert(path,value);
    animateInsert(path);
    document.getElementById('valueInput').value="";
  }
}

// Delete a node from the tree
function deleteNode() {
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    let path=[];
    let node=splayTree.search(path,value);
    if(path.length!=0) animateSearch(path,node,"delete1");
    document.getElementById('valueInput').value="";
  }
}

// Search a node in the tree
function searchNode() {
  const value = parseInt( document.getElementById('valueInput').value );
  if (!isNaN(value)) {
    let path=[];
    let node=splayTree.search(path,value);
    if(path.length!=0) animateSearch(path,node); 
    document.getElementById('valueInput').value="";
  }
}

function animateSplay(node,operation) {
  const canvas = document.getElementById('treeCanvas');
  const ctx=canvas.getContext('2d');
  const radius=splayTree.nodeRadius;
  let parent=null;
  let grandParent=null;
  let temp;
  let opr='mark';
  const interval=setInterval( ()=>{
      
      if(opr=='mark' && node.parent===null) { 
        clearInterval(interval);
        temp=null; 
        if(operation=='delete1') {
          ctx.clearRect(node.x-node.levelWidth,node.y-radius-1,2*node.levelWidth,100);
          if(splayTree.root.left) {
             splayTree.root.left.parent=null;
             rightSTree=splayTree.root.right;
             splayTree.root=splayTree.root.left;
             animateDeletion();
          }
          else {
            splayTree.root=splayTree.root.right;
            if(splayTree.root) splayTree.root.parent=null;
            splayTree.renderTree(); 
          }
        }
        else if(operation=="delete2") {
          splayTree.root.right=rightSTree;
          if(rightSTree) rightSTree.parent=splayTree.root;
          splayTree.renderTree();  
        } 
        else splayTree._drawNode(node,'#4CAF50',radius); 
        
      }

      else if(opr=='mark') {
        parent=node.parent;
        grandParent=node.parent.parent;
        
        splayTree._drawNode(parent,'red',radius);
        if(grandParent) splayTree._drawNode(node.parent.parent,'red',radius);
        opr='start';
      }
      
      else if(opr=='start') {
      
        if (grandParent === null) {
          // Zig step
          if (node === parent.left)  splayTree.rightRotate(parent);
          else  splayTree.leftRotate(parent);
          ctx.clearRect(node.x-2*node.levelWidth,node.y-radius,4*node.levelWidth,canvas.height-node.y+radius);
          splayTree._renderNode(node,node.x,node.y,node.levelWidth);
          splayTree._drawNode(node,'orange',radius);
          splayTree._drawNode(parent,'red',radius);
          opr='end';
        }
        
      
        else if (node === parent.left && parent === grandParent.left) {
          // Zig-Zig step
          splayTree.rightRotate(grandParent);
          ctx.clearRect(parent.x-2*parent.levelWidth,parent.y-radius,4*parent.levelWidth,canvas.height-parent.y+radius);
          splayTree._renderNode(parent,parent.x,parent.y,parent.levelWidth);
          splayTree._drawNode(node,'orange',radius);
          splayTree._drawNode(parent,'red',radius);
          splayTree._drawNode(grandParent,'red',radius);
          temp=parent;
          opr='right';
        }
      
        else if (node === parent.right && parent === grandParent.right) {
          // Zag-Zag step
          splayTree.leftRotate(grandParent);
          ctx.clearRect(parent.x-2*parent.levelWidth,parent.y-radius,4*parent.levelWidth,canvas.height-parent.y+radius);
          splayTree._renderNode(parent,parent.x,parent.y,parent.levelWidth);
          splayTree._drawNode(node,'orange',radius);
          splayTree._drawNode(parent,'red',radius);
          splayTree._drawNode(grandParent,'red',radius);
          temp=parent;
          opr='left';
        }
      
        else if (node === parent.left && parent === grandParent.right) {
          // Zig-Zag step
          splayTree.rightRotate(parent);
          ctx.clearRect(grandParent.x-2*grandParent.levelWidth,grandParent.y-radius,4*grandParent.levelWidth,canvas.height-grandParent.y+radius);
          splayTree._renderNode(grandParent,grandParent.x,grandParent.y,grandParent.levelWidth);
          splayTree._drawNode(node,'orange',radius);
          splayTree._drawNode(parent,'red',radius);
          splayTree._drawNode(grandParent,'red',radius);
          temp=grandParent;
          opr='left';
        }
      
        else {
          // Zag-Zig step
          splayTree.leftRotate(parent);
          ctx.clearRect(grandParent.x-2*grandParent.levelWidth,grandParent.y-radius,4*grandParent.levelWidth,canvas.height-grandParent.y+radius);
          splayTree._renderNode(grandParent,grandParent.x,grandParent.y,grandParent.levelWidth);
          splayTree._drawNode(node,'orange',radius);
          splayTree._drawNode(parent,'red',radius);
          splayTree._drawNode(grandParent,'red',radius);
          temp=grandParent;
          opr='right';
        }

      }

      else if(opr=='end') {
        ctx.clearRect(node.x-2*node.levelWidth,node.y-radius,4*node.levelWidth,canvas.height-node.y+radius);
        splayTree._renderNode(node,node.x,node.y,node.levelWidth);
        splayTree._drawNode(node,'orange',radius);
        opr='mark';
      }
       
      else if(opr=='left' || opr=='right') {
        if(opr=='right') splayTree.rightRotate(temp);
        else splayTree.leftRotate(temp);
        ctx.clearRect(node.x-2*node.levelWidth,node.y-radius,4*node.levelWidth,canvas.height-node.y+radius);
        splayTree._renderNode(node,node.x,node.y,node.levelWidth);
        splayTree._drawNode(node,'orange',radius);
        splayTree._drawNode(parent,'red',radius);
        splayTree._drawNode(grandParent,'red',radius);
        opr='end';
      } 

  },splaySpeed );
  
}

function animateInsert(path) {
  const pathSize=path.length;
  const newNode=path[pathSize-1];
  let index=0;

  const interval=setInterval( ()=>{
    if( index==pathSize-1 ) {
      splayTree._drawNode(newNode,'red',splayTree.nodeRadius);
      splayTree._drawNode(newNode,'yellow',splayTree.nodeRadius-7);
      
      if( (-1+index++)!=-1 ) splayTree._drawLine(path[pathSize-2].x,path[pathSize-2].y,newNode.x,newNode.y); 
    }

    else if(index==pathSize) {
      splayTree.renderTree();
      splayTree._drawNode(newNode,'orange',splayTree.nodeRadius);
      index++;
    } 

    else if(index==pathSize+1) {
        clearInterval(interval);
        animateSplay(path[pathSize-1]);
    }

    else {
        splayTree._drawNode(path[index],'yellow',splayTree.nodeRadius);
        index++;
    }
  },1000 );
}

function animateDeletion() {
  const root=splayTree.root;
  let path=[];
  let maxNode=splayTree.maxNode(path,root); 
  animateSearch(path,maxNode,'delete2');
}

function animateSearch(path,node,operation) {
  const pathSize=path.length;
  let index=0;
  let found=false;
  if(node) found=true;

  const interval=setInterval( ()=>{
    if(index==pathSize) {
      if(found) {
        found=false; 
        splayTree._drawNode(node,'red',splayTree.nodeRadius);
        splayTree._drawNode(node,'yellow',splayTree.nodeRadius-7);      
      }
      else {
        splayTree._renderNode(splayTree.root,splayTree.root.x,splayTree.root.y,splayTree.root.levelWidth);
        splayTree._drawNode(path[index-1],'orange',splayTree.nodeRadius);
        index++;
      }
    }
    else if(index==pathSize+1) {
        clearInterval(interval);
        animateSplay(path[pathSize-1],operation);
    }
    else {
        splayTree._drawNode(path[index],'yellow',splayTree.nodeRadius);
        index++;
    }
  },1000 );
}

function changeCanvasSize() {
    const canvas = document.getElementById('treeCanvas');
    const newWidth = document.getElementById('userInputWidth').value;
    const newHeight = document.getElementById('userInputHeight').value;
    canvas.width = newWidth;
    canvas.height = newHeight;
    splayTree.renderTree();
}

document.getElementById("Change-size").addEventListener('click',changeCanvasSize);

let rightSTree;
let splaySpeed=1500;