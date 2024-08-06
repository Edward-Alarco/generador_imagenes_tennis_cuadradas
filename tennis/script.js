async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri("../models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("../models");
}

async function detectFaces(image) {
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
  return detections;
}

function calculateExpand(boxes) {
  if (boxes.length < 2) return 600; // Valor por defecto si solo hay una cara

  // Calcular la distancia promedio entre las caras
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

  // Ajustar el valor de expand basado en la distancia promedio
  // Cuanto menor sea la distancia, mayor será el valor de expand
  return Math.max(600 - averageDistance / 2, 100);
}

function cropImage(image, boxes, expand, targetWidth = 1500, targetHeight = 1000) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Calcular la caja delimitadora para todas las caras
  let minX = Math.max(0, Math.min(...boxes.map((box) => box.left)) - expand);
  let minY = Math.max(0, Math.min(...boxes.map((box) => box.top)) - expand);
  let maxX = Math.min(
    image.width,
    Math.max(...boxes.map((box) => box.right)) + expand
  );
  let maxY = Math.min(
    image.height,
    Math.max(...boxes.map((box) => box.bottom)) + expand
  );

  let width = maxX - minX;
  let height = maxY - minY;

  // Mantener la relación de aspecto de las dimensiones objetivo
  const targetAspectRatio = targetWidth / targetHeight;
  const currentAspectRatio = width / height;

  if (currentAspectRatio > targetAspectRatio) {
    // El ancho es demasiado grande; ajustarlo para mantener la relación de aspecto
    const newWidth = height * targetAspectRatio;
    const delta = (width - newWidth) / 2;
    minX += delta;
    maxX -= delta;
    width = newWidth;
  } else if (currentAspectRatio < targetAspectRatio) {
    // La altura es demasiado grande; ajustarla para mantener la relación de aspecto
    const newHeight = width / targetAspectRatio;
    const delta = (height - newHeight) / 2;
    minY += delta;
    maxY -= delta;
    height = newHeight;
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;

  context.drawImage(image, minX, minY, width, height, 0, 0, targetWidth, targetHeight);

  return canvas.toDataURL();
}

document.getElementById("imageUpload").addEventListener("change", async (event) => {
  if (!document.body.classList.contains('loading')) {
    document.body.classList.add('loading');
  }

  document.querySelector('.generate_image').disabled = true;

  const image = new Image();
  image.src = URL.createObjectURL(event.target.files[0]);

  image.onload = async () => {
    const detections = await detectFaces(image);

    document.getElementById("imageContainer").innerHTML = '';

    if (detections.length > 0) {
      const boxes = detections.map((d) => d.detection.box);
      const expand = calculateExpand(boxes);
      const croppedImage = cropImage(image, boxes, expand);
      const imgElement = document.createElement("img");
      imgElement.src = croppedImage;

      document.querySelector('.generate_image').disabled = false;

      document.getElementById("imageContainer").appendChild(imgElement);

      if (document.body.classList.contains('loading')) {
        document.body.classList.remove('loading');
      }
    }
  };
});

loadModels();