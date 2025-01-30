document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const resetBtn = document.getElementById("reset-btn");
    const resultList = document.getElementById("result-list");

    // LocalStorage에서 저장된 텍스트 불러오기
    function loadSavedTexts() {
        resultList.innerHTML = ""; // 기존 목록 초기화
        const savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];

        savedTexts.forEach((text, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = text;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌ 삭제";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.addEventListener("click", () => deleteText(index));

            listItem.appendChild(deleteBtn);
            resultList.appendChild(listItem);
        });
    }

    // 개별 텍스트 삭제
    function deleteText(index) {
        let savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
        savedTexts.splice(index, 1); // 해당 인덱스의 항목 제거
        localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
        loadSavedTexts(); // 목록 다시 불러오기
    }

    // 전체 초기화
    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("savedTexts");
        loadSavedTexts();
    });

    // 브라우저 지원 여부 확인
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!window.SpeechRecognition) {
        alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR"; 
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1;

    // 음성 인식 시작
    startBtn.addEventListener("click", () => {
        startBtn.disabled = true;
        recognition.start();
    });

    // 음성 인식 결과 처리
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        
        let savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
        savedTexts.push(transcript); // 새로운 텍스트 추가
        localStorage.setItem("savedTexts", JSON.stringify(savedTexts));

        loadSavedTexts(); // 목록 다시 불러오기
    };

    // 오류 처리
    recognition.onerror = (event) => {
        console.log("오류 발생:", event.error);
    };

    // 음성 인식 종료 이벤트
    recognition.onend = () => {
        startBtn.disabled = false;
    };

    // 저장된 텍스트 목록 불러오기
    loadSavedTexts();
});
