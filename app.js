const canvus = document.getElementById('canvas');
const ctx = canvus.getContext('2d');
canvus.width = window.innerWidth;
canvus.height = window.innerHeight;

let particleArray = [];
let adjustX = 20;  //text place positions
let adjustY = 10;  //text place positions

// handle Mouse

const mouse = {
    x: null,
    y: null,
    radius: 200   //mouse area radius
}
window.addEventListener('mousemove',function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    // mouse.radius = 150;
})
ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText("BMPS" ,5,30);   //40 က Y Position
let textCoordinates = ctx.getImageData(0,0,100,100);     //0 0 က left နဲ့ top position 100 100 က 100px x 100px width height


class Particle {
    constructor(x,y){     //x,y ကခွဲထွက်မယ့်အမှုန်
       this.x = x;
       this.y = y;
       this.size = 3; // ကွဲထွက်မယ့် အရွယ်အစား
       this.baseX = this.x;  //initial value ကိုထိန်းဖို့  ဒီးကောင်တွေကိုရွှေ့ပြီး ကွဲထွက်မယ့် ပြောင်းလဲခြင်း
       this.baseY = this.y;  //initial value ကိုထိန်းဖို့  ဒီးကောင်တွေကိုရွှေ့ပြီး ကွဲထွက်မယ့် ပြောင်းလဲခြင်း  
       this.density = (Math.random() * 40) +5;
    }

    draw(){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 2);       //3 က size 0 ကစမယ် Math.PI က end point
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force =(maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;
        if(distance < mouse.radius) {
            this.x -= directionX;  // particle movement speed    += ဆို အမှုန်တွေကိုစုတယ်   -= ဆို အမှုန်တွေကိုကန်တယ်
            this.y -= directionY;  // particle movement speed
        }else{
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }
        }
    }
}


// သူက Particle object ကို ခေါ်ပြီးသုံးမယ်
function init(){
   particleArray = [];
   for(let y = 0, y2 = textCoordinates.height; y < y2; y++ ){
        for(let x = 0, x2 = textCoordinates.width; x < x2; x++ ){
            if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){      //128 က opcity 50% 0 - 255
               let positionX = x + adjustX;
               let positionY = y + adjustY;
               particleArray.push(new Particle(positionX * 15 , positionY * 15));   // *10 က size
            }
        }
   }
}
init();

function animate(){       //Animation လုပ်ဖို့ 
   ctx.clearRect(0,0,canvus.width,canvus.height);
   for(let i = 0;i < particleArray.length;i++){
       particleArray[i].draw();
       particleArray[i].update();
   }
//    connect();
   requestAnimationFrame(animate);
}
animate();

function connect(){
    let opacityValue = 0.1;
    ctx.strokeStyle = 'rgba(255,255,255' + opacityValue +')';
    for(let a = 0; a < particleArray.length; a++){
        for(let b = a; b < particleArray.length; b++ ){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;

           let distance = Math.sqrt(dx * dy + dy * dy);
           if( distance < 10 ){
               ctx.lineWidth = 2;
               ctx.beginPath();
               ctx.moveTo(particleArray[a].x,particleArray[a].y);
               ctx.lineTo(particleArray[b].x,particleArray[b].y)
               ctx.stroke();
           }
        }
    }
}