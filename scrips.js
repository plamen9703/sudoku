
document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case 'ArrowUp':
            selectedManager(-1,0);
            break;
        case 'ArrowDown':
            selectedManager(1,0);
            break;
        case 'ArrowLeft':
            selectedManager(0,-1);
            break;
        case 'ArrowRight':
            selectedManager(0,1);
            break;    
        default:
            let num=Number(event.key)
            if(!isNaN(num))
                if(num !==0) handleMod(num);
                else mod=!mod
    }
})

function penNumber(num){
    const el=document.getElementById(`pens-${selectedRow}-${selectedCol}`)
    listNums=el.innerText.split(' ');
    if(listNums.some(n =>Number(n)===num))listNums=listNums.filter(n=>Number(n)!==num);
    else listNums.push(num);
    listNums.sort((a,b)=>Number(a)-Number(b));
    el.innerText=listNums.join(' ')
}


function handleMod(num){
    if(mod) putNumber(num);
    else penNumber(num);
}
let mod=true
function putNumber(num){
    const element=document.getElementById(`text-${selectedRow}-${selectedCol}`)
    elementClassList=element.classList
    if(elementClassList.contains('correct'))return;
    if(elementClassList.contains('empty')|| elementClassList.contains('found-wrong')){
        element.innerText=num;
        if(solution[selectedRow][selectedCol]!==num)element.className='found-wrong top';
        else {
            element.className='found top'
            document.getElementById(`pens-${selectedRow}-${selectedCol}`).innerHTML=''
        }
    }
}


document.getElementById('loadBtn').addEventListener('click', getDogImage);
//from chatgpt to learn a bit
async function getDogImage() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();

    // Create an image element
    const img = document.createElement('img');
    img.src = data.message;
    img.alt = 'A random dog';
    img.style.maxWidth = '300px';

    // Clear the container and add new image
    const container = document.getElementById('imageContainer');
    container.innerHTML = ''; // clear previous image
    container.appendChild(img);
  } catch (error) {
    console.error('Error fetching dog image:', error);
  }
}


getSudoku('https://sudoku-api.vercel.app/api/dosuku');
let board=[];
let solution=[];
async function getSudoku(file) {
            await fetch(file)
            .then(res=>res.json())
            .then(out=>{
                board=out.newboard.grids[0].value
                solution=out.newboard.grids[0].solution
                setSudokuBoard(board)
            })
            .catch(err=>console.log(err))
}

let selectedRow=0;
let selectedCol=0;

function selectedManager(row, col){
    let nextRow=selectedRow+row;
    let nextCol=selectedCol+col;
    if(!(nextRow>=0 && nextRow<9 && nextCol>=0 && nextCol<9))return;
    document.getElementById(`box-${selectedRow}-${selectedCol}`).classList.remove('selected');
    selectedRow=nextRow;
    selectedCol=nextCol;
    document.getElementById(`box-${selectedRow}-${selectedCol}`).classList.add('selected');
}


function setSudokuBoard(board){
    const divBoard=document.getElementById('board')
    for(i =0;i<9;i++){
        for(j=0;j<9;j++){
            divBoard.appendChild(createEement(i,j, board[i][j]))
        }
    }
}

 function createEement(row, col, content){
    const el=document.createElement('div');
    el.className='box';
    el.id=`box-${row}-${col}`;
    const pens = document.createElement('p');
    pens.id=`pens-${row}-${col}`;
    pens.className='pens under'
    const text=document.createElement('p');
    text.id=`text-${row}-${col}`
    if (content===0){
        content='';
        text.className='empty top'
    }else{
        text.className='correct top'
    }
    text.innerText=content;
    el.appendChild(pens);
    el.appendChild(text);
    if(row===0 && col ===0) el.classList.add('selected')
    return el;
}