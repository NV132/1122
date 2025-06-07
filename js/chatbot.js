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
    const messagesContainer = document.querySelector('.messages-container');
    
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
                    <div class="tab-section" onclick="showProductDetail('life')">
                        <div class="section-icon">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div class="section-content">
                            <h5>생명보험</h5>
                            <p>가족의 미래를 위한 보장</p>
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
                </div>
            `);
            break;
        case 'calculator':
            addMessage(`
                <div class="tab-sections">
                    <div class="tab-section" onclick="window.location.href='calculator.html'">
                        <div class="section-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="section-content">
                            <h5>건강보험료 계산</h5>
                            <p>건강보험료 계산하기</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="window.location.href='calculator.html'">
                        <div class="section-icon">
                            <i class="fas fa-calculator"></i>
                        </div>
                        <div class="section-content">
                            <h5>생명보험료 계산</h5>
                            <p>생명보험료 계산하기</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="window.location.href='calculator.html'">
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
                    <div class="tab-section" onclick="window.location.href='consultation.html'">
                        <div class="section-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="section-content">
                            <h5>건강보험 상담</h5>
                            <p>건강보험 전문 상담</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="window.location.href='consultation.html'">
                        <div class="section-icon">
                            <i class="fas fa-headset"></i>
                        </div>
                        <div class="section-content">
                            <h5>생명보험 상담</h5>
                            <p>생명보험 전문 상담</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="window.location.href='consultation.html'">
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
                    <div class="tab-section" onclick="window.location.href='faq.html'">
                        <div class="section-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="section-content">
                            <h5>건강보험 FAQ</h5>
                            <p>건강보험 자주 묻는 질문</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="window.location.href='faq.html'">
                        <div class="section-icon">
                            <i class="fas fa-question-circle"></i>
                        </div>
                        <div class="section-content">
                            <h5>생명보험 FAQ</h5>
                            <p>생명보험 자주 묻는 질문</p>
                        </div>
                        <i class="fas fa-chevron-right section-arrow"></i>
                    </div>
                    <div class="tab-section" onclick="window.location.href='faq.html'">
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
    const messagesContainer = document.querySelector('.messages-container');
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
                        <a href="products.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
        case 'life':
            content = `
                <div class="detail-content">
                    <h4>생명보험 상세정보</h4>
                    <p>가족의 미래를 위한 안정적인 보장을 제공하는 생명보험입니다.</p>
                    <ul class="detail-list">
                        <li><i class="fas fa-check"></i> 사망보험금 지급</li>
                        <li><i class="fas fa-check"></i> 만기환급금 지급</li>
                        <li><i class="fas fa-check"></i> 특약 가입 가능</li>
                    </ul>
                    <div class="action-buttons">
                        <a href="products.html" class="action-button">상세보기</a>
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
                        <a href="products.html" class="action-button">상세보기</a>
                    </div>
                </div>
            `;
            break;
    }
    
    addMessage(content);
}

document.addEventListener('DOMContentLoaded', initChatbot); 