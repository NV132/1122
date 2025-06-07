// 네비게이션 상태 관리
export class Navigation {
    constructor() {
        this.currentPath = window.location.pathname;
        this.initNavigation();
    }

    // 네비게이션 초기화
    initNavigation() {
        // 상단 네비게이션
        this.initTopNav();
        // 하단 탭 네비게이션
        this.initBottomNav();
        // 모바일 메뉴 토글
        this.initMobileMenu();
    }

    // 상단 네비게이션 초기화
    initTopNav() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const path = link.getAttribute('href');
                this.navigate(path);
            });
        });
    }

    // 하단 탭 네비게이션 초기화
    initBottomNav() {
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const path = item.getAttribute('href');
                this.navigate(path);
            });
        });
    }

    // 모바일 메뉴 토글 초기화
    initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const mobileNavLinks = document.querySelector('.nav-links');

        if (navToggle && mobileNavLinks) {
            navToggle.addEventListener('click', () => {
                mobileNavLinks.classList.toggle('show');
                navToggle.setAttribute('aria-expanded', 
                    mobileNavLinks.classList.contains('show'));
            });

            // 모바일 메뉴 외부 클릭 시 닫기
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !mobileNavLinks.contains(e.target)) {
                    mobileNavLinks.classList.remove('show');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // 페이지 이동
    navigate(path) {
        // 현재 경로와 동일한 경우 무시
        if (path === this.currentPath) return;

        // 네비게이션 상태 업데이트
        this.updateNavigationState(path);

        // 라우터를 통한 페이지 이동
        window.history.pushState(null, null, path);
        window.dispatchEvent(new PopStateEvent('popstate'));
    }

    // 네비게이션 상태 업데이트
    updateNavigationState(path) {
        this.currentPath = path;

        // 상단 네비게이션 업데이트
        const topNavLinks = document.querySelectorAll('.nav-link');
        topNavLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === path);
        });

        // 하단 탭 네비게이션 업데이트
        const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
        bottomNavItems.forEach(item => {
            item.classList.toggle('active', item.getAttribute('href') === path);
        });

        // 모바일 메뉴 닫기
        const mobileNavLinks = document.querySelector('.nav-links');
        if (mobileNavLinks) {
            mobileNavLinks.classList.remove('show');
        }
    }
}

// 네비게이션 인스턴스 생성 및 내보내기
export const navigation = new Navigation();

// 네비게이션 바 제어 클래스
export class NavigationController {
    constructor() {
        this.navContainer = document.querySelector('.nav-container');
        this.navItems = document.querySelectorAll('.nav-item');
        this.lastScrollTop = 0;
        this.scrollThreshold = 10;
        this.isScrolling = false;
        this.scrollTimeout = null;
        
        this.init();
    }
    
    init() {
        // 스크롤 이벤트 리스너
        window.addEventListener('scroll', this.handleScroll.bind(this));
        
        // 네비게이션 아이템 클릭 이벤트
        this.navItems.forEach(item => {
            item.addEventListener('click', this.handleNavClick.bind(this));
        });
        
        // 터치 이벤트 처리
        this.initTouchEvents();
        
        // 초기 활성 상태 설정
        this.setActiveNavItem();
    }
    
    // 스크롤 처리
    handleScroll() {
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
        
        this.scrollTimeout = setTimeout(() => {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            
            // 스크롤 방향 감지
            if (Math.abs(currentScroll - this.lastScrollTop) > this.scrollThreshold) {
                if (currentScroll > this.lastScrollTop && currentScroll > 100) {
                    // 아래로 스크롤
                    this.navContainer.classList.add('scroll-down');
                    this.navContainer.classList.remove('scroll-up');
                } else {
                    // 위로 스크롤
                    this.navContainer.classList.add('scroll-up');
                    this.navContainer.classList.remove('scroll-down');
                }
                
                this.lastScrollTop = currentScroll;
            }
        }, 100);
    }
    
    // 네비게이션 아이템 클릭 처리
    handleNavClick(event) {
        const target = event.currentTarget;
        const href = target.getAttribute('href');
        
        if (href && href.startsWith('#')) {
            event.preventDefault();
            
            // 클릭 애니메이션
            target.classList.add('nav-click');
            setTimeout(() => target.classList.remove('nav-click'), 200);
            
            // 페이지 전환
            this.navigateTo(href);
        }
    }
    
    // 페이지 전환
    async navigateTo(href) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            // 네비게이션 바 숨기기
            this.navContainer.classList.add('hidden');
            
            // 페이지 전환 애니메이션
            await this.pageTransition(targetElement);
            
            // 활성 상태 업데이트
            this.setActiveNavItem(href);
            
            // 네비게이션 바 표시
            this.navContainer.classList.remove('hidden');
        }
    }
    
    // 페이지 전환 애니메이션
    async pageTransition(element) {
        element.classList.add('page-enter');
        await new Promise(resolve => setTimeout(resolve, 50));
        element.classList.remove('page-enter');
        element.classList.add('page-enter-active');
        
        return new Promise(resolve => {
            element.addEventListener('transitionend', () => {
                element.classList.remove('page-enter-active');
                resolve();
            }, { once: true });
        });
    }
    
    // 활성 네비게이션 아이템 설정
    setActiveNavItem(href = window.location.hash) {
        this.navItems.forEach(item => {
            if (item.getAttribute('href') === href) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // 터치 이벤트 초기화
    initTouchEvents() {
        let touchStartY = 0;
        let touchEndY = 0;
        
        this.navContainer.addEventListener('touchstart', e => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        this.navContainer.addEventListener('touchmove', e => {
            touchEndY = e.touches[0].clientY;
            const touchDiff = touchStartY - touchEndY;
            
            // 스와이프 감지
            if (Math.abs(touchDiff) > 50) {
                if (touchDiff > 0) {
                    // 위로 스와이프
                    this.navContainer.classList.add('scroll-up');
                    this.navContainer.classList.remove('scroll-down');
                } else {
                    // 아래로 스와이프
                    this.navContainer.classList.add('scroll-down');
                    this.navContainer.classList.remove('scroll-up');
                }
            }
        }, { passive: true });
    }
    
    // 배지 업데이트
    updateBadge(itemId, count) {
        const navItem = document.querySelector(`[href="#${itemId}"]`);
        if (navItem) {
            let badge = navItem.querySelector('.nav-badge');
            
            if (count > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'nav-badge';
                    navItem.appendChild(badge);
                }
                
                badge.textContent = count;
                badge.classList.add('visible');
            } else if (badge) {
                badge.classList.remove('visible');
                setTimeout(() => badge.remove(), 300);
            }
        }
    }
}

// 페이지 로드 시 네비게이션 컨트롤러 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
}); 