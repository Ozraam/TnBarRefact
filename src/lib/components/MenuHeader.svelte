<div class="p-3 flex">
    <img src="/Barbare.png" class="w-1/3" alt="">
    <div class="flex flex-1 justify-center flex-col items-center">
        <h1 class="text-[#b77236] font-bold text-6xl mb-2 text-center">
            Menu de la semaine
        </h1>
        <p class="text-[#e6a515] font-bold text-2xl text-center">
            Semaine du {new Date().toLocaleDateString('fr-FR', { day: '2-digit' })} au {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}
        </p>
    </div>
</div>

<style>
    @font-face {
		font-family: 'MenuFont';
		src: url('/OpenSans-VariableFont_wdth,wght.ttf') format('truetype');
		font-display: swap;
	}
    * {
        font-family: 'MenuFont', sans-serif;
    }
</style>