export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatNumber = (number) => {
    return number.toLocaleString('ko-KR');
};

export const showModal = (content) => {
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
};

export const validateForm = (formData) => {
    const errors = {};
    
    for (const [key, value] of formData.entries()) {
        if (!value.trim()) {
            errors[key] = '필수 입력 항목입니다.';
        }
    }
    
    return errors;
};

export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// 다크 모드 관리
export function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    // 저장된 테마 설정 불러오기
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // 테마 토글 버튼 이벤트
    themeToggle?.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // 아이콘 업데이트
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
    
    // 시스템 테마 변경 감지
    prefersDark.addListener((e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// 모달 표시 함수
export function showModal(content, options = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.innerHTML = content;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // 모달 닫기
    const closeModal = () => {
        modal.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(modal);
            options.onClose?.();
        }, 300);
    };
    
    // 배경 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // 모달 표시 애니메이션
    requestAnimationFrame(() => {
        modal.classList.add('show');
    });
    
    return {
        close: closeModal
    };
}

// 날짜 포맷팅
export function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

// 숫자 포맷팅
export function formatNumber(number, options = {}) {
    const {
        style = 'decimal',
        minimumFractionDigits = 0,
        maximumFractionDigits = 0,
        currency = 'KRW'
    } = options;
    
    return new Intl.NumberFormat('ko-KR', {
        style,
        minimumFractionDigits,
        maximumFractionDigits,
        currency
    }).format(number);
}

// 전화번호 포맷팅
export function formatPhoneNumber(number) {
    const cleaned = number.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3,4})(\d{4})$/);
    if (match) {
        return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return number;
}

// 유효성 검사
export const validators = {
    required: value => !!value || '필수 입력 항목입니다.',
    email: value => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value) || '올바른 이메일 주소를 입력해주세요.';
    },
    phone: value => {
        const pattern = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
        return pattern.test(value) || '올바른 전화번호를 입력해주세요.';
    },
    minLength: (value, length) => 
        value.length >= length || `${length}자 이상 입력해주세요.`,
    maxLength: (value, length) => 
        value.length <= length || `${length}자 이하로 입력해주세요.`
};

// API 요청 헬퍼
export async function fetchAPI(endpoint, options = {}) {
    const baseURL = '/api';
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    try {
        const response = await fetch(`${baseURL}${endpoint}`, {
            ...defaultOptions,
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API 요청 실패:', error);
        throw error;
    }
}

// 로컬 스토리지 헬퍼
export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('로컬 스토리지 읽기 실패:', error);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('로컬 스토리지 쓰기 실패:', error);
            return false;
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('로컬 스토리지 삭제 실패:', error);
            return false;
        }
    }
};

// 스크롤 애니메이션
export function scrollToElement(element, options = {}) {
    const {
        offset = 0,
        behavior = 'smooth'
    } = options;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior
    });
}

// 이미지 지연 로딩
export function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 접근성 포커스 관리
export function initFocusManagement() {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusable = document.querySelectorAll(focusableElements);
            const firstFocusable = focusable[0];
            const lastFocusable = focusable[focusable.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
} 