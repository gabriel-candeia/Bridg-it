function create_board(){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        var w = canvas.width, h = canvas.height;

        var acmR=0, acmB=0;

        var r = 10, d = 40;
        var left = (w-8*d)/2;
        var top = (h-8*d)/2;

        for(let i=0;i<9;i++){
            for(let j=0;j<9;j++){    
                if(i%2!==j%2){
                    var circle = {x : d*j+left, y: d*i+top, id: ((j%2) ? ++acmR : ++acmB), r: r, color: ((j%2) ? "red" : "black")};    
                    dots[circle.id+circle.color] = circle;
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

function intersect(circle, mouse){
    return ((circle) ? ((circle.x-mouse.x)**2+(circle.y-mouse.y)**2 < circle.r**2) : false);
}

function click_event(dict,e){
    var rect = document.getElementById("canvas").getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    if(!last_clicked){
        for(let i in dict){
            if(intersect(dict[i],mouse)){
                last_clicked = dict[i];
                break;
            }
        }
    }
    else{
        var inc = [-1,+1,-4,+4];
        for(let i=0;i<4;i++){
            if(intersect(dict[last_clicked.id+inc[i]+last_clicked.color], mouse)){
                make_move(last_clicked,dict[last_clicked.id+inc[i]+last_clicked.color]);
                last_clicked = undefined;
                break;
            }
        }
    }
}

function make_move(c1,c2){
    draw_line(c1,c2);
    draw_circle(c1);
    draw_circle(c2);
    //union(c1, c2)
}

var dots = {}; 
var last_clicked = undefined;
create_board();
document.getElementById("canvas").addEventListener("click",(e)=>click_event(dots,e));