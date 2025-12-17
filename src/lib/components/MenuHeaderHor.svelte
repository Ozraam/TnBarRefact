<div class="p-3 flex h-1/3">
    <img src="/Barbare.png" class="" alt="">
    <div class="flex flex-1 justify-center flex-col items-center">
        <h1 class="text-[#b77236] font-bold text-8xl mb-2 text-center w-full">
            Menu de la semaine
        </h1>
        <p class="text-[#e6a515] font-bold text-3xl text-center w-full">
            Semaine du {new Date().toLocaleDateString('fr-FR', { day: '2-digit' })} au {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long' })}
        </p>
    </div>
</div>