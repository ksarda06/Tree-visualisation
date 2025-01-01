class TreeNode {
    constructor(value) {
      this.canvas=document.getElementById('treeCanvas');
      this.value = value;
      this.left = null;
      this.right = null;
      this.x = this.canvas.width/2; // X position for rendering
      this.y = 70; // Y position for rendering
      this.levelWidth=this.canvas.width/4;
    }
  }
  
  class BinaryTree {
    constructor() {
      this.root = null;
      this.canvas = document.getElementById('treeCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.offsetX = 50; // Initial offset for drawing
      this.offsetY = 70;
      this.nodeRadius = 40;
    }
  
    // Insert a new node
    insert(path,node,value) {
      if(!node) {
        let newNode=new TreeNode(value); 
        path.push(newNode);
        return newNode;
      }

      path.push(node);
      if (node.value <= value) node.right = this.insert(path,node.right,value);
      
      else node.left=this.insert(path,node.left,value);

      return node;
    }
  
    // Render the tree
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
      this._drawNode(node,'#4CAF50');
      if (node.left) {
        this._renderNode(node.left, x - levelWidth, y + 100, levelWidth/2);
        this._drawLine(node.x, node.y, node.left.x, node.left.y);
      }
  
      if (node.right) {
        this._renderNode(node.right, x + levelWidth, y + 100, levelWidth/2);
        this._drawLine(node.x, node.y, node.right.x, node.right.y);
      }
    }
  
    _drawNode(node,color) {
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2, false);
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

    search(path,node,value) {
      if(!node) return node;
      path.push(node);
      if(value<node.value) return this.search(path,node.left,value);
      else if(value>node.value) return this.search(path,node.right,value);
      else return node;
    } 
  
    getSuccessorNode(path,node) {
      path.push(node); 
      while(node.left) {
        node=node.left;
        path.push(node);
      }
      return node;
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
    const path=[];
    const value = parseInt(document.getElementById('nodeValue').value);
    if (!isNaN(value)) {
      binaryTree.root=binaryTree.insert(path,binaryTree.root,value);
      animateInsertion(path);
      document.getElementById('nodeValue').value = '';
    }
    
  }
  
  function deletion() {
    const value = parseInt(document.getElementById('nodeValue').value);
    if (!isNaN(value)) {
      const path=[];
      let successor=null;
      const delNode=binaryTree.search(path,binaryTree.root,value);
      
      if(delNode && delNode.left && delNode.right ) successor=binaryTree.getSuccessorNode(path,delNode.right);
         
      animateDeletion(path,delNode,successor);      
      
      document.getElementById('nodeValue').value = '';
    }
  }

  function animateInsertion(path) {
    const pathSize=path.length;
    let index=0;

    if(pathSize!=1) {
       path[pathSize-1].y=path[pathSize-2].y+100;
       if(path[pathSize-2].left===path[pathSize-1]) path[pathSize-1].x=path[pathSize-2].x-path[pathSize-2].levelWidth;
       else path[pathSize-1].x=path[pathSize-2].x+path[pathSize-2].levelWidth;
    }

    const interval=setInterval( ()=>{
      if(index==pathSize) {
        clearInterval(interval);
        binaryTree._drawNode(path[index-1],'orange');
        setTimeout( ()=>{
          binaryTree.renderTree(); 
        },1000 );
        
      }
      else {
          binaryTree._drawNode(path[index],'yellow');
          if(index==pathSize-1 && index!=0) {
            binaryTree._drawLine(path[index-1].x,path[index-1].y,path[index].x,path[index].y);
          }
          index++;
      }
    },1000 );
  }
  
  function animateDeletion(path,delNode,successor) {
    const pathSize=path.length;
    let index=0;
    let wait=true;
  
    const interval=setInterval( ()=>{
      if(index==pathSize) {
        if(delNode===null) {
          clearInterval(interval);
          binaryTree.renderTree();
        }  

        else if(wait) {
          wait=false;
  
          if(successor) binaryTree._drawNode(path[index-1],'pink');
          else binaryTree._drawNode(path[index-1],'orange');
  
          let x,y=path[index-1].y+100;
          if(!path[index-1].left) x=path[index-1].x-35;
          else x=path[index-1].x+35;
  
          ctx.beginPath();
          ctx.font=('700,30px,Arial');
          ctx.fillText("NULL",x,y);
        }
        
        else {
          clearInterval(interval);
          ctx.clearRect(path[index-1].x-path[index-1].levelWidth*2,path[index-1].y-binaryTree.nodeRadius,path[index-1].levelWidth*4,canvas.height-path[index-1].y+binaryTree.nodeRadius);
          
          if(successor) {
            delNode.value^=successor.value;
            successor.value^=delNode.value;
            delNode.value^=successor.value; 
            binaryTree._renderNode(successor,successor.x,successor.y,successor.levelWidth);
            binaryTree._drawNode(delNode,'pink');
            binaryTree._drawNode(successor,'orange');
            delNode=successor;
          }
  
          else {
            binaryTree._renderNode(delNode,delNode.x,delNode.y,delNode.levelWidth);
            binaryTree._drawNode(delNode,'orange'); 
          }
  
          setTimeout( ()=> {
            let substitute=delNode.left||delNode.right;
            let width=0;
            if(index==1) binaryTree.root=substitute;
            else if(path[index-2].left===delNode) { path[index-2].left=substitute; width=path[index-2].levelWidth; }
            else { path[index-2].right=substitute; width=-path[index-2].levelWidth; }
            
            ctx.clearRect(path[index-1].x-path[index-1].levelWidth*2,path[index-1].y-binaryTree.nodeRadius,path[index-1].levelWidth*4,canvas.height-path[index-1].y+binaryTree.nodeRadius);
            if(substitute) binaryTree._renderNode(substitute,delNode.x,delNode.y,delNode.levelWidth); 
            else {
              ctx.beginPath();
              ctx.strokeStyle='#f4f4f4';
              ctx.lineWidth=2;
              binaryTree._drawLine(delNode.x+width,delNode.y-100,delNode.x,delNode.y);
              ctx.strokeStyle='black';
              ctx.lineWidth=1;
            } 
          },1000);
          
          setTimeout( ()=>binaryTree.renderTree() , 2000 );
        }
        
      }
      
      else {
          if(index!=0 && path[index-1]===delNode && wait) {
            binaryTree._drawNode(path[index-1],'orange'); 
            wait=false;
          }
          else {
            binaryTree._drawNode(path[index],'yellow');  
            wait=true;
            index++;
          }
      }
    },1000 );
  }

  function changeCanvasSize() {
    const canvas = document.getElementById('treeCanvas');
    const newWidth = document.getElementById('userInputWidth').value;
    const newHeight = document.getElementById('userInputHeight').value;
    canvas.width = newWidth;
    canvas.height = newHeight;
    binaryTree.renderTree();
  }


  // Initialize Binary Tree
  const binaryTree = new BinaryTree();
  const canvas = document.getElementById('treeCanvas');
  const ctx = canvas.getContext('2d');
  
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
  document.getElementById('Change-size').addEventListener('click',changeCanvasSize);

  