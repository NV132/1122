import { showModal, debounce } from '../utils.js';
import { productsData } from '../data/productsData.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS (Animate On Scroll library)
    // Check if AOS is defined before initializing
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800, // values from 0 to 3000, with step 50ms
            once: true, // whether animation should happen only once - while scrolling down
        });
    }

    const productListContainer = document.getElementById('product-list');
    const categoryButtonsContainer = document.querySelector('.product-categories .category-buttons');
    const searchInput = document.getElementById('product-search');
    const productModalElement = document.getElementById('product-modal');
    const productModal = productModalElement ? new bootstrap.Modal(productModalElement) : null;
    const modalTitle = document.getElementById('productModalLabel');
    const modalBody = document.getElementById('product-modal-body');

    // Group products by category for display and filtering
    const categorizedProducts = {
        'all': {
            title: '전체보기',
            products: Object.keys(productsData)
        },
        'life': {
            title: '생명보험',
            products: Object.keys(productsData).filter(key => key.startsWith('life'))
        },
        'health': {
            title: '건강/질병보험',
            products: Object.keys(productsData).filter(key => key.startsWith('health'))
        },
        'car': {
            title: '자동차보험',
            products: Object.keys(productsData).filter(key => key.startsWith('car'))
        },
        'property': {
            title: '재산보험',
            products: Object.keys(productsData).filter(key => key.startsWith('property'))
        }
    };

    // Function to render products based on provided keys
    function renderProducts(productKeys) {
        productListContainer.innerHTML = ''; // Clear current list
        if (productKeys.length === 0) {
            productListContainer.innerHTML = '<p>해당 카테고리에 해당하는 상품이 없습니다.</p>';
            return;
        }
        productKeys.forEach(key => {
            const product = productsData[key];
            if (product) {
                // Use the structure from the user-provided diff
                const productCardHTML = `
                    <div class="col-md-4 col-sm-6 product-card" data-aos="fade-up" data-category="${key.split('-')[0]}" data-product-key="${key}">
                        <div class="card mb-4 shadow-sm">
                            <div class="card-body">
                                <h5 class="card-title">${product.title}</h5>
                                <ul class="features-list">
                                    ${product.features.map(feature => `<li>${feature}</li>`).join('')}
                                </ul>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="btn-group">
                                        <button type="button" class="btn btn-sm btn-outline-secondary view-details-btn" data-product-key="${key}">자세히 보기</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productListContainer.innerHTML += productCardHTML;
            }
        });
        // Re-initialize AOS after adding new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    // Function to filter products by category
    function filterProducts(categoryKey) {
        const productKeys = categorizedProducts[categoryKey]?.products || [];
        renderProducts(productKeys);
        // Update active button visual state
        document.querySelectorAll('.category-button').forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-category-key') === categoryKey) {
                button.classList.add('active');
            }
        });
    }

    // Function to handle search input (with basic debounce if needed, but simple filter for now)
    function handleSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const allProductKeys = Object.keys(productsData);
        const filteredKeys = allProductKeys.filter(key => {
            const product = productsData[key];
            return product.title.toLowerCase().includes(searchTerm) ||
                   product.features.some(feature => feature.toLowerCase().includes(searchTerm));
        });
        renderProducts(filteredKeys);
    }

    // Function to get detailed product information for modal
    function getProductDetailsHTML(productKey) {
        const product = productsData[productKey];
        if (!product) return '<p>상품 정보를 찾을 수 없습니다.</p>';

        let html = `
            <h5>특징</h5>
            <ul>
                ${product.features.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <h5>보장 내용</h5>
            <ul>
                ${product.coverage.map(item => `<li><strong>${item.title}:</strong> ${item.description}</li>`).join('')}
            </ul>
            <h5>부가 혜택</h5>
            <ul>
                 ${product.benefits.map(item => `<li>${item}</li>`).join('')}
            </ul>
            ${product.image ? `<img src="${product.image}" alt="${product.title}" class="img-fluid mt-3"/>` : ''}
        `;
        return html;
    }

    // Event listeners for category buttons
    if (categoryButtonsContainer) {
        // Ensure buttons are added only once
        if (categoryButtonsContainer.children.length === 0) {
             Object.keys(categorizedProducts).forEach(key => {
                const button = document.createElement('button');
                button.classList.add('btn', 'btn-outline-primary', 'category-button');
                if (key === 'all') button.classList.add('active'); // Default active
                button.setAttribute('data-category-key', key);
                // Assuming the icon is removed as per previous request, only text is used now
                button.innerHTML = `<span>${categorizedProducts[key].title}</span>`;
                button.addEventListener('click', () => {
                    filterProducts(key);
                    if (searchInput) searchInput.value = ''; // Clear search on category change
                });
                categoryButtonsContainer.appendChild(button);
            });
        }

    }

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Event listener for "자세히 보기" buttons (using event delegation on productListContainer)
    if (productListContainer && modalTitle && modalBody && productModal) {
        productListContainer.addEventListener('click', (event) => {
            // Traverse up from the clicked element to find the button or a parent with data-product-key
            const viewDetailsBtn = event.target.closest('.view-details-btn');
            if (viewDetailsBtn) {
                const productKey = viewDetailsBtn.getAttribute('data-product-key');
                if (productKey && productsData[productKey]) {
                     const product = productsData[productKey];
                     modalTitle.textContent = product.title;
                     modalBody.innerHTML = getProductDetailsHTML(productKey);
                     productModal.show();
                }
            }
        });
    }

    // Initial render of all products
    if (productListContainer) {
         renderProducts(categorizedProducts.all.products);
    }

    // Optional: Handle sticky category bar scroll behavior here if needed later
    // ... (This part will be added after confirming basic functionality)

    // 상품 상세 모달
    const productDetailTemplate = document.getElementById('productDetailModal');
    const quickConsultButtons = document.querySelectorAll('.quick-consult');

    quickConsultButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productId = button.dataset.productId;
            try {
                const response = await fetch(`/api/products/${productId}`);
                const product = await response.json();
                showProductDetailModal(product);
            } catch (error) {
                console.error('상품 정보 로딩 실패:', error);
                showModal('<p>상품 정보를 불러오는데 실패했습니다.</p>');
            }
        });
    });

    function showProductDetailModal(product) {
        const modalContent = productDetailTemplate.content.cloneNode(true);
        
        // 상품 정보 채우기
        modalContent.querySelector('.product-title').textContent = product.name;
        modalContent.querySelector('.product-detail-image img').src = product.image;
        modalContent.querySelector('.product-detail-image img').alt = product.name;
        modalContent.querySelector('.product-description').textContent = product.description;
        
        // 보장 내용 채우기
        const coverageList = modalContent.querySelector('.coverage-list');
        product.coverage.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            coverageList.appendChild(li);
        });

        // 보험료 계산기 이벤트
        const calculateButton = modalContent.querySelector('.calculate-premium');
        const premiumResult = modalContent.querySelector('.premium-result');
        
        calculateButton.addEventListener('click', () => {
            const age = modalContent.querySelector('#age').value;
            const gender = modalContent.querySelector('#gender').value;
            
            if (!age) {
                premiumResult.textContent = '나이를 입력해주세요.';
                return;
            }

            // 보험료 계산 로직 (실제로는 API 호출)
            const premium = calculatePremium(product, age, gender);
            premiumResult.textContent = `월 보험료: ${premium.toLocaleString()}원`;
        });

        // 상담 신청 버튼 이벤트
        const applyButton = modalContent.querySelector('.apply-product');
        applyButton.addEventListener('click', () => {
            window.location.href = `/consultation?product=${product.id}`;
        });

        // 모달 표시
        showModal(modalContent);
    }

    // 보험료 계산 함수 (예시)
    function calculatePremium(product, age, gender) {
        // 실제로는 복잡한 계산 로직이 들어가야 함
        const basePremium = 50000;
        const ageFactor = age < 30 ? 0.8 : age < 50 ? 1 : 1.5;
        const genderFactor = gender === 'female' ? 0.9 : 1;
        
        return Math.round(basePremium * ageFactor * genderFactor);
    }
}); 