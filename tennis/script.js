async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri("../models");
  await faceapi.nets.faceLandmark68Net.loadFromUri("../models");
}

async function detectFaces(image) {
  const detections = await faceapi.detectAllFaces(image).withFaceLandmarks();
  return detections;
}

function cropImage(image, boxes, expand = 490, targetWidth = 1500, targetHeight = 1000) {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");

  // Calculate bounding box for all faces
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

  // Maintain aspect ratio of the target dimensions
  const targetAspectRatio = targetWidth / targetHeight;
  const currentAspectRatio = width / height;

  if (currentAspectRatio > targetAspectRatio) {
    // The width is too large; adjust it to maintain the aspect ratio
    const newWidth = height * targetAspectRatio;
    const delta = (width - newWidth) / 2;
    minX += delta;
    maxX -= delta;
    width = newWidth;
  } else if (currentAspectRatio < targetAspectRatio) {
    // The height is too large; adjust it to maintain the aspect ratio
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

document
  .getElementById("imageUpload")
  .addEventListener("change", async (event) => {

    if(!document.body.classList.contains('loading')){
      document.body.classList.add('loading');
    }

    const image = new Image();
    image.src = URL.createObjectURL(event.target.files[0]);

    image.onload = async () => {
      const detections = await detectFaces(image);

      document.getElementById("imageContainer").innerHTML = '';

      if (detections.length > 0) {
        const boxes = detections.map((d) => d.detection.box);
        const croppedImage = cropImage(image, boxes);
        const imgElement = document.createElement("img");
        imgElement.src = croppedImage;

        document.querySelector('.generate_image').disabled = false;

        document.getElementById("imageContainer").appendChild(imgElement);
        
        if(document.body.classList.contains('loading')){
          document.body.classList.remove('loading');
        }

      }
    };
  });

loadModels();