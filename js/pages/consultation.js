import { showModal } from '../utils.js';

export default function initConsultationPage() {
    const form = document.getElementById('consultationForm');
    const privacyPolicyBtn = document.getElementById('privacyPolicyBtn');
    const privacyPolicyTemplate = document.getElementById('privacyPolicyModal');

    // 개인정보 처리방침 모달
    privacyPolicyBtn.addEventListener('click', () => {
        const modalContent = privacyPolicyTemplate.content.cloneNode(true);
        showModal(modalContent);
    });

    // 전화번호 입력 형식 검증
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 3 && value.length <= 7) {
            value = value.replace(/(\d{3})(\d{0,4})/, '$1-$2');
        } else if (value.length > 7) {
            value = value.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
        }
        
        e.target.value = value;
    });

    // 상담일 선택 제한 (오늘 이후만 선택 가능)
    const dateInput = document.getElementById('preferredDate');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // 상담 방법에 따른 추가 정보 표시
    const consultationMethod = document.getElementById('consultationMethod');
    consultationMethod.addEventListener('change', (e) => {
        const method = e.target.value;
        const formGrid = document.querySelector('.form-grid');
        
        // 기존 추가 정보 제거
        const existingAddress = formGrid.querySelector('.address-group');
        if (existingAddress) existingAddress.remove();

        if (method === 'visit') {
            // 방문 상담 시 주소 입력 필드 추가
            const addressGroup = document.createElement('div');
            addressGroup.className = 'form-group address-group';
            addressGroup.innerHTML = `
                <label for="address">방문 주소 *</label>
                <input type="text" id="address" name="address" required>
            `;
            formGrid.appendChild(addressGroup);
        }
    });

    // 폼 제출 처리
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 필수 항목 검증
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
            } else {
                field.classList.remove('error');
            }
        });

        if (!isValid) {
            showModal('<p>필수 항목을 모두 입력해주세요.</p>');
            return;
        }

        // 관심 보험 선택 검증
        const selectedInterests = form.querySelectorAll('input[name="insuranceInterests"]:checked');
        if (selectedInterests.length === 0) {
            showModal('<p>관심 있는 보험을 하나 이상 선택해주세요.</p>');
            return;
        }

        // 폼 데이터 수집
        const formData = new FormData(form);
        const consultationData = {
            type: formData.get('consultationType'),
            interests: Array.from(selectedInterests).map(input => input.value),
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            preferredDate: formData.get('preferredDate'),
            preferredTime: formData.get('preferredTime'),
            method: formData.get('consultationMethod'),
            content: formData.get('consultationContent'),
            address: formData.get('address') || null
        };

        try {
            // API 호출 (실제 구현 시)
            // const response = await fetch('/api/consultations', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(consultationData)
            // });

            // 임시 성공 처리
            showModal(`
                <div class="success-message">
                    <h3>상담 예약이 완료되었습니다!</h3>
                    <p>입력하신 연락처로 상담 일정을 확인해드리겠습니다.</p>
                    <p>예약 정보:</p>
                    <ul>
                        <li>상담 유형: ${getConsultationTypeName(consultationData.type)}</li>
                        <li>상담 일시: ${consultationData.preferredDate} ${consultationData.preferredTime}</li>
                        <li>상담 방법: ${getConsultationMethodName(consultationData.method)}</li>
                    </ul>
                </div>
            `);

            // 폼 초기화
            form.reset();
        } catch (error) {
            console.error('상담 예약 실패:', error);
            showModal('<p>상담 예약 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</p>');
        }
    });

    // 유틸리티 함수
    function getConsultationTypeName(type) {
        const types = {
            new: '신규 가입',
            change: '보험 변경',
            review: '보험 검토'
        };
        return types[type] || type;
    }

    function getConsultationMethodName(method) {
        const methods = {
            visit: '방문 상담',
            phone: '전화 상담',
            video: '화상 상담'
        };
        return methods[method] || method;
    }
} 