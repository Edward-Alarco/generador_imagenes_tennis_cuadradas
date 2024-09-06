(function(){

    const diagram = document.querySelector('.canvas'),
        fileInput = document.getElementById('imageUpload'),
        heroViewForBg = document.querySelector('.view_hero-input');

    let defaultImageUrl = 'images/bg/1.jpg';

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;

                diagram.classList.remove('bg');
                diagram.style.background = `url(${imageUrl})`;

                heroViewForBg.style.background = `url(${imageUrl})`;
                heroViewForBg.classList.add('with_preview');
            }
            reader.readAsDataURL(file);
        } else {
            resetToDefaultImage();
        }
    });
    
    document.querySelector('.delete_preview').addEventListener('click', function(){
        resetToDefaultImage();
    })

    function resetToDefaultImage(){
        diagram.style.background = ``;
        heroViewForBg.style.background = ``;

        if(!diagram.classList.contains('bg')){
            diagram.classList.add('bg');
        }
        if(heroViewForBg.classList.contains('with_preview')){
            heroViewForBg.classList.remove('with_preview');
        }
    }


}())