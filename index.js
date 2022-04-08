const playerImg = new Image();
playerImg.src = "./images/player.png"
const bulletImg = new Image();
bulletImg.src = "./images/bulImg.png"
const enemyImg = new Image();
enemyImg.src = "./images/EnemyShip.png"
const backgroundImg = new Image();
backgroundImg.src = "./images/bg.png"

const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = innerWidth/3
canvas.height = innerHeight



const number_of_enemies = 7
let score = 0
let number_of_lives = 5

//Class for Player ship
class Player{
    constructor() {
        this.position = {
            x: canvas.width/2,
            y: canvas.height - 100
        }
        this.width = 30
        this.height = 30
        this.velocity = 0
        this.image = playerImg
        this.size = 100

    }

    draw() {
        context.drawImage(this.image, (this.position.x - this.width), this.position.y, this.size, this.size)
    }

    update() {
        this.draw()
        if (this.position.x + this.width + this.velocity >= canvas.width)
                this.velocity = 0
        if (this.position.x + this.width + this.velocity <= 0)
                this.velocity = 0
        this.position.x += this.velocity
    }
}


//Class for bullet
class Bullet {
    constructor( x, y ) {
        this.position = {
            x,
            y
        }
        this.image = bulletImg
        this.velocity = 10
        this.delete = false
        this.size = 25
    }
    draw() {
        context.drawImage(this.image, this.position.x, this.position.y, this.size, this.size)
    }
    update() {
        this.draw()
        //Condition to check if bullet has passed the canvas height
        if (this.position.y <= 0) {
            this.velocity = 0
            this.delete = true
        }
        this.position.y -= this.velocity
    }

}

//Class for Enemy ship
class Enemy {
    constructor( x, y ) {
        this.position = {
            x,
            y
        }
        this.image = enemyImg
        this.velocity = 1
        this.delete = false
        this.size = 60
    }
    draw() {
        context.drawImage(this.image, this.position.x, this.position.y, this.size, this.size)
    }
    update() {
        this.draw()
        //Condition to check if enemy ship has passed the canvas height
        if (this.position.y >= canvas.height) {
            number_of_lives -=1 
            this.delete = true
        }
        this.position.y += this.velocity
    }

}

const player = new Player() //Create new instance of Player class
const bullets = [] //Array to store instance of Bullet class
const enemys = [] //Array to store instance of Enemy class
for (let i = 0; i < number_of_enemies; i++) {
    setTimeout(() => {enemys.push(new Enemy(Math.floor(Math.random() * (canvas.width - 60)),0))}, 1000 * i)
    //"-60" to make sure enemy ship are not spawned outside the canvas width
}

//Variable to track key preassed status
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    space:{
        pressed: false
    }
}


function animate() {
    //Condition to check if player has run out of lives
    if (number_of_lives <= 0) {
        context.font = "30px Comic Sans MS";
        context.fillStyle = "red";
        context.textAlign = "center";
        context.fillText("GAME OVER!", canvas.width/2, canvas.height/2)
        context.fillText("Score:"+score, canvas.width/2, (canvas.height/2)+30)
        return
    }
        
    requestAnimationFrame(animate)
    context.clearRect(0, 0, canvas.width, canvas.height) 
    context.drawImage(backgroundImg,0,0, canvas.width, canvas.height)
    context.font = "20px Comic Sans MS";
    context.fillStyle = "red";
    context.fillText("Score:"+score, 10,20)
    context.fillText("Lives:"+number_of_lives, 10,40)
    player.update()

    bullets.forEach((bullet,index) => {
        bullet.update()
        
        enemys.forEach((enemy,index) => {
            //Collision detection between Bullet & Enemy ship
            if (bullet.position.x >= (enemy.position.x ) & bullet.position.x <= (enemy.position.x + (enemy.size)) 
                & bullet.position.y >= enemy.position.y & bullet.position.y<= (enemy.position.y + enemy.size)) {
                enemy.delete = true
                bullet.delete= true
                score += 10
            }
        })

        if (bullet.delete) {
            bullets.splice(index,1)
        }
    })

    enemys.forEach((enemy,index) => {
        enemy.update()
        if (enemy.delete) {
            enemy.position.x = Math.floor(Math.random() * (canvas.width - enemy.size))
            //"- enemy.size" to make sure enemy ship are not spawned outside the canvas width
            enemy.position.y = 0
            enemy.delete = false
        } 
    })

    if (keys.right.pressed) {
        player.velocity = 10
    } else if (keys.left.pressed){
        player.velocity = -10
    }else player.velocity = 0

    if (keys.space.pressed) {
        bullets.push(new Bullet( player.position.x +8 , player.position.y )) 
        // "+8" is to fine tune the bullet with the tip of player ship
        keys.space.pressed = false
    }
}

animate()
//Key pressed listener
addEventListener('keydown', ({ code }) => {
    switch (code) {
        case 'ArrowRight':
            keys.right.pressed = true
            break

        case 'ArrowLeft':
            keys.left.pressed = true
            break

        case 'Space':
            keys.space.pressed = true
            break
    }
})
//Key released listener
addEventListener('keyup', ({ code }) => {
    switch (code) {
        case 'ArrowRight':
            keys.right.pressed = false
            break

        case 'ArrowLeft':
            keys.left.pressed = false
            break

        case 'Space':
            keys.space.pressed = false
            break
    }
})
