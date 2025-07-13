<template>
    <NavBar />
    <div class="language-selector">
        <img src="@/assets/flags/brazil.svg" @click="currentLanguage = 'pt'" alt="Português" title="Português">
        <img src="@/assets/flags/us.svg" @click="currentLanguage = 'en'" alt="English" title="English">
        <img src="@/assets/flags/france.svg" @click="currentLanguage = 'fr'" alt="Français" title="Français">
    </div>

    <div v-if="currentLanguage === 'en'" class="info-container">
        <section class="info-section">
            <h2>General information about this site</h2>
            <ul>
                <li>This site is still under construction. Some features are missing, and bugs are still frequent. Some
                    music sheet are wrong or displayed poorly.</li>
                <li>All transpositions were created automatically, they might contain errors.
                    You can get in touch with me if you spot any error </li>
                <li>
                    If you want to contribute by providing MuseScore files you would like to see included in
                    this library, feel free to contact me.
                </li>
                <li> If you have any copyright concerns or claims regarding the content on this site, please contact me
                    at <em>florian.dadouchi@gmail.com</em>. We respect intellectual property rights and will
                    address any issues.
                </li>
            </ul>
        </section>

        <section class=" info-section">
            <h2>Using the MuseScore Page</h2>
            <p>The MuseScore page allows you to view and interact with the sheet music : </p>
            <ul>
                <li>You can play the music (midi)</li>
                <li>Adjust playback speed using the tempo control</li>
                <li>Loop sections by selecting measures and clicking the loop button</li>
                <li>Toggle between different instruments (C, Eb or Bb)</li>
            </ul>
        </section>

        <section class="info-section">
            <h2>Using the OSMD Page</h2>
            <p>The OSMD (OpenSheetMusicDisplay) page offers an alternative way to view sheet music, better suited for
                screens. Here's what you can do :</p>
            <ul>
                <li>Zoom in or out using the controls at the top of the page</li>
                <li>Change the tonality to any instrument</li>
            </ul>
        </section>
    </div>

    <div v-if="currentLanguage === 'pt'" class="info-container">
        <section class="info-section">
            <h2>Informações gerais sobre este site</h2>
            <ul>
                <li>Este site ainda está em construção. Algumas funcionalidades estão faltando e bugs ainda são
                    frequentes. Algumas partituras estão erradas ou mal exibidas.</li>
                <li>Todas as transposições foram criadas automaticamente, elas podem conter erros. Você pode entrar em
                    contato comigo se encontrar algum erro.</li>
                <li>Se você quiser contribuir fornecendo arquivos MuseScore que gostaria de ver incluídos nesta
                    biblioteca, sinta-se à vontade para me contatar.</li>
                <li>Se você tiver alguma preocupação ou reivindicação de direitos autorais em relação ao conteúdo deste
                    site, entre em contato comigo em <em>florian.dadouchi@gmail.com</em>. Respeitamos os direitos de
                    propriedade intelectual e trataremos de quaisquer problemas.</li>
            </ul>
        </section>

        <section class="info-section">
            <h2>Usando a Página MuseScore</h2>
            <p>A página MuseScore permite que você visualize e interaja com as partituras:</p>
            <ul>
                <li>Você pode tocar a música (midi)</li>
                <li>Ajustar a velocidade de reprodução usando o controle de tempo</li>
                <li>Repetir seções selecionando compassos e clicando no botão de loop</li>
                <li>Alternar entre diferentes instrumentos (C, Eb ou Bb)</li>
            </ul>
        </section>

        <section class="info-section">
            <h2>Usando a Página OSMD</h2>
            <p>A página OSMD (OpenSheetMusicDisplay) oferece uma maneira alternativa de visualizar partituras, mais
                adequada para telas. Aqui está o que você pode fazer:</p>
            <ul>
                <li>Aumentar ou diminuir o zoom usando os controles no topo da página</li>
                <li>Mudar a tonalidade para qualquer instrumento</li>
            </ul>
        </section>
    </div>


    <div v-if="currentLanguage === 'fr'" class="info-container">
        <section class="info-section">
            <h2>Informations générales sur ce site</h2>
            <ul>
                <li>Ce site est encore en construction. Certaines fonctionnalités sont manquantes et des bugs sont
                    encore fréquents. Certaines partitions sont erronées ou mal affichées.</li>
                <li>Toutes les transpositions ont été créées automatiquement, elles peuvent contenir des erreurs. Vous
                    pouvez me contacter si vous repérez une erreur.</li>
                <li>Si vous souhaitez contribuer en fournissant des fichiers MuseScore que vous aimeriez voir inclus
                    dans cette bibliothèque, n'hésitez pas à me contacter.</li>
                <li>Si vous avez des préoccupations ou des réclamations concernant les droits d'auteur sur le contenu de
                    ce site, veuillez me contacter à <em>florian.dadouchi@gmail.com</em>. Nous respectons les droits de
                    propriété intellectuelle et traiterons tout problème.</li>
            </ul>
        </section>

        <section class="info-section">
            <h2>Utilisation de la page MuseScore</h2>
            <p>La page MuseScore vous permet de visualiser et d'interagir avec les partitions :</p>
            <ul>
                <li>Vous pouvez jouer la musique (midi)</li>
                <li>Ajuster la vitesse de lecture en utilisant le contrôle du tempo</li>
                <li>Mettre en boucle des sections en sélectionnant des mesures et en cliquant sur le bouton de boucle
                </li>
                <li>Basculer entre différents instruments (C, Eb ou Bb)</li>
            </ul>
        </section>

        <section class="info-section">
            <h2>Utilisation de la page OSMD</h2>
            <p>La page OSMD (OpenSheetMusicDisplay) offre une alternative pour visualiser les partitions, mieux adaptée
                aux écrans. Voici ce que vous pouvez faire :</p>
            <ul>
                <li>Zoomer ou dézoomer en utilisant les contrôles en haut de la page</li>
                <li>Changer la tonalité pour n'importe quel instrument</li>
            </ul>
        </section>
    </div>

</template>

<script>
import NavBar from '@/components/NavBar.vue';

export default {
    name: 'InfoView',
    components: {
        NavBar
    },

    data() {
        return {
            currentLanguage: 'pt'
        }
    },
}

</script>

<style scoped lang="scss">
.language-selector {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.language-selector img {
    width: 30px;
    height: auto;
    margin: 0 5px;
    cursor: pointer;
}

.info-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: 'Arial', sans-serif;
}

.info-section {
    margin-bottom: 5vh;
    background-color: #444444;
    color: #f0f0f0;
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }

    h2 {
        color: $secondary-text-color;
        margin-bottom: 1rem;
    }

    ul {
        padding-left: 1.5rem;
    }

    em {
        font-weight: 600;
    }
}
</style>
