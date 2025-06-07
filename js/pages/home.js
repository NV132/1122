import { showModal } from '../utils.js';

export default function initHomePage() {
    // 홈페이지 특화 기능 초기화
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = link.dataset.productId;
            showProductModal(productId);
        });
    });
}

function showProductModal(productId) {
    // 상품 상세 정보를 모달로 표시
    const modalContent = `
        <div class="product-modal">
            <h2>상품 상세 정보</h2>
            <div id="product-details-${productId}">
                로딩 중...
            </div>
        </div>
    `;
    showModal(modalContent);
    
    // 상품 정보 비동기 로드
    loadProductDetails(productId);
}

async function loadProductDetails(productId) {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
        
        const detailsContainer = document.getElementById(`product-details-${productId}`);
        detailsContainer.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <div class="product-features">
                ${product.features.map(feature => `
                    <div class="feature">
                        <strong>${feature.title}</strong>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('상품 정보 로딩 실패:', error);
    }
} 