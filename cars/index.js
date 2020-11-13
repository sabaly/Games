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

// When a key is pressed
document.addEventListener('keydown', (e) => {
    
    let marge = 25;
    if(window.innerWidth <= 768) {
        marge = 20;
    }
    if(e.key === ' ') {
        if(window.innerWidth > 768){
            car.style.width = "120px";
            car.style.height = "120px";
        }else {
            car.style.width = "90px";
            car.style.height = "90px";
        }
    }else if(e.key === 'ArrowLeft') {
        let left = parseInt(car.offsetLeft) - marge;
        if(left > min_left + marge - 25)
            car.style.left = left + 'px';
    }else if(e.key === 'ArrowRight') {
        let left = parseInt(car.offsetLeft) + marge;
        if(left < max_left + marge)
            car.style.left = left + 'px';
    }else if(e.key === 'ArrowUp') {
        let top = parseInt(car.offsetTop) - 50;
        if(top > 0)
            car.style.top = top + 'px';
    }else if(e.key === 'ArrowDown') {
        let top = parseInt(car.offsetTop) + 50;
        if(top < 600 && window.innerWidth > 768)
            car.style.top = top + 'px';
        else if(top < window.innerHeight - 50)
            car.style.top = top + 'px';
    }
});

//When space key is clicked
document.addEventListener('keyup', (e) => {
    
    if(e.key === ' ') {
        asound.play();
        if(window.innerWidth > 768){
            car.style.width = "100px";
            car.style.height = "100px";
        }else {
            car.style.width = "70px";
            car.style.height = "70px";
        }
    }
});



function generateCars(position, speeds, latence, car) {

    setTimeout(function() {
        let images = ['bike', '', 'aventador', 'slr', '' , 'Stingray', '', 'Mach6', 'diablo', 'nsx', ''];
    
        let image = images[Math.floor(Math.random()*(images.length))];
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
                
            Move(speeds[image], img, car);
            document.querySelector('body').appendChild(img);
            
            setTimeout(function() {
                document.querySelector('body').removeChild(img);
            }, speeds[image]*2000);


        }

        if(latence > 6000 ) { latence -= 500; }
        if(latence >= 4000 && latence%1000 == 0) { 
            if(speeds.bike >= 4) { speeds.bike -= 0.3; }
            if(speeds.speeder > 2) { speeds.speeder -= 0.4; }
            if(speeds.aventador > 5) { speeds.aventador -= 0.2; }
            if(speeds.slr > 6) { speeds.slr -= 0.2; }
            if(speeds.Stingray > 6) { speeds.Stingray -= 0.4; }
            if(speeds.Mach6 > 7) { speeds.Mach6 -= 0.1; }
            if(speeds.diablo > 5) { speeds.diablo -= 0.2; }
        }
        if(!state)
            generateCars(position, speeds, latence, car);
        else
            game_over(car);

    }, latence);
    
}

function Move(speed, el, car) {
    let pos=0;
    let id=setInterval(frame, speed);
    function frame() {
        if(pos == 1000) {
            clearInterval(id);
        }else {
            pos++;
            el.style.top = pos + 'px';
            if(crashed(el, car)) { 
                clearInterval(id);
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
        (parseInt(racecar.offsetTop) - parseInt(img.offsetTop) == -1*minDistance)){
            score += 5;
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
    let speeds = {'bike': 9, 'aventador': 10, 'slr': 11, 'Stingray': 10, 'Mach6': 14, 'diablo': 12, 'nsx': 13,
    'speeder': 4};
    
    let latence = 10000;
    
    if(window.innerWidth > 768){
        generateCars('46.25%', speeds, latence, car);
        generateCars('36.25%', speeds, latence, car);
        generateCars('56.25%', speeds, latence, car);
    }else {
        generateCars('36.25%', speeds, latence, car);
        generateCars('24.25%', speeds, latence, car);
        generateCars('56.25%', speeds, latence, car);
    }
    
    

}


let btnPlay = document.querySelector('.play');
let cancelBtn = document.querySelector('.cancel');
let alertOver = document.querySelector('.alert_over');

function game_over(car) {
    alertOver.style.display =  'block';
    let position = '46.25%';
    if(window.innerWidth <= 768){ position = '36.25%';}
    setTimeout(function() {
        window.location.reload();
        
    }, 8000);
}
btnPlay.addEventListener('click', function() {
    btnPlay.style.display = 'none';
    cancelBtn.style.display = 'none';
   
    bgsound.play();
    go(car);
});

