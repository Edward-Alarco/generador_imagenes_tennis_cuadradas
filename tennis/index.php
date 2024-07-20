<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Face Detection and Cropping</title>
    <link rel="stylesheet" href="css/style.css">
    <script defer src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/dist/face-api.min.js"></script>
    <script defer src="script.js"></script>
</head>
<body>
    
    <input type="file" id="imageUpload" accept=".jpg, .jpeg, .png">
    <canvas id="canvas" style="display:none;"></canvas>
    
    
    <div class="canvas">
        <div class="canvas_top">
            
            <p class="canvas_rounds">1/8 de final</p>
            <p class="canvas_format">Dobles Libre</p>

            <img src="images/logo.png">
            <div class="canvas_top-title">
                <p>Copa Level Up 2024</p>
                <h1>Resultados del partido</h1>
            </div>
            <div class="canvas_image" id="imageContainer"></div>
        </div>
        <div class="canvas_scores">
            <div class="canvas_scores-top canvas_scores-points">
                <div>
                    <p>Arturo + Boris</p>
                </div>
                <div>

                </div>
            </div>
            <div class="canvas_scores-bottom canvas_scores-points">
                <div>
                    <p>Juan I. + Juan V.</p>
                </div>
                <div>
                    
                </div>
            </div>
        </div>
    </div>

</body>
</html>