<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Copa Level Up 2024</title>
    <link rel="stylesheet" href="css/style.css">
    <script defer src="https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/dist/face-api.min.js"></script>
    <script defer src="script.js"></script>
</head>

<body>

    <?php
    // Leer el archivo JSON desde el archivo .txt
    $rutaArchivo = $_GET['json'] ?? '../json.txt';
    $jsonData = file_get_contents($rutaArchivo);
    $datos = json_decode($jsonData, true);
    ?>

    <?php if (!empty($datos)) : ?>
        <input type="file" id="imageUpload" accept=".jpg, .jpeg, .png">
        <canvas id="canvas" style="display:none;"></canvas>
        <div class="canvas">
            <div class="canvas_top">

                <p class="canvas_rounds"><?php echo htmlspecialchars($datos['ronda'] ?? ''); ?></p>
                <p class="canvas_format"><?php echo htmlspecialchars($datos['modalidad'] ?? ''); ?></p>

                <img src="images/logo.png" alt="Logo">
                <div class="canvas_top-title">
                    <p><?php echo htmlspecialchars($datos['titulo'] ?? ''); ?></p>
                    <h1>Resultados del partido</h1>
                </div>
                <div class="canvas_image" id="imageContainer"></div>
            </div>
            <div class="canvas_scores">
                <div class="canvas_scores-top canvas_scores-points">
                    <div>
                        <p><?php echo htmlspecialchars(implode(' + ', $datos['jugadores']['equipo1'])); ?></p>
                    </div>
                    <div>
                        <?php 
                        for ($i = 1; $i <= 4; $i++) {
                            if (isset($datos['resultados'][$i-1]["ronda$i"]['equipo1'])) {
                                echo '<span>' . htmlspecialchars($datos['resultados'][$i-1]["ronda$i"]['equipo1']) . '</span>';
                            }
                        }
                        ?>
                    </div>
                </div>
                <div class="canvas_scores-bottom canvas_scores-points">
                    <div>
                        <p><?php echo htmlspecialchars(implode(' + ', $datos['jugadores']['equipo2'])); ?></p>
                    </div>
                    <div>
                        <?php 
                        for ($i = 1; $i <= 4; $i++) {
                            if (isset($datos['resultados'][$i-1]["ronda$i"]['equipo2'])) {
                                echo '<span>' . htmlspecialchars($datos['resultados'][$i-1]["ronda$i"]['equipo2']) . '</span>';
                            }
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    <?php endif; ?>

</body>

</html>
