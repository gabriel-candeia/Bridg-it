function create_board(){
    var board = document.getElementById("app-container");
    var temp;
    for(let i=0;i<9;i++){
        temp = document.createElement("div");
        temp.className = "row"
        board.appendChild(temp);
        for(let j=0;j<9;j++){
            temp = document.createElement("div");
            temp.className = "dot"
            temp.id = i+","+j
            temp.style.background = ((i%2===j%2) ? "transparent" : ((j%2) ? "red" : "black")); 
            board.appendChild(temp);
        }
    }
}

function create_line(){
    
}