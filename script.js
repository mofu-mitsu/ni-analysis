// 🌟 ここに作成したGASのWebアプリURL（デプロイURL）を貼り付けてね！ 🌟
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxypqVLDsdG_z4nnCNCzU184mLMIdHrTp0hr5xA3PxEXPumWz4SD0LHtXTejGCG1XkKLQ/exec';

document.addEventListener('DOMContentLoaded', () => {
    // 街の光（カラフルな玉ボケ）
    const orbsContainer = document.getElementById('orbs-container');
    const colors = [
        'radial-gradient(circle, rgba(255, 150, 50, 1) 0%, rgba(255, 150, 50, 0) 70%)',
        'radial-gradient(circle, rgba(50, 200, 255, 1) 0%, rgba(50, 200, 255, 0) 70%)',
        'radial-gradient(circle, rgba(255, 100, 150, 1) 0%, rgba(255, 100, 150, 0) 70%)',
        'radial-gradient(circle, rgba(100, 255, 150, 1) 0%, rgba(100, 255, 150, 0) 70%)'
    ];
    for (let i = 0; i < 30; i++) {
        const orb = document.createElement('div');
        orb.classList.add('orb');
        const size = Math.random() * 150 + 50;
        orb.style.width = `${size}px`; orb.style.height = `${size}px`;
        orb.style.left = `${Math.random() * 100}%`; orb.style.bottom = `-100px`;
        orb.style.background = colors[Math.floor(Math.random() * colors.length)];
        orb.style.setProperty('--duration', Math.random() * 15 + 10 + 's');
        orb.style.setProperty('--max-opacity', Math.random() * 0.4 + 0.2);
        orb.style.animationDelay = Math.random() * 10 + 's';
        orbsContainer.appendChild(orb);
    }

    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.classList.add('toast');
        toast.innerHTML = `<i class="fa-solid fa-bell"></i> ${message}`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    const butterflyZone = document.getElementById('butterfly-zone');
    function spawnButterfly() {
        if(document.getElementById('quiz-screen').classList.contains('hidden')) return;
        const butterfly = document.createElement('div');
        butterfly.classList.add('butterfly');
        butterfly.innerText = '🦋';
        butterfly.style.left = `${Math.random() * 80 + 10}%`; butterfly.style.top = `${Math.random() * 80 + 10}%`;
        butterflyZone.appendChild(butterfly);
        setTimeout(() => butterfly.remove(), 6000);
    }
    function scheduleNextButterfly() { setTimeout(() => { spawnButterfly(); scheduleNextButterfly(); }, Math.random() * 7000 + 8000); }
    scheduleNextButterfly();

    // 🎵 BGMトグル機能
    const bgmPlayer = document.getElementById('bgm-player');
    const bgmBtn = document.getElementById('bgm-toggle-btn');
    let isBgmPlaying = false;

    bgmBtn.addEventListener('click', () => {
        if (!isBgmPlaying) {
            bgmPlayer.play().then(() => {
                bgmBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> BGM: ON`;
                isBgmPlaying = true;
                showToast("BGMを再生します🎵");
            }).catch((err) => {
                console.error("BGM Play Error:", err);
                // 🌟 ここを分かりやすい汎用メッセージに修正！
                showToast("BGMの再生に失敗しました。ロード中か、ブラウザにブロックされた可能性があります。");
            });
        } else {
            bgmPlayer.pause();
            bgmBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> BGM: OFF`;
            isBgmPlaying = false;
            showToast("BGMを停止しました。");
        }
    });

    let currentQuestionIndex = 0, selectedQuestionCount = 5, selectedQuestions = [];

    const titleScreen = document.getElementById('title-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const finalResultScreen = document.getElementById('final-result-screen');
    const confirmModal = document.getElementById('confirm-modal');
    
    function shuffleArray(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function updateHeaderButtons() {
        if (titleScreen.classList.contains('hidden')) {
            document.getElementById('lab-home-btn').classList.add('hidden');
            document.getElementById('back-title-btn').classList.remove('hidden');
        } else {
            document.getElementById('lab-home-btn').classList.remove('hidden');
            document.getElementById('back-title-btn').classList.add('hidden');
        }
    }

    document.getElementById('start-btn').addEventListener('click', () => {
        selectedQuestionCount = parseInt(document.getElementById('question-count').value);
        let shuffled = shuffleArray([...quizData]).map(q => ({...q}));
        selectedQuestions = shuffled.slice(0, selectedQuestionCount);
        
        currentQuestionIndex = 0;
        titleScreen.classList.add('hidden'); 
        finalResultScreen.classList.add('hidden'); 
        quizScreen.classList.remove('hidden');
        updateHeaderButtons(); 
        
        document.getElementById('total-q-num').innerText = selectedQuestionCount;
        loadQuestion();
    });

    function loadQuestion() {
        const currentData = selectedQuestions[currentQuestionIndex];
        document.getElementById('question-text').innerText = currentData.question;
        document.getElementById('answer-input').value = currentData.userAnswer || '';
        document.getElementById('current-q-num').innerText = currentQuestionIndex + 1;
        
        document.getElementById('result-container').classList.add('hidden');
        document.getElementById('answer-input').disabled = false;
        document.getElementById('submit-btn').style.display = 'block';

        if (currentQuestionIndex > 0) {
            document.getElementById('prev-btn-1').classList.remove('hidden');
        } else {
            document.getElementById('prev-btn-1').classList.add('hidden');
        }
    }

    document.getElementById('submit-btn').addEventListener('click', () => {
        const answerText = document.getElementById('answer-input').value.trim();
        const currentData = selectedQuestions[currentQuestionIndex];
        let wordMbtiCount = 0, wordSocioCount = 0;
        let resultMsg = "";

        currentData.userAnswer = answerText;
        currentData.isSkipped = (answerText === '');

        if (currentData.isSkipped) {
            showToast("未入力のため、判定をスキップして景色（解答例）を眺めます。");
            resultMsg = "【判定スキップ】解答例を参考にしてみてください！";
            currentData.mbtiScore = 0; currentData.socioScore = 0;
        } else {
            currentData.mbtiKeywords.forEach(w => { if (answerText.includes(w)) wordMbtiCount++; });
            currentData.socioKeywords.forEach(w => { if (answerText.includes(w)) wordSocioCount++; });
            
            currentData.mbtiScore = wordMbtiCount;
            currentData.socioScore = wordSocioCount;

            if (wordMbtiCount > wordSocioCount) resultMsg = "この問題では「構造予測・直感（MBTIのNi的）」の視点が強いですね！";
            else if (wordSocioCount > wordMbtiCount) resultMsg = "この問題では「時間・流れ（ソシオニクスのNi的）」の視点が強いですね！";
            else if (wordMbtiCount > 0 && wordSocioCount > 0 && wordMbtiCount === wordSocioCount) resultMsg = "直感と時間の両方の単語が含まれています！複合的な視点を持っていますね！";
            else resultMsg = "独自の視点ですね！以下の解答例と自分の思考プロセスを比べてみてください。";
        }

        document.getElementById('result-description').innerText = resultMsg;
        document.getElementById('mbti-example').innerText = currentData.mbtiExample;
        document.getElementById('socio-example').innerText = currentData.socioExample;
        
        document.getElementById('answer-input').disabled = true;
        document.getElementById('submit-btn').style.display = 'none';
        document.getElementById('prev-btn-1').classList.add('hidden'); 
        document.getElementById('result-container').classList.remove('hidden');
        
        if (currentQuestionIndex > 0) {
            document.getElementById('prev-btn-2').classList.remove('hidden');
        } else {
            document.getElementById('prev-btn-2').classList.add('hidden');
        }
        
        document.getElementById('next-btn').innerHTML = (currentQuestionIndex === selectedQuestionCount - 1) 
            ? '散策を終えて結果を見る <i class="fa-solid fa-chart-pie"></i>' 
            : '次の景色へ <i class="fa-solid fa-arrow-right"></i>';
    });

    function goBack() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion();
        }
    }
    document.getElementById('prev-btn-1').addEventListener('click', goBack);
    document.getElementById('prev-btn-2').addEventListener('click', goBack);

    document.getElementById('next-btn').addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex >= selectedQuestionCount) showFinalResult();
        else loadQuestion();
    });

    let finalJudgementText = ""; 

    function showFinalResult() {
        quizScreen.classList.add('hidden');
        finalResultScreen.classList.remove('hidden');

        const userType = document.getElementById('user-type').value.trim();
        if (userType) {
            document.getElementById('display-user-type').innerText = userType;
            document.getElementById('final-type-display').classList.remove('hidden');
        } else {
            document.getElementById('final-type-display').classList.add('hidden');
        }

        let mPoints = 0, sPoints = 0, uPoints = 0, ansCount = 0;
        selectedQuestions.forEach(q => {
            if (!q.isSkipped) {
                ansCount++;
                if (q.mbtiScore > q.socioScore) mPoints++;
                else if (q.socioScore > q.mbtiScore) sPoints++;
                else if (q.mbtiScore > 0 && q.mbtiScore === q.socioScore) { mPoints += 0.5; sPoints += 0.5; }
                else uPoints++;
            }
        });

        let mbtiPercent = 0, socioPercent = 0, uniquePercent = 0;
        if (ansCount > 0) {
            mbtiPercent = Math.round((mPoints / ansCount) * 100);
            socioPercent = Math.round((sPoints / ansCount) * 100);
            uniquePercent = Math.round((uPoints / ansCount) * 100);
        }

        setTimeout(() => {
            document.getElementById('mbti-bar').style.width = `${mbtiPercent}%`;
            document.getElementById('socio-bar').style.width = `${socioPercent}%`;
            document.getElementById('unique-bar').style.width = `${uniquePercent}%`;
            document.getElementById('mbti-percent').innerText = `${mbtiPercent}%`;
            document.getElementById('socio-percent').innerText = `${socioPercent}%`;
            document.getElementById('unique-percent').innerText = `${uniquePercent}%`;
        }, 100);

        const judgementEl = document.getElementById('final-judgement');
        const detailsEl = document.getElementById('final-details');

        if (ansCount === 0) {
            finalJudgementText = "【散策のみ】";
            detailsEl.innerText = "今回は景色（解答例）を眺めるだけでしたね。次はぜひ自分の考えを入力して分析してみてください！";
        } else if (uniquePercent > mbtiPercent && uniquePercent > socioPercent) {
            finalJudgementText = "【完全なる独自視点】";
            detailsEl.innerText = "既存の枠に囚われない、あなただけのユニークで論理的な思考プロセスを持っているようです✨";
        } else if (mbtiPercent > socioPercent) {
            finalJudgementText = "【構造予測・直感 型】";
            detailsEl.innerText = "事象の背後にある本質を抽出したり、点と点を繋いで「なんとなくわかる」という直感（MBTI的なNi）の傾向が強いようです！";
        } else if (socioPercent > mbtiPercent) {
            finalJudgementText = "【時間・プロセス幻視 型】";
            detailsEl.innerText = "過去から未来へ流れる時間のうねりや、物事の連鎖・予兆を見る、ソシオニクス的なNiの傾向が強いようです！";
        } else {
            finalJudgementText = "【パーフェクト・バランサー】";
            detailsEl.innerText = "直感で本質を捉える力と、時間を予測する力の両方をバランス良く使っています！";
        }
        judgementEl.innerText = finalJudgementText;

        sendDataToGas({
            userType: userType || '未指定',
            result: finalJudgementText,
            mbti: mbtiPercent,
            socio: socioPercent,
            unique: uniquePercent,
            answers: selectedQuestions.map((q, idx) => ({
                num: idx + 1,
                question: q.question.replace(/\n/g, ' '), 
                answer: q.userAnswer || '（スキップ）'
            }))
        });
    }

    function sendDataToGas(payload) {
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'YOUR_GAS_WEB_APP_URL') {
            console.log("GASのURLが未設定のため、送信をスキップしました。");
            return;
        }

        fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => console.log("データをGAS経由で送信しました。"))
        .catch(err => console.error("GASデータ送信エラー:", err));
    }

    // --- タイトルへ戻る処理（確認モーダル） ---
    document.getElementById('back-title-btn').addEventListener('click', () => {
        confirmModal.classList.remove('hidden');
    });

    document.getElementById('modal-cancel-btn').addEventListener('click', () => {
        confirmModal.classList.add('hidden');
    });

    document.getElementById('modal-ok-btn').addEventListener('click', () => {
        confirmModal.classList.add('hidden');
        quizScreen.classList.add('hidden');
        finalResultScreen.classList.add('hidden');
        titleScreen.classList.remove('hidden');
        updateHeaderButtons(); 
        
        document.getElementById('mbti-bar').style.width = `0%`;
        document.getElementById('socio-bar').style.width = `0%`;
        document.getElementById('unique-bar').style.width = `0%`;
    });

    // --- 画像保存機能 ---
    document.getElementById('save-img-btn').addEventListener('click', () => {
        showToast("画像を生成中です...🦋");
        const panel = document.getElementById('main-panel');
        
        const actionBtns = document.getElementById('action-buttons');
        const restartBtn = document.getElementById('restart-btn');
        const headerDesc = document.getElementById('header-desc'); 
        const panelNav = document.getElementById('panel-nav'); // 🌟 ナビバーを1行で一括非表示！
        
        actionBtns.style.display = 'none';
        restartBtn.style.display = 'none';
        headerDesc.style.display = 'none';
        panelNav.style.display = 'none';

        html2canvas(panel, {
            backgroundColor: "#1a2535", 
            scale: 2 
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'ni-analysis-result.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            actionBtns.style.display = 'flex';
            restartBtn.style.display = 'block';
            headerDesc.style.display = 'block';
            panelNav.style.display = 'flex'; // 元に戻す
            showToast("保存が完了しました！");
        });
    });

    document.getElementById('share-btn').addEventListener('click', () => {
        const mbti = document.getElementById('mbti-percent').innerText;
        const socio = document.getElementById('socio-percent').innerText;
        const unique = document.getElementById('unique-percent').innerText;
        
        const shareText = `🦋 2つの「直観(Ni)」分析 🦋\n私の思考傾向は ${finalJudgementText} でした！\n\n構造・直感(MBTI): ${mbti}\n時間・流れ(Socio): ${socio}\n独自視点: ${unique}\n\n#2つの直観分析\nhttps://mofu-mitsu.github.io/ni-analysis/`;
        
        if (navigator.share) {
            navigator.share({ title: 'MBTIとソシオニクス 2つの「直観(Ni)」分析', text: shareText, url: 'https://mofu-mitsu.github.io/ni-analysis/' }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText)
                .then(() => showToast("結果をクリップボードにコピーしました！"))
                .catch(() => showToast("シェア機能がサポートされていません。"));
        }
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        document.getElementById('mbti-bar').style.width = `0%`;
        document.getElementById('socio-bar').style.width = `0%`;
        document.getElementById('unique-bar').style.width = `0%`;
        finalResultScreen.classList.add('hidden');
        titleScreen.classList.remove('hidden');
        updateHeaderButtons(); 
    });

    updateHeaderButtons();
});