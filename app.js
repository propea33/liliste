document.addEventListener('DOMContentLoaded', function() {
    const itemInput = document.getElementById('itemInput');
    const imageInput = document.getElementById('imageInput');
    const addButton = document.getElementById('addButton');
    const shoppingList = document.getElementById('shoppingList');
    const printButton = document.getElementById('printButton');
    const themeButtons = document.querySelectorAll('.theme-btn');
    const uploadBtn = document.querySelector('.upload-btn');

    // Mettre à jour le texte du bouton quand une image est sélectionnée
    imageInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            uploadBtn.textContent = '✅ image';
            // Réinitialiser le texte après 2 secondes
            setTimeout(() => {
                uploadBtn.innerHTML = 'image 🖼️';
            }, 2000);
        }
    });

    // Gestion des thèmes - Version corrigée
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            document.documentElement.className = ''; // Réinitialiser les thèmes
            if (theme !== 'white') {
                document.documentElement.classList.add(`${theme}-theme`);
            }
            // Sauvegarder le thème dans le localStorage
            localStorage.setItem('currentTheme', theme);
        });
    });

    // Charger le thème sauvegardé au chargement de la page
    const savedTheme = localStorage.getItem('currentTheme');
    if (savedTheme && savedTheme !== 'white') {
        document.documentElement.classList.add(`${savedTheme}-theme`);
    }

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

    // Générer et télécharger le PDF - Version corrigée
    printButton.onclick = function() {
        // Créer une copie temporaire de la liste pour le PDF
        const tempDiv = document.createElement('div');
        tempDiv.style.width = '100%';
        tempDiv.style.padding = '20px';
        tempDiv.style.boxSizing = 'border-box';

        // Ajouter un titre au PDF
        const title = document.createElement('h2');
        title.textContent = 'Ma Liste d\'Achats';
        title.style.textAlign = 'center';
        title.style.marginBottom = '20px';
        title.style.fontFamily = 'Comic Sans MS, cursive';
        tempDiv.appendChild(title);

        // Copier uniquement la liste
        const listClone = shoppingList.cloneNode(true);
        
        // Supprimer les boutons de suppression de la copie
        listClone.querySelectorAll('.remove-btn').forEach(btn => btn.remove());
        
        // Rendre les champs de texte non éditables dans le PDF
        listClone.querySelectorAll('.item-text').forEach(input => {
            const text = document.createElement('span');
            text.textContent = input.value;
            text.style.fontSize = '14px';
            text.style.fontFamily = 'Comic Sans MS, cursive';
            input.parentNode.replaceChild(text, input);
        });

        tempDiv.appendChild(listClone);

        // Options pour le PDF
        const opt = {
            margin: 1,
            filename: 'ma-liste-achats.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Générer le PDF avec le contenu temporaire
        html2pdf().set(opt).from(tempDiv).save();
    };
});
