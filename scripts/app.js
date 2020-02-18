function create_board(){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var w = canvas.width, h = canvas.height;

        //circle settings
        var r = 10, d = 40;
        var left = (w-8*d)/2;
        var top = (h-8*d)/2;

        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){
                ctx.fillStyle = ((i%2===j%2) ? "transparent"  : ((j%2) ? "red" : "black"));

                ctx.beginPath();
                ctx.arc(d*j+left,d*i+top,r,0,2*Math.PI,false);
                ctx.fill();
                
                if(i%2!==j%2){
                    if(j%2){
                        red_dot.push({x : d*j+left, y : d*i+top, i: i, j: j});
                    }
                    else{
                        black_dot.push({x : d*j+left, y : d*i+top, i: i, j: j});
                    }
                }
            }    
        }
    }
}

var red_dot = [], black_dot = []; 