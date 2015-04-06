// html5shiv MIT @rem remysharp.com/html5-enabling-script
// iepp v1.6.2 MIT @jon_neal iecss.com/print-protector
/*@cc_on(function(m,c){var z="abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video";function n(d){for(var a=-1;++a<o;)d.createElement(i[a])}function p(d,a){for(var e=-1,b=d.length,j,q=[];++e<b;){j=d[e];if((a=j.media||a)!="screen")q.push(p(j.imports,a),j.cssText)}return q.join("")}var g=c.createElement("div");g.innerHTML="<z>i</z>";if(g.childNodes.length!==1){var i=z.split("|"),o=i.length,s=RegExp("(^|\\s)("+z+")",
"gi"),t=RegExp("<(/*)("+z+")","gi"),u=RegExp("(^|[^\\n]*?\\s)("+z+")([^\\n]*)({[\\n\\w\\W]*?})","gi"),r=c.createDocumentFragment(),k=c.documentElement;g=k.firstChild;var h=c.createElement("body"),l=c.createElement("style"),f;n(c);n(r);g.insertBefore(l,
g.firstChild);l.media="print";m.attachEvent("onbeforeprint",function(){var d=-1,a=p(c.styleSheets,"all"),e=[],b;for(f=f||c.body;(b=u.exec(a))!=null;)e.push((b[1]+b[2]+b[3]).replace(s,"$1.iepp_$2")+b[4]);for(l.styleSheet.cssText=e.join("\n");++d<o;){a=c.getElementsByTagName(i[d]);e=a.length;for(b=-1;++b<e;)if(a[b].className.indexOf("iepp_")<0)a[b].className+=" iepp_"+i[d]}r.appendChild(f);k.appendChild(h);h.className=f.className;h.innerHTML=f.innerHTML.replace(t,"<$1font")});m.attachEvent("onafterprint",
function(){h.innerHTML="";k.removeChild(h);k.appendChild(f);l.styleSheet.cssText=""})}})(this,document);@*/

window.onload = function (){
	var bricks_bottom=[], brick_arr=[];
	
    createBricks();
	
	var game=false, ball_bind=true;
	var platform=document.getElementById('platform');
    var life=platform.innerHTML;
    
    var platform_half_width=platform.offsetWidth/2;
	var ball=document.getElementById('ball');
    var ball_radius=ball.offsetWidth/2;    
	var playground=document.getElementsByClassName("play_ground")[0];
	
    restart();//start game
    
    //move platform
    document.addEventListener("mousedown", function(){ball_bind=false;});
	document.onmousemove=function(e){movePlatform(e)};
	
	
	
	var ball_started=false, lastX, lastY, deltaX, deltaY;
	var left_border=document.body.clientWidth-ball_radius;
	var newX, newY;
	document.addEventListener("mouseup", function(){
		if (game==false){
			game=true;
			//move ball	
			// ball_interval запихнуть в функцию,  также передаем сюда сторонню точку осчета
			var ball_interval = setInterval(function(){
                if(parseInt(ball.style.bottom)<-10  && (parseInt(ball.style.left) < parseInt(platform.style.left)-platform_half_width || parseInt(ball.style.left) > parseInt(platform.style.left)+platform_half_width)){
                    clearInterval(ball_interval);
                    alert("GameOver");
                    restart();
                }else{
                    ballMovement(ball, ball_interval);
                }
            },5);
        }
	})
	
	
	function ballMovement(the_ball, ball_interval){
        if(ball_started==false && ball_bind==false){// start from platform
            setTimeout(function(){ ball_started=true; },1000);
            ball_bind=true;
            if(parseInt(platform.style.left) == parseInt(the_ball.style.left)){platform.style.left=parseInt(platform.style.left)+5+"px";}// if center of a ball is right on center of the platform, move ball top
            defineBallPath(the_ball);
        }else{// continue moving
            ball_bind=true;
            if(newX-ball_radius < 0 || newX > left_border){deltaX=-deltaX;} //ball position near left and right field borders                
            if(newY+ball_radius*2 > playground.offsetHeight){deltaY=-deltaY;}
            if(newY+ball_radius*2 > bricks_bottom[bricks_bottom.length-1]){breakeBriks(the_ball, ball_interval);}
            if(parseInt(the_ball.style.bottom)<21 && ball_started==true){
                if(parseInt(the_ball.style.left) > parseInt(platform.style.left)-platform_half_width && parseInt(the_ball.style.left) < parseInt(platform.style.left)+platform_half_width){
                    defineBallPath(the_ball);
                }
            }
            newX=lastX-deltaX;
            newY=lastY+deltaY;
            the_ball.style.bottom=newY+"px";
            the_ball.style.left=newX+"px";
            lastX=newX;
            lastY=newY;
        }
	}
	
    function breakeBriks(the_ball, ball_interval){
        //alert(11);
        var ball=the_ball.getBoundingClientRect();
        for(var i=0; i<brick_arr.length; i++){            
            var brick=document.getElementById(brick_arr[i]).getBoundingClientRect();
            if(brick.bottom>ball.top && brick.left<parseInt(the_ball.style.left) && brick.right > parseInt(the_ball.style.left)){
                var brick=document.getElementById(brick_arr[i]);                
                if (brick.className=="brick"){
                    brick.style.visibility= 'hidden';
                }else if(~brick.className.indexOf("bonus")){
                    moveBrickDown(brick, ball_interval);
                }
                brick_arr.splice(i,1);
                i--;
                deltaY=-deltaY;
            }
        }
    }
    
    function moveBrickDown(the_brick, ball_interval){
        the_brick.style.bottom="0px";
        the_brick.style.zIndex="9999";
        the_brick.style.position="relative";
        the_brick.style.border="none";
        var bonus =getBonus(the_brick);
        
        the_brick.style.backgroundRepeat="no-repeat";
        the_brick.style.backgroundPosition="center";
        the_brick.innerHTML="";
		
        var move_block=setInterval(function(){
            the_brick.style.bottom=parseInt(the_brick.style.bottom)-2+"px";
			//the_brick.innerHTML=Math.round(platform.getBoundingClientRect().left) + "    " + Math.round(the_brick.getBoundingClientRect().left);
            
			//if the bonus over the platform
			var brick_center=(the_brick.getBoundingClientRect().right+the_brick.getBoundingClientRect().left)/2;
			//console.log(brick_center-9 > platform.getBoundingClientRect().left , brick_center+9 < platform.getBoundingClientRect().right , the_brick.getBoundingClientRect().bottom > platform.getBoundingClientRect().top);
			//console.log(Math.round(platform.getBoundingClientRect().left),Math.round(brick_center),Math.round(platform.getBoundingClientRect().right));
            if(brick_center-9 > platform.getBoundingClientRect().left && brick_center+9 < platform.getBoundingClientRect().right && the_brick.getBoundingClientRect().bottom > platform.getBoundingClientRect().top){
                the_brick.style.position="";
                the_brick.style.zIndex="";
                the_brick.style.visibility="hidden";
                clearInterval('move_block');
				if (bonus=="width"){
					console.log('bonus width');
					platform.style.width=platform_half_width*4+"px";
					platform_half_width=platform_half_width*2;
					setTimeout(function(){
						platform_half_width=platform_half_width/2;
						platform.style.width=platform_half_width*2+"px";
					}, 10000)
				}else if(bonus=="life"){
					platform.innerHTML=parseInt(platform.innerHTML)+1;
				}else if(bonus=="bomb"){
					platform.innerHTML=parseInt(platform.innerHTML)-1;
					clearInterval(ball_interval);
					restart();
				}
                return false;
            }
			
			if(the_brick.getBoundingClientRect().bottom > playground.offsetHeight){
				console.log("destroy");
                the_brick.style.position="";
                the_brick.style.zIndex="";
                the_brick.style.visibility="hidden";
                clearInterval('move_block');
                return false;
            }
            
        },10);
    }
    
	function getBonus(the_brick){
		if (~the_brick.className.indexOf("life")){
            the_brick.style.background="url(images/life.png)";
            return "life";
        }else if (~the_brick.className.indexOf("width")){
            the_brick.style.background="url(images/width.png)";
            return "width";
        }else if (~the_brick.className.indexOf("fight")){
            the_brick.style.background="url(images/fight.png)";
            return "fight";
        }else if (~the_brick.className.indexOf("balls")){
            the_brick.style.background="url(images/balls.png)";
            return "balls";
        }else if (~the_brick.className.indexOf("bomb")){
            the_brick.style.background="url(images/bomb.png)";
            return "bomb";
        }
	}
    
    function defineBallPath(the_ball){
        deltaX=parseInt(platform.style.left)-parseInt(the_ball.style.left);
        deltaY=10+ball_radius;
        var hypotenuse=Math.sqrt(deltaX*deltaX+deltaY*deltaY); //define the hypotenuse
        
		var speedKoef=5;
        deltaX=(deltaX/hypotenuse)*speedKoef;
        deltaY=(deltaY/hypotenuse)*speedKoef;
        
        lastX=parseInt(the_ball.style.left);
        lastY=20;
    }
    
    function restart(){
        ball.style.left = document.body.clientWidth/2+"px";
        ball.style.bottom = 20+"px";
        platform.style.left = document.body.clientWidth/2+"px";
        game=false;
        ball_bind=true;
    }
    
    function movePlatform(e){
        if (e.clientX>platform_half_width && e.clientX<document.body.clientWidth-platform_half_width){
            if(ball_bind==true){
                platform.style.left=e.clientX+"px";
                if(game==false){ // if game not starting, move the ball with platform
                    if(parseInt(ball.style.left) < parseInt(platform.style.left)){
                        ball.style.left = platform.style.left;
                    }else if(parseInt(ball.style.left) > parseInt(platform.style.left)){
                        ball.style.left = platform.style.left;
                    }
                }
            }else if(parseInt(ball.style.left)-platform_half_width+ball_radius < e.clientX && parseInt(ball.style.left)+platform_half_width-ball_radius > e.clientX){
                platform.style.left=e.clientX+"px";
            }
		}
    }
	
	function createBricks(){
		var block_arr=document.getElementById('block_array');
		var maximum=getRandom(3,10);
		var qty_in_line, block_color, block_width;
		var new_block;
		for(var i=2; i<=maximum; i++){// generate strings with bloks
			bricks_bottom[i-2]=document.getElementById("wrapper").clientHeight-20*(i-1);
			qty_in_line=getRandom(5,20);
			block_width=(100/qty_in_line)+"%";
			block_color=getRandomColor();
            var str_arr=[];
			for(var k=1; k<=qty_in_line; k++){//generate blocks in each line
				new_block=document.createElement('div');
				new_block.style.background=block_color;
				new_block.style.width=block_width;
				if(i==maximum){ new_block.style.borderBottom="none";}
				new_block.className="brick";
                var new_id=c1();
				new_block.innerHTML=new_id;
				new_block.id="brick" +new_id;

                switch (getRandom(1,25)){
                    case 1: new_block.className=new_block.className + " bonus_width";
                            new_block.innerHTML=new_id+"bonus";
                            break;
                    case 2: new_block.className=new_block.className + " bonus_life";
                            new_block.innerHTML=new_id+"bonus";
                            break;
                    case 3: new_block.className=new_block.className + " bonus_fight";
                            new_block.innerHTML=new_id+"bonus";
                            break;
                    case 4: new_block.className=new_block.className + " bonus_balls";
                            new_block.innerHTML=new_id+"bonus";
                            break;
                    case 5: new_block.className=new_block.className + " bonus_bomb";
                            new_block.innerHTML=new_id+"bomb";
                            break;
                }
                block_arr.appendChild(new_block);
                brick_arr.push("brick" +new_id);// collect bricks
			}            
		}
	}
}

function getRandom(min, max){
	var rand = min + Math.random()*(max+1-min);
	rand = rand^0; // округление битовым оператором
	return rand;
}

function getRandomColor(){
	return "rgb("+getRandom(0,255)+","+getRandom(0,255)+","+getRandom(0,255)+")"
}

function makeCounter() {
  return function f() {
    if (!f.currentCount) { f.currentCount = 0; }
    return ++f.currentCount;
  };
}

var c1 = makeCounter();