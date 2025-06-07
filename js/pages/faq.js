import { debounce } from '../utils.js';

export default function initFaqPage() {
    const faqItems = document.querySelectorAll('.faq-item');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const faqGroups = document.querySelectorAll('.faq-group');
    const searchInput = document.getElementById('faqSearch');

    // FAQ 아코디언 기능
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 다른 모든 FAQ 닫기
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });

            // 현재 FAQ 토글
            item.classList.toggle('active');

            // 스크롤 애니메이션 (모바일에서 답변이 잘리지 않도록)
            if (!isActive) {
                const rect = item.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const targetPosition = rect.top + scrollTop - 100; // 상단 여백 100px

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 카테고리 필터링
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 활성 탭 변경
            categoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const category = tab.dataset.category;
            
            // FAQ 그룹 필터링
            faqGroups.forEach(group => {
                if (category === 'all' || group.dataset.category === category) {
                    group.style.display = 'block';
                } else {
                    group.style.display = 'none';
                }
            });

            // 검색어가 있는 경우 검색 결과 유지
            if (searchInput.value.trim()) {
                searchFaqs(searchInput.value);
            }
        });
    });

    // FAQ 검색 기능
    const searchFaqs = debounce((searchTerm) => {
        const searchTermLower = searchTerm.toLowerCase();
        let hasResults = false;

        // 모든 FAQ 그룹 순회
        faqGroups.forEach(group => {
            const questions = group.querySelectorAll('.faq-question span');
            const answers = group.querySelectorAll('.faq-answer');
            let groupHasResults = false;

            // 각 FAQ 항목 검색
            questions.forEach((question, index) => {
                const answer = answers[index];
                const questionText = question.textContent.toLowerCase();
                const answerText = answer.textContent.toLowerCase();
                const isMatch = questionText.includes(searchTermLower) || 
                              answerText.includes(searchTermLower);

                // 검색어 하이라이트
                if (isMatch) {
                    groupHasResults = true;
                    hasResults = true;

                    // 질문 하이라이트
                    const highlightedQuestion = questionText.replace(
                        new RegExp(searchTermLower, 'gi'),
                        match => `<span class="highlight">${match}</span>`
                    );
                    question.innerHTML = highlightedQuestion;

                    // 답변 하이라이트
                    const highlightedAnswer = answerText.replace(
                        new RegExp(searchTermLower, 'gi'),
                        match => `<span class="highlight">${match}</span>`
                    );
                    answer.innerHTML = highlightedAnswer;

                    // FAQ 항목 표시
                    const faqItem = question.closest('.faq-item');
                    faqItem.style.display = 'block';
                    faqItem.classList.add('active');
                } else {
                    // 검색어가 없는 경우 원래 텍스트로 복원
                    question.textContent = question.textContent;
                    answer.textContent = answer.textContent;

                    // FAQ 항목 숨김
                    const faqItem = question.closest('.faq-item');
                    faqItem.style.display = 'none';
                    faqItem.classList.remove('active');
                }
            });

            // 그룹 표시/숨김
            group.style.display = groupHasResults ? 'block' : 'none';
        });

        // 검색 결과가 없는 경우 메시지 표시
        const noResultsMessage = document.querySelector('.no-results-message');
        if (!hasResults) {
            if (!noResultsMessage) {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <p>검색 결과가 없습니다.</p>
                    <p>다른 검색어를 입력하시거나 카테고리를 선택해주세요.</p>
                `;
                document.querySelector('.faq-container').appendChild(message);
            }
        } else if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }, 300);

    // 검색 입력 이벤트
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm) {
            searchFaqs(searchTerm);
        } else {
            // 검색어가 없는 경우 모든 FAQ 표시
            faqGroups.forEach(group => {
                group.style.display = 'block';
                const faqItems = group.querySelectorAll('.faq-item');
                faqItems.forEach(item => {
                    item.style.display = 'block';
                    item.classList.remove('active');
                });
            });

            // 검색 결과 메시지 제거
            const noResultsMessage = document.querySelector('.no-results-message');
            if (noResultsMessage) {
                noResultsMessage.remove();
            }

            // 원래 텍스트로 복원
            document.querySelectorAll('.faq-question span, .faq-answer').forEach(element => {
                element.textContent = element.textContent;
            });
        }
    });

    // URL 해시에 따른 FAQ 자동 열기
    const hash = window.location.hash;
    if (hash) {
        const targetQuestion = document.querySelector(hash);
        if (targetQuestion) {
            const faqItem = targetQuestion.closest('.faq-item');
            if (faqItem) {
                // 해당 카테고리 탭 활성화
                const category = faqItem.closest('.faq-group').dataset.category;
                const categoryTab = document.querySelector(`.category-tab[data-category="${category}"]`);
                if (categoryTab) {
                    categoryTab.click();
                }

                // FAQ 열기
                setTimeout(() => {
                    faqItem.classList.add('active');
                    targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        }
    }
} 