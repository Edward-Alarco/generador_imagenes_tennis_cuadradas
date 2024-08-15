async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri("../models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("../models");
}

async function detectFaces(image) {
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
  return detections;
}

function calculateExpand(boxes) {
  if (boxes.length < 2) return 600;

  let totalDistance = 0;
  let count = 0;

  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const dx = boxes[i].x - boxes[j].x;
      const dy = boxes[i].y - boxes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      totalDistance += distance;
      count++;
    }
  }

  const averageDistance = totalDistance / count;

  // Ajuste del expand basado en la distancia y tamaño de las caras
  return Math.max(600 - averageDistance / 2, 100);
}

function calculateZoom(boxes) {
  let faceSizes = boxes.map(box => box.width * box.height);
  let avgFaceSize = faceSizes.reduce((a, b) => a + b, 0) / faceSizes.length;

  const referenceFaceSize = 5000; // Valor de referencia para distinguir entre cerca y lejos.

  let result = {
    zoom: 0,
    distance: ''
  };

  if (avgFaceSize > referenceFaceSize) {
    result.zoom = -0.04;
    result.distance = 'cerca';
  } else {
    result.zoom = 0.10;
    result.distance = 'lejos';
  }

  return result;
}

function cropImage(image, boxes, expand) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  const targetAspectRatio = 16 / 10; // Aspect-ratio 16:10
  const targetWidth = 1600; // Puedes ajustar estos valores según tu necesidad
  const targetHeight = targetWidth / targetAspectRatio;

  let minX = Math.max(0, Math.min(...boxes.map((box) => box.left)) - expand);
  let minY = Math.max(0, Math.min(...boxes.map((box) => box.top)) - expand);
  let maxX = Math.min(image.width, Math.max(...boxes.map((box) => box.right)) + expand);
  let maxY = Math.min(image.height, Math.max(...boxes.map((box) => box.bottom)) + expand);

  let width = maxX - minX;
  let height = maxY - minY;

  const currentAspectRatio = width / height;

  // Aplicar zoom basado en si están cercas o lejos
  let zoom = calculateZoom(boxes);

  width *= (1 + zoom);
  height *= (1 + zoom);

  // Ajustar las coordenadas de minX y minY para asegurar que la imagen no se salga del canvas
  if (minX < 0) minX = 0;
  if (minY < 0) minY = 0;
  if (maxX > image.width) maxX = image.width;
  if (maxY > image.height) maxY = image.height;

  // Recalcular las dimensiones después del zoom y asegurar que no se salgan del canvas
  if (minX + width > image.width) {
    width = image.width - minX;
  }
  if (minY + height > image.height) {
    height = image.height - minY;
  }

  if (currentAspectRatio > targetAspectRatio) {
    const newWidth = height * targetAspectRatio;
    const delta = (width - newWidth) / 2;
    minX += delta;
    width = newWidth;
  } else if (currentAspectRatio < targetAspectRatio) {
    const newHeight = width / targetAspectRatio;
    const delta = (height - newHeight) / 2;
    minY += delta;
    height = newHeight;
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  context.drawImage(image, minX, minY, width, height, 0, 0, targetWidth, targetHeight);

  return canvas.toDataURL();
}


document.getElementById("imageUpload").addEventListener("change", async (event) => {
  const file = event.target.files[0];

  if (!document.body.classList.contains('loading')) {
    document.body.classList.add('loading');
  }

  document.querySelector('.generate_image').disabled = true;

  if (!file) {
    if (document.body.classList.contains('loading')) {
      document.body.classList.remove('loading');
    }
    document.getElementById("imageUpload").value = '';
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);

  image.onload = async () => {
    const detections = await detectFaces(image);
  
    document.getElementById("imageContainer").innerHTML = '';
  
    if (document.querySelector('.uploaded_photo')) {
      document.querySelector('.uploaded_photo').parentElement.removeChild(document.querySelector('.uploaded_photo'));
    }
  
    console.log(detections.length);
    if (detections.length > 0) {
      const boxes = detections.map((d) => d.detection.box);
      const expand = calculateExpand(boxes);
      const zoomInfo = calculateZoom(boxes);
      const croppedImage = cropImage(image, boxes, expand);
      const imgElement = document.createElement("img");
      imgElement.src = croppedImage;
  
      document.querySelector('.generate_image').disabled = false;
      document.getElementById("imageContainer").appendChild(imgElement);
  
      const li = document.createElement('li');
      li.classList.add('uploaded_photo');
      li.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="ionicon check" viewBox="0 0 512 512">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128L192 384l-96-96" />
        </svg>
        <p>Foto cargada correctamente! <br>Se encontraron <b>${detections.length} rostros</b>. Además, se consideran <b>${zoomInfo.distance}</b> del encuadre de la foto.</p>
      `;
  
      document.querySelector('ul#testing').appendChild(li);
  
      if (document.body.classList.contains('loading')) {
        document.body.classList.remove('loading');
      }
    } else {
  
      if (document.body.classList.contains('loading')) {
        document.body.classList.remove('loading');
      }
      document.getElementById("imageUpload").value = '';
  
      setTimeout(() => {
        alert('No se pudo reconocer alguna cara en la imagen.');
      }, 500);
    }
  };
  
});

loadModels();