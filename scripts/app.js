function create_board(){
    var canvas = document.getElementById("canvas");
    var w = canvas.width, h = canvas.height;

    var acmR=0, acmB=0;
    var r = 10*(w/400), d = 40*(w/400);
    var left = (w-8*d)/2;
    var top = (h-8*d)/2;

    dots = new Array(9);
    for(let i=0;i<9;i++){
        dots[i] = new Array(9);
        for(let j=0;j<9;j++){    
            if(i%2!==j%2){
                var circle = new Circle(canvas,d*j+left,d*i+top,r,((j%2) ? acmR++ : acmB++),((j%2) ? "red" : "black"));    
                dots[i][j] = circle;
                circle.radial_animation();
            }
        }    
    }
    return dots;
}

function draw_line(c1,c2,ratio){
    var canvas = document.getElementById("canvas");
    if(canvas.getContext){
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = 4*(canvas.width/400);
        ctx.strokeStyle = c1.color;
        ctx.beginPath();
        ctx.moveTo(c1.x,c1.y);
        ctx.lineTo(c1.x+ratio*(c2.x-c1.x),c1.y+ratio*(c2.y-c1.y));
        ctx.stroke();
    }
}

function animate_line(c1,c2,ratio){
    ratio = ratio || 0;
    draw_line(c1,c2,ratio);
    if(ratio<1){
        requestAnimationFrame(()=>{animate_line(c1,c2,ratio+.05)});
    }
}


function intersect(circle, mouse){
    return ((circle) ? ((circle.x-mouse.x)**2+(circle.y-mouse.y)**2 < circle.r**2) : false);
}

function click_event(dict,turn,e){
    var rect = document.getElementById("canvas").getBoundingClientRect();
    var mouse = {x: e.clientX-rect.left, y: e.clientY-rect.top};
    if(!turn.last_clicked){
        i = ((turn.player!="red") ? 1 : 0);
        for(i;i<9;i+=2){
            for(j = (i+1)%2;j<9;j+=2){
                if(intersect(dict[i][j],mouse)){
                    turn.last_clicked = {i: i,j: j};

                    turn.candidates = [];
                    for(k of [-2,2]){
                        if(dict[i+k] && dict[i+k][j]){
                            turn.candidates.push({i: i+k,j: j});
                        }
                        if(dict[i][j+k]){
                            turn.candidates.push({i: i,j: j+k});
                        }
                    }
                    
                    dict[i][j].erase();
                    dict[i][j].radial_animation(0,"blue");
                    break;
                }
            }
        }
        return;
    }

    var li = turn.last_clicked.i, lj = turn.last_clicked.j;
    for(let v of turn.candidates){
        let i  = v.i, j = v.j;
        if(intersect(dict[i][j], mouse) && dict[(i+li)/2][(j+lj)/2]==undefined){
            dict[li][lj].draw();
            dict[i][j].draw();
            animate_line(dict[li][lj],dict[i][j]);

            dict[(i+li)/2][(j+lj)/2] = 0;
            turn.dsu[turn.player].union(dict[li][lj].id,dict[i][j].id);

            if(turn.dsu[turn.player].find(0)==turn.dsu[turn.player].find(19)){
                alert(turn.player+" venceu!")
            }

            turn.player = ((turn.player=="red") ? "black" :"red");
            turn.last_clicked = undefined;
            turn.candidates = undefined;
            
            return;
        }
    }
    if(intersect(dict[li][lj],mouse)){
        dict[li][lj].draw();
        turn.last_clicked = undefined;
        turn.candidates = undefined;
    }
        
}

function make_move(c1,c2){
    c1.draw();
    c2.draw();
    
    union(c1, c2)
}


(function (){
    var dots = create_board(); 
    var turn = {player: "black",last_clicked: undefined, candidates: undefined, dsu: {black: new Dsu(20), red: new Dsu(20)}};
    for(let i=0;i<4;i++){
        turn.dsu.black.union(0,0+5*i);
        turn.dsu.black.union(19,19-5*i);
        turn.dsu.red.union(0,0+i);
        turn.dsu.red.union(19,19-i)
    }
    document.getElementById("canvas").addEventListener("click",(e)=>click_event(dots,turn,e));
})()
