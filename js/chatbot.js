// AIMQOD 보험상담 챗봇 완성형 JS

function createChatbotHTML() {
    return `
    <div class="chatbot-header">
        <div class="chatbot-title">
            <h3><i class="fas fa-robot"></i> AIMQOD 보험 상담</h3>
            <p>AI 기반 맞춤형 보험 상담 서비스</p>
        </div>
        <button class="chatbot-close"><i class="fas fa-times"></i></button>
    </div>
    <div class="messages-container"></div>
    <div class="quick-form">
        <button class="quick-form-btn" data-type="products"><i class="fas fa-shield-alt"></i><span>보험상품 안내</span></button>
        <button class="quick-form-btn" data-type="calculator"><i class="fas fa-calculator"></i><span>보험료 계산</span></button>
        <button class="quick-form-btn" data-type="consultation"><i class="fas fa-headset"></i><span>상담 예약</span></button>
        <button class="quick-form-btn" data-type="faq"><i class="fas fa-question-circle"></i><span>자주 묻는 질문</span></button>
    </div>
    <div class="chatbot-input">
        <input type="text" placeholder="메시지를 입력하세요...">
        <button class="send-btn"><i class="fas fa-paper-plane"></i></button>
    </div>
    `;
}

function initChatbot() {
    // 기존 챗봇/토글 제거
    document.querySelectorAll('.chatbot-toggle, .chatbot-container').forEach(e => e.remove());

    // 토글 버튼 생성
    const toggleButton = document.createElement('button');
    toggleButton.className = 'chatbot-toggle';
    toggleButton.innerHTML = '<i class="fas fa-comments"></i>';
    document.body.appendChild(toggleButton);

    // 챗봇 컨테이너 생성
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    chatbotContainer.style.display = 'none';
    chatbotContainer.innerHTML = createChatbotHTML();
    document.body.appendChild(chatbotContainer);

    // 토글 버튼 이벤트
    toggleButton.addEventListener('click', () => {
        chatbotContainer.style.display = 'block';
        chatbotContainer.classList.add('slide-in');
        chatbotContainer.classList.remove('slide-out');
    });
    // 닫기 버튼 이벤트
    chatbotContainer.querySelector('.chatbot-close').addEventListener('click', () => {
        chatbotContainer.classList.add('slide-out');
        chatbotContainer.classList.remove('slide-in');
        setTimeout(() => {
            chatbotContainer.style.display = 'none';
        }, 300);
    });

    // 메시지 전송 이벤트
    const input = chatbotContainer.querySelector('input');
    const sendButton = chatbotContainer.querySelector('.send-btn');
    function sendMessage() {
        const message = input.value.trim();
        if (message) {
            addMessage(message, 'user');
            input.value = '';
            setTimeout(() => {
                addMessage('죄송합니다. 현재는 하단 탭을 통해 상담이 가능합니다.', 'bot');
            }, 500);
        }
    }
    sendButton.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    // 퀵 폼 버튼 이벤트
    chatbotContainer.querySelectorAll('.quick-form-btn').forEach(btn => {
        btn.addEventListener('click', () => handleQuickFormResponse(btn.dataset.type));
    });

    // 초기 인사 메시지
    setTimeout(() => {
        addMessage('안녕하세요! AIMQOD 보험 상담 서비스입니다. 어떤 도움이 필요하신가요?', 'bot');
    }, 400);
}

function addMessage(text, type) {
    const messagesContainer = document.querySelector('.messages-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-bubble ${type}-message`;
    messageDiv.innerHTML = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function handleQuickFormResponse(category) {
    switch(category) {
        case 'products':
            addMessage(`
                <div class="tab-sections">
                    <div class="tab-section" onclick="showProductDetail('health')">
                        <div class="section-icon">
                            <i class="fas fa-heartbeat"></i>
                        </div>
                        <div class="section-content">
                            <h5>건강보험</h5>
                            <p>질병과 상해에 대한 보장</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showProductDetail('car')">
                        <div class="section-icon">
                            <i class="fas fa-car"></i>
                        </div>
                        <div class="section-content">
                            <h5>자동차보험</h5>
                            <p>교통사고와 차량 손해 보장</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showProductDetail('fire')">
                        <div class="section-icon">
                            <i class="fas fa-fire"></i>
                        </div>
                        <div class="section-content">
                            <h5>화재보험</h5>
                            <p>재산 피해와 자연재해 보장</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                </div>
            `);
            break;
        case 'calculator':
            addMessage(`
                <div class="tab-sections">
                    <div class="tab-section" onclick="showDetail('calculator', 'health')">
                        <div class="section-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="section-content">
                            <h5>건강보험료 계산</h5>
                            <p>건강보험료 계산하기</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showDetail('calculator', 'life')">
                        <div class="section-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="section-content">
                            <h5>생명보험료 계산</h5>
                            <p>생명보험료 계산하기</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showDetail('calculator', 'car')">
                        <div class="section-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="section-content">
                            <h5>자동차보험료 계산</h5>
                            <p>자동차보험료 계산하기</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                </div>
            `);
            break;
        case 'consultation':
            addMessage(`
                <div class="tab-sections">
                    <div class="tab-section" onclick="showDetail('consultation', 'health')">
                        <div class="section-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="section-content">
                            <h5>건강보험 상담</h5>
                            <p>건강보험 전문 상담</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showDetail('consultation', 'life')">
                        <div class="section-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="section-content">
                            <h5>생명보험 상담</h5>
                            <p>생명보험 전문 상담</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showDetail('consultation', 'car')">
                        <div class="section-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="section-content">
                            <h5>자동차보험 상담</h5>
                            <p>자동차보험 전문 상담</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                </div>
            `);
            break;
        case 'faq':
            addMessage(`
                <div class="tab-sections">
                    <div class="tab-section" onclick="showDetail('faq', 'health')">
                        <div class="section-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="section-content">
                            <h5>건강보험 FAQ</h5>
                            <p>건강보험 자주 묻는 질문</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showDetail('faq', 'life')">
                        <div class="section-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="section-content">
                            <h5>생명보험 FAQ</h5>
                            <p>생명보험 자주 묻는 질문</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="showDetail('faq', 'car')">
                        <div class="section-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="section-content">
                            <h5>자동차보험 FAQ</h5>
                            <p>자동차보험 자주 묻는 질문</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                </div>
            `);
            break;
    }
}

function showProductDetail(type) {
    let content = '';
    
    switch(type) {
        case 'health':
            content = `
                <div class="detail-content">
                    <h4>건강보험 상세정보</h4>
                    <p>질병과 상해에 대한 종합적인 보장을 제공하는 건강보험입니다.</p>
                    <ul class="detail-list">
                        <li><i class="fas fa-check"></i> 입원/통원 치료비 보장</li>
                        <li><i class="fas fa-check"></i> 수술비 보장</li>
                        <li><i class="fas fa-check"></i> 특약 가입 가능</li>
                    </ul>
                    <div class="action-buttons">
                        <a href="/products.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
        case 'car':
            content = `
                <div class="detail-content">
                    <h4>자동차보험 상세정보</h4>
                    <p>교통사고와 차량 손해에 대한 보장을 제공하는 자동차보험입니다.</p>
                    <ul class="detail-list">
                        <li><i class="fas fa-check"></i> 대인배상 보장</li>
                        <li><i class="fas fa-check"></i> 대물배상 보장</li>
                        <li><i class="fas fa-check"></i> 자차손해 보장</li>
                    </ul>
                    <div class="action-buttons">
                        <a href="/products.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
        case 'fire':
            content = `
                <div class="detail-content">
                    <h4>화재보험 상세정보</h4>
                    <p>재산 피해와 자연재해에 대한 보장을 제공하는 화재보험입니다.</p>
                    <ul class="detail-list">
                        <li><i class="fas fa-check"></i> 건물 및 가재도구 손해 보장</li>
                        <li><i class="fas fa-check"></i> 화재로 인한 배상책임 보장</li>
                        <li><i class="fas fa-check"></i> 임시 거주비 지원</li>
                    </ul>
                    <div class="action-buttons">
                        <a href="/products.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
    }
    
    addMessage(content);
}

function showDetail(category, type) {
    let content = '';
    
    switch(category) {
        case 'calculator':
            const calcTitles = {
                health: '건강보험료 계산',
                life: '생명보험료 계산',
                car: '자동차보험료 계산'
            };
            const calcDetails = {
                health: '건강보험료를 간편하게 계산하여 예상 비용을 확인할 수 있습니다.',
                life: '생명보험료를 계산하여 가족의 미래를 대비할 수 있습니다.',
                car: '자동차보험료를 계산하여 운전 중 발생할 수 있는 위험에 대비하세요.'
            };
            content = `
                <div class="detail-content">
                    <h4>${calcTitles[type]}</h4>
                    <p>${calcDetails[type]}</p>
                    <ul class="detail-list">
                        <li><i class="fas fa-check"></i> 간편한 입력으로 빠른 계산</li>
                        <li><i class="fas fa-check"></i> 다양한 보험 상품 비교</li>
                        <li><i class="fas fa-check"></i> 맞춤형 보험료 산출</li>
                    </ul>
                    <div class="action-buttons">
                        <a href="/calculator.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
        case 'consultation':
            const consultTitles = {
                health: '건강보험 상담',
                life: '생명보험 상담',
                car: '자동차보험 상담'
            };
            const consultDetails = {
                health: '전문 설계사와 함께 건강보험에 대한 맞춤 상담을 받으실 수 있습니다.',
                life: '생명보험 전문 상담으로 가족의 미래를 안전하게 준비하세요.',
                car: '자동차보험 상담을 통해 운전에 필요한 최적의 보험을 찾아드립니다.'
            };
            content = `
                <div class="detail-content">
                    <h4>${consultTitles[type]}</h4>
                    <p>${consultDetails[type]}</p>
                    <ul class="detail-list">
                        <li><i class="fas fa-check"></i> 무료 상담 제공</li>
                        <li><i class="fas fa-check"></i> 전문 설계사 1:1 상담</li>
                        <li><i class="fas fa-check"></i> 온라인/오프라인 상담 가능</li>
                    </ul>
                    <div class="action-buttons">
                        <a href="/consultation.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
        case 'faq':
            const faqTitles = {
                health: '건강보험 FAQ',
                life: '생명보험 FAQ',
                car: '자동차보험 FAQ'
            };
            const faqDetails = {
                health: '건강보험에 대한 자주 묻는 질문과 답변을 확인하세요.',
                life: '생명보험 관련 궁금증을 해결할 수 있는 FAQ를 제공합니다.',
                car: '자동차보험에 대한 궁금한 점을 FAQ를 통해 빠르게 확인하세요.'
            };
            content = `
                <div class="detail-content">
                    <h4>${faqTitles[type]}</h4>
                    <p>${faqDetails[type]}</p>
                    <ul class="detail-list">
                        <li><i class="fas fa-check"></i> 자주 묻는 질문 모음</li>
                        <li><i class="fas fa-check"></i> 빠르고 정확한 답변</li>
                        <li><i class="fas fa-check"></i> 다양한 보험 관련 정보</li>
                    </ul>
                    <div class="action-buttons">
                        <a href="/faq.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
    }
    
    addMessage(content);
}

// 페이지 로드 시 초기화 (스크롤 로직 제거)
document.addEventListener('DOMContentLoaded', initChatbot);
