// 애니메이션 유틸리티 함수들
export const animations = {
    // 요소가 화면에 보이는지 확인
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // 요소에 애니메이션 클래스 추가
    animateElement(element, animationClass, delay = 0) {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, delay);
    },

    // 스크롤 애니메이션 초기화
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animate;
                    const delay = element.dataset.delay || 0;
                    
                    this.animateElement(element, animation, delay);
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1
        });

        animatedElements.forEach(element => observer.observe(element));
    },

    // 페이지 전환 애니메이션
    async pageTransition(element, direction = 'forward') {
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
    },

    // 로딩 스피너 표시/숨김
    toggleLoading(element, show) {
        if (show) {
            element.innerHTML = '<div class="loading-spinner"></div>';
        } else {
            element.innerHTML = '';
        }
    },

    // 버튼 클릭 효과
    addButtonClickEffect(button) {
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
    },

    // 폼 입력 애니메이션
    initFormAnimations() {
        const inputs = document.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // 포커스 효과
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('input-focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('input-focused');
                if (input.value) {
                    input.parentElement.classList.add('input-filled');
                } else {
                    input.parentElement.classList.remove('input-filled');
                }
            });
            
            // 초기 상태 설정
            if (input.value) {
                input.parentElement.classList.add('input-filled');
            }
        });
    }
};

// 페이지 로드 시 스크롤 애니메이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    animations.initScrollAnimations();
    animations.initFormAnimations();
    
    // 모든 버튼에 클릭 효과 추가
    document.querySelectorAll('button').forEach(button => {
        animations.addButtonClickEffect(button);
    });
}); 