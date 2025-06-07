export class Router {
    constructor() {
        this.routes = new Map();
        this.currentPage = null;
        this.pageContainer = document.getElementById('page-container');
        this.mainContent = document.getElementById('main-content');
        this.bottomNav = document.querySelector('.bottom-nav');
        this.init();
    }

    init() {
        this.registerRoutes();
        window.addEventListener('popstate', this.handleRoute.bind(this));
        document.addEventListener('click', this.handleClick.bind(this));
        this.handleRoute();
    }

    registerRoutes() {
        this.routes.set('/', {
            template: null,
            title: '홈',
            isHome: true
        });
        
        this.routes.set('/products', {
            template: 'pages/products/index.html',
            title: '보험상품'
        });
        
        this.routes.set('/consultation', {
            template: 'pages/consultation/index.html',
            title: '상담예약'
        });
        
        this.routes.set('/faq', {
            template: 'pages/faq/index.html',
            title: 'FAQ'
        });

        this.routes.set('404', {
            template: 'pages/404.html',
            title: '페이지를 찾을 수 없습니다'
        });
    }

    handleClick(event) {
        const link = event.target.closest('a');
        if (link && link.getAttribute('href').startsWith('/')) {
            event.preventDefault();
            this.navigate(link.getAttribute('href'));
        }
    }

    async handleRoute() {
        const path = window.location.pathname;
        const route = this.routes.get(path) || this.routes.get('404');
        
        try {
            if (this.currentPage) {
                await this.animatePageOut();
            }
            
            this.updateBottomNav(path);
            
            if (route.isHome) {
                if (this.pageContainer.querySelector('.page-content:not(#main-content)')) {
                    const mainContent = this.mainContent.cloneNode(true);
                    this.pageContainer.innerHTML = '';
                    this.pageContainer.appendChild(mainContent);
                    this.pageContainer.appendChild(this.bottomNav.cloneNode(true));
                    this.mainContent = document.getElementById('main-content');
                    this.bottomNav = document.querySelector('.bottom-nav');
                }
            } else {
                const response = await fetch(route.template);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const content = await response.text();
                
                const tempContainer = document.createElement('div');
                tempContainer.innerHTML = `
                    <main class="page-content">
                        ${content}
                    </main>
                `;
                
                while (this.pageContainer.firstChild) {
                    this.pageContainer.removeChild(this.pageContainer.firstChild);
                }
                
                this.pageContainer.appendChild(tempContainer.firstElementChild);
                this.pageContainer.appendChild(this.bottomNav.cloneNode(true));
                
                this.bottomNav = document.querySelector('.bottom-nav');
            }
            
            document.title = `${route.title} - 보험사이트`;
            
            await this.animatePageIn();
            
            this.currentPage = path;
            
            this.initializePage();
            
        } catch (error) {
            console.error('페이지 로드 실패:', error);
            this.handleError();
        }
    }

    updateBottomNav(path) {
        const navItems = document.querySelectorAll('.bottom-nav-item');
        navItems.forEach(item => {
            const itemPath = item.getAttribute('href');
            if (itemPath === path) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    async animatePageIn() {
        const page = this.pageContainer.querySelector('.page-content');
        if (page) {
            page.classList.add('page-enter');
            await new Promise(resolve => setTimeout(resolve, 50));
            page.classList.remove('page-enter');
            page.classList.add('page-enter-active');
            
            return new Promise(resolve => {
                page.addEventListener('transitionend', () => {
                    page.classList.remove('page-enter-active');
                    resolve();
                }, { once: true });
            });
        }
    }

    async animatePageOut() {
        const page = this.pageContainer.querySelector('.page-content');
        if (page) {
            page.classList.add('page-exit');
            page.classList.add('page-exit-active');
            
            return new Promise(resolve => {
                page.addEventListener('transitionend', () => {
                    resolve();
                }, { once: true });
            });
        }
    }

    initializePage() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        animatedElements.forEach(element => {
            const animation = element.dataset.animate;
            const delay = element.dataset.delay || 0;
            
            setTimeout(() => {
                element.classList.add(animation);
            }, delay);
        });

        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.parentElement.classList.add('input-focused');
                });
                
                input.addEventListener('blur', () => {
                    input.parentElement.classList.remove('input-focused');
                    if (input.value) {
                        input.parentElement.classList.add('input-filled');
                    }
                });
            });
        });

        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                
                ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
                ripple.style.left = e.clientX - rect.left - ripple.offsetWidth / 2 + 'px';
                ripple.style.top = e.clientY - rect.top - ripple.offsetHeight / 2 + 'px';
                
                ripple.classList.add('button-ripple');
                button.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    handleError() {
        const errorContent = `
            <div class="error-container animate-fade-in">
                <h2>페이지를 불러올 수 없습니다</h2>
                <p>잠시 후 다시 시도해주세요.</p>
                <button onclick="window.location.reload()" class="primary-button">
                    새로고침
                </button>
            </div>
        `;
        
        this.pageContainer.innerHTML = `
            <main class="page-content">
                ${errorContent}
            </main>
            ${this.bottomNav.outerHTML}
        `;
        
        this.bottomNav = document.querySelector('.bottom-nav');
    }

    navigate(path) {
        window.history.pushState(null, '', path);
        this.handleRoute();
    }
}

export const router = new Router(); 