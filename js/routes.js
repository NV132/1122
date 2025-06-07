// 페이지 컴포넌트 동적 임포트
const loadPage = async (path) => {
    try {
        const module = await import(`./pages${path}/index.js`);
        return module.default;
    } catch (error) {
        console.error(`페이지 로드 실패: ${path}`, error);
        return () => '<h1>페이지를 찾을 수 없습니다.</h1>';
    }
};

// 라우트 설정
export const routes = {
    // 홈페이지
    '/': async () => {
        const HomePage = await loadPage('/home');
        return HomePage();
    },

    // 보험상품 페이지
    '/products': async () => {
        const ProductsPage = await loadPage('/products');
        return ProductsPage();
    },

    // 상담예약 페이지
    '/consultation': async () => {
        const ConsultationPage = await loadPage('/consultation');
        return ConsultationPage();
    },

    // FAQ 페이지
    '/faq': async () => {
        const FaqPage = await loadPage('/faq');
        return FaqPage();
    },

    // 이용약관 페이지
    '/terms': async () => {
        const TermsPage = await loadPage('/terms');
        return TermsPage();
    },

    // 개인정보처리방침 페이지
    '/privacy': async () => {
        const PrivacyPage = await loadPage('/privacy');
        return PrivacyPage();
    },

    // 404 페이지
    '/404': async () => {
        return `
            <div class="error-page">
                <h1>404</h1>
                <p>페이지를 찾을 수 없습니다.</p>
                <a href="/" class="btn btn-primary">홈으로 돌아가기</a>
            </div>
        `;
    }
}; 