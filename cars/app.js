let container = document.querySelector('.container');
let car = document.querySelector('.car');
let min_left = document.querySelectorAll('.road')[0].offsetLeft;
let max_left = document.querySelectorAll('.road')[2].offsetLeft;

//Play the sound
let bgsound = document.getElementById('bgmusic');
let asound = document.getElementById('amusic');
let crashsound = document.getElementById('crashmusic');

let score = 0;
let state = false;
let cheat  = false;
let chrono = 0;
let crash = false;
let bestScore = 10000;
if(navigator.cookieEnabled) {
    if(document.cookie.indexOf('Best') == -1) {
        setCookie('Best', bestScore,  365);
    }else {
        getBestscore();
    }
}
Score() ;
document.querySelector('.bestScore').innerHTML = bestScore;
// When a key is pressed
document.addEventListener('keydown', (e) => {
    
    
    if(e.key === ' ') {
        jump();
    }else if(e.key === 'ArrowLeft') {
        moveLeft();
    }else if(e.key === 'ArrowRight') {
        moveRight();
    }else if(e.key === 'ArrowUp') {
        moveTop();
    }else if(e.key === 'ArrowDown') {
        moveDown();
    }
});

let btnUp = document.querySelector('.up');
let btnDown = document.querySelector('.down');
let btnLeft = document.querySelector('.left');
let btnRight = document.querySelector('.right');
let btnMiddle = document.querySelector('.middle');
btnUp.addEventListener('click', function() {
    
    moveTop();
});
btnDown.addEventListener('click', function() {
    moveDown();
});
btnLeft.addEventListener('click', function() {
    moveLeft();
});
btnRight.addEventListener('click', function() {
    moveRight();
});
btnMiddle.addEventListener('mouseenter', function() {
    jump();    
});
btnMiddle.addEventListener('mouseleave', function() {
    jumpOver(); 
});

function moveDown() {
    if(crash) { return false; }
    let top = parseInt(car.offsetTop) + 50;
    if(top < 600 && window.innerWidth > 768)
        car.style.top = top + 'px';
    else if(top < window.innerHeight - 50)
        car.style.top = top + 'px';
}
function moveTop() {
    if(crash) { return false; }
    let top = parseInt(car.offsetTop) - 50;
    if(top > 0)
        car.style.top = top + 'px';
}
function moveLeft() {
    if(crash) { return false; }
    let marge = 25;
    if(window.innerWidth <= 768) {
        marge = 20;
    }
    let left = parseInt(car.offsetLeft) - marge;
    if(left > min_left + marge - 25)
        car.style.left = left + 'px';
}
function moveRight() {
    if(crash) { return false; }
    let marge = 25;
    if(window.innerWidth <= 768) {
        marge = 20;
    }
    let left = parseInt(car.offsetLeft) + marge;
    if(left < max_left + marge)
        car.style.left = left + 'px';
}
function jump() {
    if(crash) { return false; }

    if(window.innerWidth > 768){
        car.style.width = "120px";
        car.style.height = "120px";
    }else {
        car.style.width = "90px";
        car.style.height = "90px";
    }

    setTimeout(function() {
        chrono += 1;
        console.log(chrono);
    }, 1000);
    
}

//When space key is clicked
document.addEventListener('keyup', (e) => {
    if(crash) { return false; }
    
    if(e.key === ' ') {
        jumpOver();
    }
});
function jumpOver() {
    asound.play();
    
    if(window.innerWidth > 768){
        car.style.width = "100px";
        car.style.height = "100px";
    }else {
        car.style.width = "70px";
        car.style.height = "70px";
    }
    chrono = 0;
}


function generateCars(position, speeds, latence, car, speederPro) {

    setTimeout(function() {
        let images = ['bike', 'aventador', 'slr', '' , 'Stingray', '', 'Mach6', 'diablo', 'nsx'];
        let rand = Math.floor(Math.random()*speederPro);
        if(speederPro > 10)
            speederPro -= 5; 
        let image = images[Math.floor(Math.random()*(images.length))];
        if(rand == 1) { 
            image = 'speeder'
        }
        let img = document.createElement('img');
        if(image != '' ){
            
            img.src = "img/" + image + '.png';
            img.setAttribute('class', 'oppositeCar');
            img.style.position = 'fixed';
            img.style.left = position ;
            img.style.top = '-150px';

            if(window.innerWidth > 768){
                img.style.width = '100px';
                img.style.height = '100px';
            }else {
                img.style.width = '70px';
                img.style.height = '70px';
            }
            let top = parseInt(img.offsetTop);
            
            
            document.querySelector('body').appendChild(img);
            Move(speeds[image], img, car);
        }

        if(latence > 3000 ) { latence -= 200; }
        if(latence >= 4000 && latence%1000 == 0) { 
            if(speeds.bike >= 1) { speeds.bike -= 0.4; }
            if(speeds.speeder > 2) { speeds.speeder -= 0.4; }
            if(speeds.aventador > 2) { speeds.aventador -= 0.4; }
            if(speeds.slr > 2) { speeds.slr -= 0.4; }
            if(speeds.Stingray > 2) { speeds.Stingray -= 0.4; }
            if(speeds.Mach6 > 2) { speeds.Mach6 -= 0.4; }
            if(speeds.diablo > 2) { speeds.diablo -= 0.4; }
        }
        if(score > bestScore) {
            setCookie('Best', score, 0);
            setCookie('Best', score, 365);
        }
        if(!state)
            generateCars(position, speeds, latence, car, speederPro);
        else
            game_over(car);

    }, latence);
    
}

function Move(speed, el, car) {
    let pos=0;
    let id=setInterval(frame, speed);
    function frame() {
        if(pos == window.innerHeight + 30) {
            clearInterval(id);
            document.querySelector('body').removeChild(el);
            score += 5;
            Score();
        }else {
            pos++;
            el.style.top = pos + 'px';
            if(crashed(el, car)) { 
                clearInterval(id);
                crash = true;
            }
        }
    }

    return false;
}

function distanceVertical(el, racecar) {
    return (Math.abs(parseInt(el.offsetTop) - parseInt(racecar.offsetTop)));
}

function distanceHorizontal(el, racecar) {
    return (Math.abs(parseInt(racecar.offsetLeft) - parseInt(el.offsetLeft)));
}


function crashed(img, racecar) {
    let minDistance = 90;
    let large = '120px';
    if(window.innerWidth <= 768) {
        minDistance = 65;
        large = '90px';
    }
    if(distanceVertical(img, racecar) == minDistance  && 
        (distanceHorizontal(img, racecar) < minDistance ) && racecar.style.width != large) {
        crashsound.play();
        state = true;
        return true;
    }else if((distanceVertical(img, racecar) < minDistance) && 
        distanceHorizontal(img, racecar) == minDistance && racecar.style.width != large) {
        crashsound.play();
        
        state = true;
        return true;
    }

    if(racecar.style.width == large &&
        (parseInt(racecar.offsetTop) - parseInt(img.offsetTop) == -1*minDistance) && 
        (distanceHorizontal(img, racecar) < minDistance)){
            score += 20;
            if(img.src.includes('speeder')) {
                score += 80;
            }else if(img.src.includes('bike')) {
                score += 30;
            }
            Score();
    }

    return false;
}

function Score() {
    let scores = document.querySelectorAll('.score');
    for(var i=0; i < scores.length; i++) {
        scores[i].innerHTML = score;
    }
}

function go(car) {
    let speeds = {'bike': 7, 'aventador': 10, 'slr': 11, 'Stingray': 10, 'Mach6': 10, 'diablo': 10, 'nsx': 11,
    'speeder': 0.05};
    

    let latences = [10000, 6000, 8000];
    
    if(window.innerWidth > 768){
        generateCars('46.25%', speeds, latences[Math.floor(Math.random()*latences.length)], car, 30);
        generateCars('36.25%', speeds, latences[Math.floor(Math.random()*latences.length)], car, 30);
        generateCars('56.25%', speeds, latences[Math.floor(Math.random()*latences.length)], car, 30);
    }else {
        generateCars('41.25%', speeds, latences[Math.floor(Math.random()*latences.length)], car, 30);
        generateCars('8%', speeds, latences[Math.floor(Math.random()*latences.length)], car, 30);
        generateCars('75%', speeds, latences[Math.floor(Math.random()*latences.length)], car, 30);
    }
    
    

}


let btnPlay = document.querySelector('.play');
let cancelBtn = document.querySelector('.cancel');
let replayBtn = document.querySelector('.replay');
replayBtn.style.display = 'none';

let alertOver = document.querySelector('.alert_over');
alertOver.style.display =  'none';

function game_over(car) {
    alertOver.style.display =  'block';
    let position = '46.25%';
    replayBtn.style.display = 'block';
    cancelBtn.style.display = 'block';
    
    if(window.innerWidth <= 768){ position = '36.25%';}
    replayBtn.addEventListener('click', function() {
        window.location.reload();
    });
}
btnPlay.addEventListener('click', function() {
    btnPlay.style.display = 'none';
    cancelBtn.style.display = 'none';
   
    bgsound.play();
    go(car);
});

function setCookie(name, value, exdays) {
    var date = new Date();
    date.setTime(date.getTime() + exdays*24*60*60*1000);
    var expires = "expires="+date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path = /";
}

function getBestscore() {
    var cookies = document.cookie.split(';');
    for(var i=0; i < cookies.length; i++) {
        var infos = cookies[i].split('=');
        if(infos[0] == ' Best') {
            bestScore = parseInt(infos[1]);
        }
    }
}


