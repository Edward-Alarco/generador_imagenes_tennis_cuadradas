(function () {
	
    let inputFile = document.getElementById("imageUpload"),
		popupCropper = document.querySelector(".popup_cropper"),
		popupCropperCanvas = document.querySelector(".popup_cropper-canvas");

    let image4Photo = document.querySelector('#imageContainer img');

    let cropper;

	if (inputFile) {
		inputFile.addEventListener("change", function (e) {
			document.body.classList.add("loading");

			var file = e.target.files[0];
			var reader = new FileReader();

            image4Photo.src = '';
            document.querySelector('.generate_image').disabled = true;

            setTimeout(() => {

                reader.onload = function (event) {
                    // Crear un nuevo elemento img
                    let img = document.createElement("img");
                    img.id = 'croppy';
                    img.src = event.target.result; // Usar la URL de la imagen cargada
    
                    // Limpiar cualquier imagen previa en el canvas
                    popupCropperCanvas.innerHTML = "";
                    popupCropperCanvas.appendChild(img);
    
                    // Quitar el loading y mostrar el popup
                    document.body.classList.remove("loading");

                    popupCropper.classList.add("active");


                    cropper = new Cropper(img, {
                        aspectRatio: 16/10
                    });

                };
    
                // Leer el archivo como una URL
                reader.readAsDataURL(file);
                
            }, 1000);


            popupCropper.querySelector('#cut').addEventListener('click', (e)=>{
                e.preventDefault();

                var croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
                image4Photo.src = croppedImage;
                document.querySelector('.generate_image').disabled = false;

                resetCropper();
            })

            popupCropper.querySelector('#clean').addEventListener('click', (e)=>{
                e.preventDefault();
                resetCropper();
            });

		});


        function resetCropper(){
            if(popupCropper.classList.contains("active")){
                popupCropper.classList.remove("active");
            }
            document.getElementById("imageUpload").value = '';
            setTimeout(() => {
                popupCropperCanvas.innerHTML = '';
            }, 500);
        }

	}

})();
