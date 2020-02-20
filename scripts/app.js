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
                if(i%2!==j%2){
                    var circle = {x : d*j+left, y: d*i+top, id: i*9+j, r: r, color: ((j%2) ? "red" : "black")};
                    if(j%2){
                        red_dot.push(circle);
                    }
                    else{
                        black_dot.push(circle);
                    }
                    draw_circle(circle);
                }
            }    
        }
    }
}

function draw_circle(c){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = c.color;

        ctx.beginPath();
        ctx.arc(c.x,c.y,c.r,0,2*Math.PI,false);
        ctx.fill();
    }
}

function draw_line(c1,c2){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(c1.x,c1.y);
        ctx.lineTo(c2.x,c2.y);
        ctx.stroke();
    }
}

function intersect(circle,mouse){
    return ((circle.x-mouse.x)**2+(circle.y-mouse.y)**2 < circle.r**2);
}

function click_event(e,arr){
    var rect = document.getElementById("canvas").getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top}, i = 0;
    for(i=0;i<arr.length && !intersect(arr[i],mouse);i++);
    if(i!==arr.length){
        if(last_clicked!==undefined){
            draw_line(last_clicked,arr[i])
            draw_circle(last_clicked);
            draw_circle(arr[i]);
            last_clicked = undefined;
        }
        else{
            last_clicked = arr[i];
        }
    }
}


var red_dot = [], black_dot = []; 
var last_clicked = undefined;
create_board();
document.getElementById("canvas").addEventListener("click",(e)=>click_event(e,red_dot));
document.getElementById("canvas").addEventListener("click",(e)=>click_event(e,black_dot));