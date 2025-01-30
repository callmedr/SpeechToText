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
    recognition.continuous = true; // 음성 인식을 지속적으로 수행하도록 설정
    recognition.interimResults = true; // 실시간으로 음성을 텍스트로 변환
    recognition.maxAlternatives = 1;

    let finalTranscript = ""; // 최종 결과 저장
    let silenceTimeout; // 타이머를 설정할 변수

    // 음성 인식 시작
    startBtn.addEventListener("click", () => {
        startBtn.disabled = true;
        recognition.start();
    });

    // 음성 인식 결과 처리
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript; // 마지막 결과

        if (event.results[event.results.length - 1].isFinal) { // 음성이 종료되었을 때만 저장
            finalTranscript += transcript + " "; // 최종 텍스트에 추가
            let savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
            savedTexts.push(finalTranscript); // 새로운 텍스트 추가
            localStorage.setItem("savedTexts", JSON.stringify(savedTexts));

            finalTranscript = ""; // 최종 텍스트 초기화
            loadSavedTexts(); // 목록 다시 불러오기

            // 타이머 초기화 (1분 후 텍스트 저장)
            clearTimeout(silenceTimeout);
            silenceTimeout = setTimeout(() => {
                saveFinalText(); // 1분 후 텍스트 저장
            }, 60000); // 60,000ms = 1분
        }
    };

    // 음성 인식 종료 이벤트
    recognition.onend = () => {
        startBtn.disabled = false;
    };

    // 1분 후 텍스트 저장
    function saveFinalText() {
        let savedTexts = JSON.parse(localStorage.getItem("savedTexts")) || [];
        savedTexts.push(finalTranscript); // 최종 텍스트 추가
        localStorage.setItem("savedTexts", JSON.stringify(savedTexts));
        loadSavedTexts(); // 목록 다시 불러오기
    }

    // 오류 처리
    recognition.onerror = (event) => {
        console.log("오류 발생:", event.error);
    };

    // 저장된 텍스트 목록 불러오기
    loadSavedTexts();
});
