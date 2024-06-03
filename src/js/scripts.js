document.addEventListener('DOMContentLoaded', async() => {

    const urlGetBroths = 'https://api.tech.redventures.com.br/broths';
    const urlGetProteins = 'https://api.tech.redventures.com.br/proteins';
    const urlPlaceOrder = 'https://api.tech.redventures.com.br/orders';
    const key = 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf';

    let selectedBroth = null;
    let selectedProtein = null;

    async function fetchBroths() {
        try {
            const response = await fetch(urlGetBroths, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': key
                }
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar broths: ' + response.status);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    async function fetchProteins() {
        try {
            const response = await fetch(urlGetProteins, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': key
                }
            });
            if (!response.ok) {
                throw new Error('Erro ao buscar proteínas: ' + response.status);
            }
            return await response.json();
        } catch (error) {
            console.error('Erro:', error);
        }
    }

    function toggleActive(element, activeImage, inactiveImage, type) {
        const img = element.querySelector('img');
        const finishOrderButton = document.querySelector('#finishOrderButton');

        if (element.classList.contains('active')) {
            element.classList.remove('active');
            img.src = inactiveImage;
            if (type === 'broth') {
                selectedBroth = null;
            } else if (type === 'protein') {
                selectedProtein = null;
            }
        } else {
            if (type === 'broth') {
                if (selectedBroth) {
                    const prevSelected = document.querySelector('.broth.active');
                    if (prevSelected) {
                        prevSelected.classList.remove('active');
                        prevSelected.querySelector('img').src = prevSelected.dataset.inactiveImage;
                    }
                }
                selectedBroth = element;
            } else if (type === 'protein') {
                if (selectedProtein) {
                    const prevSelected = document.querySelector('.protein.active');
                    if (prevSelected) {
                        prevSelected.classList.remove('active');
                        prevSelected.querySelector('img').src = prevSelected.dataset.inactiveImage;
                    }
                }
                selectedProtein = element;
            }
            element.classList.add('active');
            img.src = activeImage;
        }

        if (selectedBroth) {
            finishOrderButton.classList.remove('b-desativado');
            finishOrderButton.classList.add('b-ativo');
            finishOrderButton.disabled = false;
        } else {
            finishOrderButton.classList.remove('b-ativo');
            finishOrderButton.classList.add('b-desativado');
            finishOrderButton.disabled = true;
        }
    }

    function displayBroths(broths) {
        const brothContainer = document.querySelector('.broths');
        if (!brothContainer) return;

        brothContainer.innerHTML = '';  // Clear existing items

        broths.forEach(broth => {
            const brothElement = document.createElement('div');
            brothElement.classList.add('broth');
            brothElement.innerHTML = `
                <img src="${broth.imageInactive}" alt="${broth.name}" class="broth-image" data-inactive-image="${broth.imageInactive}">
                <p>${broth.name}</p>
                <p>${broth.description}</p>
                <p class="price">US$ ${broth.price}</p>
            `;
            brothElement.dataset.inactiveImage = broth.imageInactive;
            brothElement.addEventListener('click', () => toggleActive(brothElement, broth.imageActive, broth.imageInactive, 'broth'));
            brothContainer.appendChild(brothElement);
        });
    }

    function displayProteins(proteins) {
        const proteinContainer = document.querySelector('.meats');
        if (!proteinContainer) return;

        proteinContainer.innerHTML = '';  // Clear existing items

        proteins.forEach(protein => {
            const proteinElement = document.createElement('div');
            proteinElement.classList.add('protein');
            proteinElement.innerHTML = `
                <img src="${protein.imageInactive}" alt="${protein.name}" class="protein-image" data-inactive-image="${protein.imageInactive}">
                <p>${protein.name}</p>
                <p>${protein.description}</p>
                <p class='price'>US$ ${protein.price}</p>
            `;
            proteinElement.dataset.inactiveImage = protein.imageInactive;
            proteinElement.addEventListener('click', () => toggleActive(proteinElement, protein.imageActive, protein.imageInactive, 'protein'));
            proteinContainer.appendChild(proteinElement);
        });
    }

    async function placeOrder() {
        if (!selectedBroth) {
            alert('Por favor, selecione um caldo para fazer seu pedido.');
            return;
        }

        const order = {
            brothId: selectedBroth.id,
            proteinId: selectedProtein ? selectedProtein.id : null
        };

        const statusElement = document.getElementById('status');
        statusElement.textContent = 'Enviando pedido...';

        try {
            const response = await fetch(urlPlaceOrder, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': key
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error('Erro ao realizar pedido: ' + response.status);
            }

            const result = await response.json();
            displayOrderConfirmation(result);

            statusElement.textContent = 'Pedido realizado com sucesso!';
        } catch (error) {
            console.error('Erro:', error);
            statusElement.textContent = 'Erro ao realizar pedido. Por favor, tente novamente.';
        }
    }

    function displayOrderConfirmation(order) {
        document.body.innerHTML = `
            <div class="order-confirmation">
                <h2>Your order is being prepared</h2>
                <p>Order details:</p>
                <p>Broth: ${order.broth}</p>
                <p>Protein: ${order.protein || 'No protein selected'}</p>
                <button onclick="location.reload()">PLACE NEW ORDER</button>
            </div>
        `;
    }

    const broths = await fetchBroths();
    if(broths) {
        displayBroths(broths)
    }

    const proteins = await fetchProteins();
    if(proteins) {
        displayProteins(proteins)
    }

    const finishOrderButton = document.getElementById('finishOrderButton');
    finishOrderButton.addEventListener('click', placeOrder);

})