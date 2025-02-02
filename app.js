document.addEventListener('DOMContentLoaded', function() {
    const itemInput = document.getElementById('itemInput');
    const imageInput = document.getElementById('imageInput');
    const addButton = document.getElementById('addButton');
    const shoppingList = document.getElementById('shoppingList');
    const printButton = document.getElementById('printButton');
    const themeButtons = document.querySelectorAll('.theme-btn');

    // Gestion des thèmes
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Enlever tous les thèmes existants
            document.body.className = '';
            // Ajouter le nouveau thème si ce n'est pas le thème blanc (par défaut)
            if (button.dataset.theme !== 'white') {
                document.body.classList.add(button.dataset.theme);
            }
        });
    });

    // Ajouter un item à la liste
    function addItem() {
        const text = itemInput.value.trim();
        if (text === '') return;

        const li = document.createElement('li');
        li.className = 'list-item';

        // Créer l'image si une image a été sélectionnée
        if (imageInput.files && imageInput.files[0]) {
            const img = document.createElement('img');
            img.className = 'item-image';
            img.src = URL.createObjectURL(imageInput.files[0]);
            li.appendChild(img);
        }

        // Créer le champ de texte éditable
        const input = document.createElement('input');
        input.type = 'text';
        input.value = text;
        input.className = 'item-text';
        input.readOnly = true;
        
        // Permettre l'édition en double-cliquant
        input.addEventListener('dblclick', () => {
            input.readOnly = false;
            input.focus();
        });
        
        // Désactiver l'édition quand on perd le focus
        input.addEventListener('blur', () => {
            input.readOnly = true;
        });

        // Créer le bouton de suppression
        const removeButton = document.createElement('button');
        removeButton.textContent = '-';
        removeButton.className = 'remove-btn';
        removeButton.onclick = function() {
            li.remove();
        };

        li.appendChild(input);
        li.appendChild(removeButton);
        shoppingList.appendChild(li);

        // Réinitialiser les champs
        itemInput.value = '';
        imageInput.value = '';
    }

    // Ajouter un item quand on clique sur le bouton
    addButton.onclick = addItem;

    // Ajouter un item quand on appuie sur Entrée
    itemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addItem();
        }
    });

    // Générer et télécharger le PDF
    printButton.onclick = function() {
        const element = document.querySelector('.container');
        const opt = {
            margin: 1,
            filename: 'ma-liste-achats.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };
});
