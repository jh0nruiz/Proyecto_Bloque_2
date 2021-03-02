const cameraContainer = document.getElementById("camera-container");
const createButton = document.getElementById("create-button");
const step1 = document.getElementById("step-1");
const step2 = document.getElementById("step-2");
const step3 = document.getElementById("step-2");
const createLabel = document.getElementById("create-label");

let stream;
let recorder;
let video;
let formdata;

let timer;
let hours = "00";
let minutes = "00";
let seconds = "00";

async function getStreamAndRecord() {
  cameraContainer.innerHTML = `
  <h2>¿Nos das acceso a tu cámara?</h2>
  <p>¡Crea tu GIFO en sólo 3 pasos! por el tiempo en el que estés creando el GIFO.</p>`;

  addClass(createButton, "hidden");
  addClass(step1, "activate");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });

    video = document.createElement("video");
    cameraContainer.innerHTML = "";
    cameraContainer.appendChild(video);
    video.srcObject = stream;
    await video.play();

    removeClass(createButton, "hidden");
    removeClass(step1, "activate");
    addClass(step2, "activate");
    createButton.innerText = "GRABAR";

    return stream;
  } catch (error) {
    console.error(error);
  }
}

function chronometer() {
  seconds++;

  if (seconds < 10) seconds = `0` + seconds;

  if (seconds > 59) {
    seconds = `00`;
    minutes++;

    if (minutes < 10) minutes = `0` + minutes;
  }

  if (minutes > 59) {
    minutes = `00`;
    hours++;

    if (hours < 10) hours = `0` + hours;
  }

  createLabel.textContent = `${hours}:${minutes}:${seconds}`;
}

function addHoverVideo(text, iconType = false) {
  const divHover = document.createElement("div");

  const icon = getIcon(iconType);

  addClass(divHover, "div-hover-create");
  divHover.innerHTML = `
    ${icon}
    <h2>${text}</h2>
  `;

  divHover.style.width = `${video.offsetWidth}px`;
  divHover.style.height = `${video.offsetHeight}px`;

  cameraContainer.insertBefore(divHover, video);
}

function removeHoverVideo() {
  cameraContainer.firstChild = "";
}

createButton.addEventListener("click", async () => {
  switch (createButton.innerText) {
    case "COMENZAR":
      stream = await getStreamAndRecord();
      break;

    case "GRABAR":
      console.log("grabando", stream);
      recorder = RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function () {
          console.log("started");
        },
      });

      recorder.startRecording();
      createButton.innerText = "FINALIZAR";
      addClass(createLabel, "active");
      timer = setInterval(chronometer, 1000);

      break;

    case "FINALIZAR":
      console.log("stop");
      await recorder.stopRecording();
      await video.pause();
      clearInterval(timer);

      formdata = new FormData();
      formdata.append("file", recorder.getBlob(), "myGif.gif");

      createLabel.innerText = "REPETIR CAPTURA";
      createLabel.classList.add("hover");
      createButton.innerText = "SUBIR GIFO";

      createLabel.addEventListener("click", async () => {
        console.log("repetir");
        createLabel.innerText = "";
        createLabel.classList.remove("hover");
        createButton.innerText = "GRABAR";
        stream = await getStreamAndRecord();
      });

      break;

    case "SUBIR GIFO":
      console.log("subiendo");
      addHoverVideo("Estamos Subiendo tu Gifo", "spinner");

      try {
        const response = await uploadGif(formdata);
        console.log(response);
        const gifo = await fetchGifById(response.data.id);
        console.log(gifo);
        storageMyGifo(gifo.data);
      } catch (error) {
        console.error(error);
      }

      // Replace Hover Div
      createLabel.removeEventListener("click", null);
      cameraContainer.removeChild(cameraContainer.children[0]);
      addHoverVideo("GIF subido con éxto", "success");

      createButton.innerText = "COMENZAR";
      break;

    default:
      break;
  }
});
