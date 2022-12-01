document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const doodler = document.createElement("div");
  let doodlerLeftSpace = 0;
  let doodlerBottomSpace = 0;
  let isGameOver = false;
  let platformCount = 5;
  let platforms = [];
  let score = 0;
  let upTimerId;
  let downTimerId;
  let platformID;


  function displayScore() {
    document.getElementById("scr").innerHTML = score;
  }

  function createDoodler() {
    grid.insertBefore(doodler, grid.firstChild.nextSibling);
    doodler.classList.add("doodler");
    doodlerBottomSpace = platforms[4].bottom;
    doodlerLeftSpace = platforms[4].left;
    doodler.style.left = doodlerLeftSpace + "px";
    doodler.style.bottom = doodlerBottomSpace + "px";
  }

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement("div");
      const visual = this.visual;
      visual.classList.add("platform");
      visual.style.left = this.left + "px";
      visual.style.bottom = this.bottom + "px";
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      let platGap = 750 / platformCount;
      let platBottom = 100 + i * platGap;
      let newPlatform = new Platform(platBottom);
      platforms.unshift(newPlatform);
    }
  }

  function createSinglePlatform() {
    let newPlatform = new Platform(750);
    platforms.unshift(newPlatform);
  }

  function modifyPlatform() {
    platforms.forEach((platform) => {
      if (platform.bottom <= 0) {
        platforms.pop();
        //console.log(grid.childNodes);
        createSinglePlatform();
        grid.removeChild(grid.firstChild.nextSibling.nextSibling);
        addScore();
      }
    });
  }

  function addScore() {
    score += 1;
  }

  function movePlatforms() {
    platforms.forEach((platform) => {
      platform.bottom -= 1;
      let visual = platform.visual;
      visual.style.bottom = platform.bottom + "px";
    });
  }

  function jumpDoodler() {
        const gap = doodlerBottomSpace + 150;
    stop(downTimerId);
    upTimerId = setInterval(function () {
      doodlerBottomSpace += 4;
      doodler.style.bottom = doodlerBottomSpace + "px";
     
      if (doodlerBottomSpace >= gap) {
        fallDoodler();
      }
    }, 30);
  }

  function fallDoodler() {
    stop(upTimerId);
    downTimerId = setInterval(function () {
      doodlerBottomSpace -= 4.5;
      doodler.style.bottom = doodlerBottomSpace + "px";

      platforms.forEach((platform) => {
        console.log(document.getElementsByClassName("doodler")[0].clientWidth);
        if (
          doodlerBottomSpace <=
            Number(platform.visual.style.bottom.slice(0, -2)) +
              platform.visual.clientHeight &&
          doodlerBottomSpace >=
            Number(platform.visual.style.bottom.slice(0, -2))
        ) {
          if (
            doodlerLeftSpace >=
              Number(platform.visual.style.left.slice(0, -2)) -
                document.getElementsByClassName("doodler")[0].clientWidth &&
            doodlerLeftSpace <=
              Number(platform.visual.style.left.slice(0, -2)) +
                platform.visual.clientWidth
          ) {
            console.log("touch");
            stop(downTimerId);
            jumpDoodler();
          }
        }
      });
      if (doodlerBottomSpace <= 0) {
        gameOver();
      }
    }, 30);
  }

  function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == "37") {
      // left arrow
      doodlerLeftSpace -= 5;
      doodler.style.left = doodlerLeftSpace + "px";
    } else if (e.keyCode == "39") {
      // right arrow
      doodlerLeftSpace += 5;
      doodler.style.left = doodlerLeftSpace + "px";
    }
  }

  function stop(id) {
    clearInterval(id);
  }

  function gameOver() {
    isGameOver = true;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(platformId);
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      platformId = setInterval(movePlatforms, 20);
      jumpDoodler();
      document.onkeydown = checkKey;
      setInterval(modifyPlatform, 10);
      setInterval(displayScore, 0);
    }
  }

  start();
});
