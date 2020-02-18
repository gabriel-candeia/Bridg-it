function create_board(){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d")
        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                ctx.fillStyle = ((i%2===j%2) ? "white"  : ((j%2) ? "red" : "black"));
                ctx.beginPath();
                ctx.arc(40*j+240,40*i+40,10,0,2*Math.PI,false);
                if(i%2!==j%2){
                    if(j%2){
                        red_dot.push({x : 40*j+240, y : 40*i+40})
                    }
                    else{
                        black_dot.push({x : 40*j+240, y : 40*i+40})
                    }
                }
                ctx.fill();
            }    
        }
    }
}

var red_dot = [], black_dot = []; 