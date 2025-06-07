import { Router } from './router.js';
import { routes } from './routes.js';
import { navigation } from './components/navigation.js';
import * as utils from './utils.js';
import { 
    initThemeToggle, 
    initLazyLoading, 
    initFocusManagement,
    storage
} from './utils.js';
import { initRouter } from './router.js';

// Router 인스턴스 생성
const router = new Router(routes);

// 전역 스코프에 유틸리티 함수 노출
window.utils = utils;

// 페이지별 JavaScript 모듈 동적 로드
const loadPageScript = async (path) => {
    const scriptPath = `/js/pages${path}.js`;
    try {
        const module = await import(scriptPath);
        if (module.default && typeof module.default === 'function') {
            module.default();
        }
    } catch (error) {
        // 페이지별 스크립트가 없는 경우 무시
        console.debug(`No page script found for ${scriptPath}`);
    }
};

// 라우트 변경 시 페이지 스크립트 로드
router.onRouteChange = (path) => {
    loadPageScript(path);
};

// Router 구현
class Router {
    constructor(routes) {
        this.routes = routes;
        this.mainContent = document.getElementById('main-content');
        
        // 페이지 로드 시 현재 경로에 맞는 페이지 렌더링
        window.addEventListener('load', () => this.handleRoute());
        
        // 브라우저 뒤로가기/앞으로가기 처리
        window.addEventListener('popstate', () => this.handleRoute());
        
        // 링크 클릭 이벤트 위임
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="/"]')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                this.navigate(href);
            }
        });
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes[path] || this.routes['/404'];
        
        try {
            const content = await route();
            this.mainContent.innerHTML = content;
            // 페이지 전환 후 스크롤을 맨 위로
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('페이지 로딩 중 오류 발생:', error);
            this.mainContent.innerHTML = '<h1>페이지를 불러오는 중 오류가 발생했습니다.</h1>';
        }
    }

    navigate(path) {
        window.history.pushState(null, null, path);
        this.handleRoute();
    }
}

// 공통 유틸리티 함수들
const utils = {
    // 날짜 포맷팅
    formatDate(date) {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    // 숫자 포맷팅 (천 단위 콤마)
    formatNumber(number) {
        return number.toLocaleString('ko-KR');
    },

    // 모달 표시
    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                ${content}
            </div>
        `;
        document.body.appendChild(modal);
        
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
    }
};

// 개발자 모드 설정
const isDevMode = () => {
    // URL 파라미터로 개발자 모드 확인
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('dev') === 'true';
};

// 개발자 모드 UI 초기화
const initDevTools = () => {
    if (!isDevMode()) return;

    // 개발자 모드 UI 생성
    const devTools = document.createElement('div');
    devTools.className = 'dev-tools';
    devTools.innerHTML = `
        <div class="dev-tools-header">
            <h3>개발자 도구</h3>
            <button class="dev-tools-toggle">접기/펼치기</button>
        </div>
        <div class="dev-tools-content">
            <div class="dev-section">
                <h4>앱 상태</h4>
                <div id="dev-app-state"></div>
            </div>
            <div class="dev-section">
                <h4>라우트 정보</h4>
                <div id="dev-route-info"></div>
            </div>
            <div class="dev-section">
                <h4>테마 설정</h4>
                <div id="dev-theme-info"></div>
            </div>
            <div class="dev-section">
                <h4>스토리지</h4>
                <div id="dev-storage-info"></div>
            </div>
        </div>
    `;

    // 개발자 도구 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .dev-tools {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background: var(--theme-surface);
            border: 1px solid var(--theme-border);
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            font-family: monospace;
            font-size: 12px;
        }
        .dev-tools-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            background: var(--theme-primary);
            color: white;
            border-radius: 8px 8px 0 0;
        }
        .dev-tools-header h3 {
            margin: 0;
            font-size: 14px;
        }
        .dev-tools-toggle {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px 8px;
        }
        .dev-tools-content {
            padding: 8px;
            max-height: 400px;
            overflow-y: auto;
        }
        .dev-section {
            margin-bottom: 12px;
        }
        .dev-section h4 {
            margin: 0 0 4px 0;
            font-size: 12px;
            color: var(--theme-primary);
        }
        .dev-section pre {
            margin: 0;
            padding: 8px;
            background: var(--theme-background);
            border-radius: 4px;
            overflow-x: auto;
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(devTools);

    // 개발자 도구 토글 기능
    const toggleBtn = devTools.querySelector('.dev-tools-toggle');
    const content = devTools.querySelector('.dev-tools-content');
    toggleBtn.addEventListener('click', () => {
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });

    // 상태 업데이트 함수
    const updateDevTools = () => {
        const appState = document.getElementById('dev-app-state');
        const routeInfo = document.getElementById('dev-route-info');
        const themeInfo = document.getElementById('dev-theme-info');
        const storageInfo = document.getElementById('dev-storage-info');

        // 앱 상태 업데이트
        appState.innerHTML = `<pre>${JSON.stringify({
            currentPath: window.location.pathname,
            theme: document.documentElement.getAttribute('data-theme'),
            timestamp: new Date().toISOString()
        }, null, 2)}</pre>`;

        // 라우트 정보 업데이트
        routeInfo.innerHTML = `<pre>${JSON.stringify({
            availableRoutes: Object.keys(routes),
            currentRoute: window.location.pathname
        }, null, 2)}</pre>`;

        // 테마 정보 업데이트
        themeInfo.innerHTML = `<pre>${JSON.stringify({
            currentTheme: document.documentElement.getAttribute('data-theme'),
            systemTheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }, null, 2)}</pre>`;

        // 스토리지 정보 업데이트
        const storageData = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            try {
                storageData[key] = JSON.parse(localStorage.getItem(key));
            } catch {
                storageData[key] = localStorage.getItem(key);
            }
        }
        storageInfo.innerHTML = `<pre>${JSON.stringify(storageData, null, 2)}</pre>`;
    };

    // 주기적으로 상태 업데이트
    setInterval(updateDevTools, 1000);
    updateDevTools();

    // 전역 객체에 개발자 도구 노출
    window.devTools = {
        update: updateDevTools,
        isDevMode: true
    };
};

// 앱 초기화
async function initApp() {
    try {
        // 개발자 모드 초기화
        initDevTools();
        
        // 테마 초기화
        initThemeToggle();
        
        // 이미지 지연 로딩 초기화
        initLazyLoading();
        
        // 접근성 포커스 관리 초기화
        initFocusManagement();
        
        // 라우터 초기화
        const router = new Router(routes);
        
        // 다크 모드 토글 버튼 추가
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', '테마 변경');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        document.body.appendChild(themeToggle);
        
        // 저장된 테마 적용
        const savedTheme = storage.get('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const icon = themeToggle.querySelector('i');
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // 현재 경로에 맞는 페이지 로드
        await router.handleRoute();

    } catch (error) {
        console.error('앱 초기화 실패:', error);
        document.getElementById('main-content').innerHTML = `
            <div class="error-page">
                <h1>오류가 발생했습니다</h1>
                <p>앱을 초기화하는 중 문제가 발생했습니다. 페이지를 새로고침해주세요.</p>
                <button onclick="window.location.reload()" class="btn btn-primary">
                    새로고침
                </button>
            </div>
        `;
    }
}

// 앱 시작
initApp();

// 전역 객체에 앱 상태 노출
window.app = {
    storage,
    theme: document.documentElement.getAttribute('data-theme'),
    navigation,
    isDevMode: isDevMode()
}; 