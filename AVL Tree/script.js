class TreeNode {
  constructor(value) {
    this.canvas=document.getElementById('treeCanvas');
    this.value = value;
    this.left = null;
    this.right = null;
    this.height=1;
    this.x = this.canvas.width/2; // X position for rendering
    this.y = 70; // Y position for rendering
    this.levelWidth=this.canvas.width/4;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
    this.canvas = document.getElementById('treeCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.offsetX = 50; // Initial offset for drawing
    this.offsetY = 70;
    this.nodeRadius = 40;
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

  height(node) { return node ? node.height : 0;}

  getBalance(node) { return node ? (this.height(node.left) - this.height(node.right)) : 0; }
  
  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    x.levelWidth=y.levelWidth;
    y.levelWidth/=2;
    x.x=y.x;
    x.y=y.y;
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.height(x.left), this.height(x.right)) + 1;
    y.height = Math.max(this.height(y.left), this.height(y.right)) + 1;
    y.levelWidth=x.levelWidth;
    x.levelWidth/=2;
    y.x=x.x;
    y.y=x.y;
    
    return y;
  }
  
  insert(path,node, value) {
    if (!node) {
      node= new TreeNode(value);
      path.push(node);
      return node;
    }
    path.push(node);    
    if (value < node.value) node.left = this.insert(path,node.left, value);
    else node.right = this.insert(path,node.right, value);
    return node;
  }

  getSuccessorNode(path,node) {
    path.push(node); 
    while(node.left) {
      node=node.left;
      path.push(node);
    }
    return node;
  }

  search(path,node,value) {
    if(!node) return node;
    path.push(node);
    if(value<node.value) return this.search(path,node.left,value);
    else if(value>node.value) return this.search(path,node.right,value);
    else return node;
  } 

}

function insertion() {
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    const path=[];
    avlTree.root=avlTree.insert(path,avlTree.root,value);
    
    let pathSize=path.length;
    let lastNode=path[pathSize-1];
    if(pathSize!=1) {
      let prevNode=path[pathSize-2];
      if(prevNode.right===lastNode) lastNode.x=prevNode.x + prevNode.levelWidth;
      else lastNode.x=prevNode.x-prevNode.levelWidth;
      lastNode.y=prevNode.y+100;
      lastNode.levelWidth=prevNode.levelWidth/2;
    }

    animateInsertion(path,lastNode);
    document.getElementById('valueInput').value = '';
  }
}

function deletion() {
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    const path=[];
    let successor=null;
    const delNode=avlTree.search(path,avlTree.root,value);
    
    if(delNode) {
       if( delNode.left && delNode.right ) {
          successor=avlTree.getSuccessorNode(path,delNode.right);
       }
       animateDeletion(path,delNode,successor);      
    }
    else animateSearch(path,delNode);
    document.getElementById('valueInput').value = '';
  }
}

function searchNode() {
  const path=[];
  const value = parseInt(document.getElementById('valueInput').value);
  if (!isNaN(value)) {
    const node=avlTree.search(path,avlTree.root,value);
    animateSearch(path,node);
  }
}

function animateInsertion(path,node) {
  const pathSize=path.length;
  let index=0;
  let wait=true;

  const interval1=setInterval( ()=>{
    if(index==pathSize) {
      if(wait) {
        wait=false;
        avlTree._drawNode(path[index-1],'orange');
      }
      else {
        clearInterval(interval1);
        avlTree._drawNode(path[index-1],'#4CAF50');
        setTimeout(()=>balanceHeight(path,index-2),1000);
      }
    }
    
    else {
        avlTree._drawNode(path[index],'yellow');
        if(index!=0 && index==pathSize-1) avlTree._drawLine(path[index-1].x,path[index-1].y,node.x,node.y);
        index++;
    }
  },1000 );

}

function balanceHeight(path,index) {
  if(index<0) return;
  const node=path[index]; 
  const value=path[path.length-1].value;
  let interval=4000;
  node.height = Math.max(avlTree.height(node.left), avlTree.height(node.right)) + 1;

  const balance = avlTree.getBalance(node);

  avlTree._drawNode(node,'red');
  
  if (balance > 1 && avlTree.getBalance(node.left) >= 0) {
      avlTree._drawNode(node.left,'red');
      avlTree._drawNode(node.left.left,'red');
      let newSubtreeRoot=avlTree.rotateRight(node);
      if(index!=0 && path[index-1].right===node) path[index-1].right=newSubtreeRoot;
      else if(index!=0 && path[index-1].left===node) path[index-1].left=newSubtreeRoot;
      else avlTree.root=newSubtreeRoot;
      setTimeout(()=>{
          ctx.clearRect(newSubtreeRoot.x-newSubtreeRoot.levelWidth*2,newSubtreeRoot.y-avlTree.nodeRadius,newSubtreeRoot.levelWidth*4,canvas.height-newSubtreeRoot.y);
          avlTree._renderNode(newSubtreeRoot,newSubtreeRoot.x,newSubtreeRoot.y,newSubtreeRoot.levelWidth);console.log(performance.now());
      },2000);
  }
  
  else if (balance < -1 && avlTree.getBalance(node.right) <= 0) {
    avlTree._drawNode(node.right,'red');
    avlTree._drawNode(node.right.right,'red');
    let newSubtreeRoot=avlTree.rotateLeft(node);
    if(index!=0 && path[index-1].right===node) path[index-1].right=newSubtreeRoot;
    else if(index!=0 && path[index-1].left===node) path[index-1].left=newSubtreeRoot;
    else avlTree.root=newSubtreeRoot;
    setTimeout( ()=>{
         ctx.clearRect(newSubtreeRoot.x-newSubtreeRoot.levelWidth*2,newSubtreeRoot.y-avlTree.nodeRadius,newSubtreeRoot.levelWidth*4,canvas.height-newSubtreeRoot.y);
         avlTree._renderNode(newSubtreeRoot,newSubtreeRoot.x,newSubtreeRoot.y,newSubtreeRoot.levelWidth);
    },2000);
  }
  
  else if (balance > 1 && avlTree.getBalance(node.left) < 0) {
    avlTree._drawNode(node.left,'red');
    avlTree._drawNode(node.left.right,'red');
    interval+=5000;
    setTimeout(()=>{
      node.left = avlTree.rotateLeft(node.left);
      ctx.clearRect(node.left.x-node.left.levelWidth*2,node.left.y-avlTree.nodeRadius,node.left.levelWidth*4,canvas.height-node.left.y);
      avlTree._renderNode(node.left,node.left.x,node.left.y,node.left.levelWidth);
      avlTree._drawNode(node.left,'red');
    },3000);
    setTimeout(()=>{
      let newSubtreeRoot=avlTree.rotateRight(node);
      if(index!=0 && path[index-1].right===node) path[index-1].right=newSubtreeRoot;
      else if(index!=0 && path[index-1].left===node) path[index-1].left=newSubtreeRoot;
      else avlTree.root=newSubtreeRoot;
      ctx.clearRect(newSubtreeRoot.x-newSubtreeRoot.levelWidth*2,newSubtreeRoot.y,newSubtreeRoot.levelWidth*4,canvas.height-newSubtreeRoot.y);
      avlTree._renderNode(newSubtreeRoot,newSubtreeRoot.x,newSubtreeRoot.y,newSubtreeRoot.levelWidth);
    },6000);
  }

  else if (balance < -1 && avlTree.getBalance(node.right) > 0) {
    avlTree._drawNode(node.right,'red');
    avlTree._drawNode(node.right.left,'red');
    node.right = avlTree.rotateRight(node.right);interval+=5000;
    setTimeout( ()=> {
      ctx.clearRect(node.right.x-node.right.levelWidth*2,node.right.y-avlTree.nodeRadius,node.right.levelWidth*4,canvas.height-node.right.y);
      avlTree._renderNode(node.right,node.right.x,node.right.y,node.right.levelWidth);
      avlTree._drawNode(node.right,'red');
    },3000);
    setTimeout(()=>{
      let newSubtreeRoot=avlTree.rotateLeft(node);
      if(index!=0 && path[index-1].right===node) path[index-1].right=newSubtreeRoot;
      else if(index!=0 && path[index-1].left===node) path[index-1].left=newSubtreeRoot;
      else avlTree.root=newSubtreeRoot;
      ctx.clearRect(newSubtreeRoot.x-newSubtreeRoot.levelWidth*2,newSubtreeRoot.y,newSubtreeRoot.levelWidth*4,canvas.height-newSubtreeRoot.y);
      avlTree._renderNode(newSubtreeRoot,newSubtreeRoot.x,newSubtreeRoot.y,newSubtreeRoot.levelWidth);
    },6000);
  }

  else avlTree._drawNode(node,'#4CAF50');

  setTimeout(()=>{balanceHeight(path,index-1);},interval);
  
}

function animateDeletion(path,delNode,successor) {
  const pathSize=path.length;
  let index=0;
  let wait=true;

  const interval=setInterval( ()=>{
    if(index==pathSize) {
      
      if(wait) {
        wait=false;

        if(successor) avlTree._drawNode(path[index-1],'pink');
        else avlTree._drawNode(path[index-1],'orange');

        let x,y=path[index-1].y+100;
        if(!path[index-1].left) x=path[index-1].x-35;
        else x=path[index-1].x+35;

        ctx.beginPath();
        ctx.font=('700,30px,Arial');
        ctx.fillText("NULL",x,y);
      }
      
      else {
        clearInterval(interval);
        ctx.clearRect(path[index-1].x-path[index-1].levelWidth*2,path[index-1].y-avlTree.nodeRadius,path[index-1].levelWidth*4,canvas.height-path[index-1].y+avlTree.nodeRadius);
        
        if(successor) {
          delNode.value^=successor.value;
          successor.value^=delNode.value;
          delNode.value^=successor.value; 
          avlTree._renderNode(successor,successor.x,successor.y,successor.levelWidth);
          avlTree._drawNode(delNode,'pink');
          avlTree._drawNode(successor,'orange');
          delNode=successor;
        }

        else {
          avlTree._renderNode(delNode,delNode.x,delNode.y,delNode.levelWidth);
          avlTree._drawNode(delNode,'orange'); 
        }

        setTimeout( ()=> {
          let substitute=delNode.left||delNode.right;
          let width=0;
          if(index==1) avlTree.root=substitute;
          else if(path[index-2].left===delNode) {path[index-2].left=substitute;width=path[index-2].levelWidth;}
          else {path[index-2].right=substitute;width=-path[index-2].levelWidth;}
          
          ctx.clearRect(path[index-1].x-path[index-1].levelWidth*2,path[index-1].y-avlTree.nodeRadius,path[index-1].levelWidth*4,canvas.height-path[index-1].y+avlTree.nodeRadius);
          if(substitute) avlTree._renderNode(substitute,delNode.x,delNode.y,delNode.levelWidth); 
          else {
            ctx.beginPath();
            ctx.strokeStyle='#f4f4f4';
            ctx.lineWidth=2;
            avlTree._drawLine(delNode.x+width,delNode.y-100,delNode.x,delNode.y);
            ctx.strokeStyle='black';
            ctx.lineWidth=1;
          } 
        },1000);
        
        setTimeout( ()=>avlTree.renderTree() , 2000 );
      }
      
    }
    
    else {
        if(index!=0 && path[index-1]===delNode && wait) {
          avlTree._drawNode(path[index-1],'orange'); 
          wait=false;
        }
        else {
          avlTree._drawNode(path[index],'yellow');  
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
  avlTree.renderTree();
}

function animateSearch(path,node) {
  const pathSize=path.length;
  let index=0;
  let found=false;
  if(node) found=true;

  const interval=setInterval( ()=>{
    if(index==pathSize) {
      if(found) {
        found=false;
        avlTree._drawNode(path[index-1],'orange');
      }
      else {
        clearInterval(interval);
        avlTree.renderTree();
        document.getElementById('valueInput').value = '';
      }
    }
    else {
        avlTree._drawNode(path[index],'yellow');
        index++;
    }
  },1000 );
}

// Initialize Binary Tree
const avlTree = new AVLTree();
const canvas=document.getElementById('treeCanvas');
const ctx=canvas.getContext('2d');

// Button Actions
document.getElementById('insertNode').addEventListener('click', insertion);
document.getElementById('deleteNode').addEventListener('click', deletion);
document.getElementById('searchNode').addEventListener('click', searchNode);
document.getElementById("Change-size").addEventListener('click',changeCanvasSize);

