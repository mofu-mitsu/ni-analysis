// 🌟 ここに作成したGASのWebアプリURL（デプロイURL）を貼り付けてね！ 🌟
const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbz6OWYrJEIOJdSzhesXjZWmuAtzevmL2GjGk5eDsH4NqaKSmRxSj4heLWUlVKXCfLLVgA/exec';

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 🧠 AI思考スタイル推定エンジン (Naive Bayes Classifier)
    // ==========================================
    const aiBrain = {
        wordCounts: {}, 
        typeCounts: {}, 
        vocab: new Set()
    };

    function extractFeatures(text) {
        let features = [];
        let cleanedText = text.replace(/[、。・（）()「」\n\s]/g, ""); 
        for (let i = 0; i < cleanedText.length - 1; i++) {
            features.push(cleanedText.substring(i, i + 2));
        }
        return features;
    }

    function trainAI(logText, styleClass) {
        let features = extractFeatures(logText);
        if (!aiBrain.wordCounts[styleClass]) {
            aiBrain.wordCounts[styleClass] = {};
            aiBrain.typeCounts[styleClass] = 0;
        }
        aiBrain.typeCounts[styleClass] += 1;
        features.forEach(word => {
            aiBrain.wordCounts[styleClass][word] = (aiBrain.wordCounts[styleClass][word] || 0) + 1;
            aiBrain.vocab.add(word);
        });
    }

    function predictThinkingStyle(logText) {
        let features = extractFeatures(logText);
        let allScores = {};

        if (Object.keys(aiBrain.typeCounts).length === 0) return null;

        Object.keys(aiBrain.typeCounts).forEach(style => {
            let score = Math.log(aiBrain.typeCounts[style]); 
            let totalWordsInType = Object.values(aiBrain.wordCounts[style]).reduce((a, b) => a + b, 0);
            
            features.forEach(word => {
                let wordCount = aiBrain.wordCounts[style][word] || 0;
                let wordProbability = (wordCount + 1) / (totalWordsInType + aiBrain.vocab.size);
                score += Math.log(wordProbability);
            });
            allScores[style] = score;
        });
        
        let vals = Object.values(allScores);
        let max = Math.max(...vals);
        let min = Math.min(...vals);
        let diff = max - min;
        
        let stars = {};
        for (let key in allScores) {
            if (diff === 0) {
                stars[key] = 3;
            } else {
                let norm = (allScores[key] - min) / diff;
                stars[key] = Math.round(1 + 4 * norm);
            }
        }
        return stars;
    }

    // 🚀 初期学習データ
    trainAI("本質 構造 システム 概念 法則 根本 レイヤー メカニズム 路線変更 方向性 戦略 運営 パターン", "構造抽象化");
    trainAI("成熟期 大衆化 移行 フェーズ 年後 未来 過去 衰退 プロセス やがて 最終的 時系列 末路 流れ いずれ 連鎖 トレンド 時代", "時間予測");
    trainAI("矛盾 パラドックス 整合性 合理性 客観的 根本原因 欠如 乖離 ズレ 手段の目的化 比較 摩擦 逃避 悪循環 マイペース 快適度 置き換える", "論理検証");
    trainAI("前提 条件 そもそも 不足 だとしたら 理由 意味 定義 疑問 情報不足 わかるわけない 目的 意図 意図的", "前提確認");
    trainAI("生活 基盤 お金 物理的 現実 限界 維持費 給料 人間関係 環境 土壌 経験 実際のところ どうせ やばい どうにかしないと 最悪", "現実補完");
    trainAI("あるいは かもしれない 妄想 可能性 例えば 予測 伏線 ストーリー テーマ 象徴 もしくは 多分 気がする なんとなく", "独自仮説");

    trainAI("そもそも情報不足じゃない？まずその人が今何歳なのかもわからないし、仕事してるのかも知らないしわかるわけなくない？？？アイディアも何に対するアイディアなのかわからないし…なんともいえなくないか？だって生活が不安定だと、自由にお金が使えなくなるわけだしそう考えると自由に生きたいも、安定が欲しいも矛盾はしてないと思う", "前提確認");
    trainAI("誰も修理しないのは修理できるような技術持ってる人がいないとしか言いようがもしくはいたとしてもどうでもいいと思っててやる気がないんだよきっとボスに逆らえないからみんな意見言わないんだろうなとかねパワハラとかなんじゃない？多分", "現実補完");
    trainAI("快適度を言葉に置き換えているだけで基本的にはマイペースの追求を目的としている。世間はそう甘くないからまたシャッター通りとなる可能性も高い。この世に完璧はない。何事もトライアンドエラーを繰り返していくだけ。神聖な儀式、つまりは合理性からかけ離れた風習のようなもの。意図も意味もないことを突きつけたかったんだろ。", "論理検証");
    trainAI("「自由に生きたい」すらも窮屈な環境への裏返しでしかなく、真に自分が願ったことでないと気がついたのかもしれない。塞ぎ込んでいるかもしれない。あるいは、自分の才能を潰して社会に適応しているかもしれない。", "独自仮説");

    // 📡 GASから過去のデータを読み込んでAIを賢くする（MBTI・ソシオ完全独立版！）
    async function loadServerData() {
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('YOUR_GAS_WEB_APP_URL')) return;
        try {
            console.log("📡 AIが過去の記憶をダウンロード中...");
            let response = await fetch(GAS_WEB_APP_URL);
            let data = await response.json();
            
            data.forEach(item => {
                if(item.text && item.type) {
                    let t = item.type.toUpperCase();
                    
                    // 🌟 MBTI 16タイプの判定（独立） 🌟
                    if (t.includes("INTJ")) { trainAI(item.text, "構造抽象化"); trainAI(item.text, "論理検証"); trainAI(item.text, "前提確認"); }
                    if (t.includes("INTP")) { trainAI(item.text, "論理検証"); trainAI(item.text, "独自仮説"); trainAI(item.text, "前提確認"); }
                    if (t.includes("ENTJ")) { trainAI(item.text, "構造抽象化"); trainAI(item.text, "時間予測"); trainAI(item.text, "前提確認"); }
                    if (t.includes("ENTP")) { trainAI(item.text, "独自仮説"); trainAI(item.text, "論理検証"); trainAI(item.text, "前提確認"); }
                    
                    if (t.includes("INFJ")) { trainAI(item.text, "構造抽象化"); trainAI(item.text, "独自仮説"); trainAI(item.text, "時間予測"); }
                    if (t.includes("INFP")) { trainAI(item.text, "独自仮説"); trainAI(item.text, "現実補完"); trainAI(item.text, "時間予測"); }
                    if (t.includes("ENFJ")) { trainAI(item.text, "構造抽象化"); trainAI(item.text, "時間予測"); trainAI(item.text, "独自仮説"); }
                    if (t.includes("ENFP")) { trainAI(item.text, "独自仮説"); trainAI(item.text, "現実補完"); trainAI(item.text, "前提確認"); }
                    
                    if (t.includes("ISTJ")) { trainAI(item.text, "現実補完"); trainAI(item.text, "論理検証"); trainAI(item.text, "前提確認"); }
                    if (t.includes("ISTP")) { trainAI(item.text, "現実補完"); trainAI(item.text, "論理検証"); trainAI(item.text, "独自仮説"); }
                    if (t.includes("ESTJ")) { trainAI(item.text, "現実補完"); trainAI(item.text, "前提確認"); trainAI(item.text, "構造抽象化"); }
                    if (t.includes("ESTP")) { trainAI(item.text, "現実補完"); trainAI(item.text, "論理検証"); trainAI(item.text, "時間予測"); }
                    
                    if (t.includes("ISFJ")) { trainAI(item.text, "現実補完"); trainAI(item.text, "前提確認"); trainAI(item.text, "時間予測"); }
                    if (t.includes("ISFP")) { trainAI(item.text, "現実補完"); trainAI(item.text, "独自仮説"); trainAI(item.text, "時間予測"); }
                    if (t.includes("ESFJ")) { trainAI(item.text, "現実補完"); trainAI(item.text, "時間予測"); trainAI(item.text, "前提確認"); }
                    if (t.includes("ESFP")) { trainAI(item.text, "現実補完"); trainAI(item.text, "独自仮説"); trainAI(item.text, "前提確認"); }

                    // 🌟 ソシオニクス 16タイプの判定（MBTIと同時に吸収可能！） 🌟
                    if (t.includes("LII")) { trainAI(item.text, "構造抽象化"); trainAI(item.text, "論理検証"); trainAI(item.text, "前提確認"); }
                    if (t.includes("ILI")) { trainAI(item.text, "時間予測"); trainAI(item.text, "論理検証"); trainAI(item.text, "現実補完"); }
                    if (t.includes("LIE")) { trainAI(item.text, "時間予測"); trainAI(item.text, "構造抽象化"); trainAI(item.text, "前提確認"); }
                    if (t.includes("ILE")) { trainAI(item.text, "独自仮説"); trainAI(item.text, "論理検証"); trainAI(item.text, "前提確認"); }
                    
                    if (t.includes("EII")) { trainAI(item.text, "構造抽象化"); trainAI(item.text, "独自仮説"); trainAI(item.text, "現実補完"); }
                    if (t.includes("IEI")) { trainAI(item.text, "時間予測"); trainAI(item.text, "独自仮説"); trainAI(item.text, "現実補完"); }
                    if (t.includes("EIE")) { trainAI(item.text, "時間予測"); trainAI(item.text, "構造抽象化"); trainAI(item.text, "独自仮説"); }
                    if (t.includes("IEE")) { trainAI(item.text, "独自仮説"); trainAI(item.text, "現実補完"); trainAI(item.text, "時間予測"); }
                    
                    if (t.includes("LSI")) { trainAI(item.text, "論理検証"); trainAI(item.text, "現実補完"); trainAI(item.text, "前提確認"); }
                    if (t.includes("SLE")) { trainAI(item.text, "現実補完"); trainAI(item.text, "論理検証"); trainAI(item.text, "独自仮説"); }
                    if (t.includes("LSE")) { trainAI(item.text, "前提確認"); trainAI(item.text, "現実補完"); trainAI(item.text, "構造抽象化"); }
                    if (t.includes("SLI")) { trainAI(item.text, "現実補完"); trainAI(item.text, "前提確認"); trainAI(item.text, "論理検証"); }
                    
                    if (t.includes("ESI")) { trainAI(item.text, "現実補完"); trainAI(item.text, "前提確認"); trainAI(item.text, "時間予測"); }
                    if (t.includes("SEE")) { trainAI(item.text, "現実補完"); trainAI(item.text, "独自仮説"); trainAI(item.text, "時間予測"); }
                    if (t.includes("ESE")) { trainAI(item.text, "時間予測"); trainAI(item.text, "現実補完"); trainAI(item.text, "前提確認"); }
                    if (t.includes("SEI")) { trainAI(item.text, "現実補完"); trainAI(item.text, "時間予測"); trainAI(item.text, "独自仮説"); }
                }
            });
            console.log(`🧠 AI進化完了！全32タイプの思考スタイルを独立して学習しました！`);
        } catch (err) {
            console.error("AIデータのダウンロード失敗", err);
        }
    }
    loadServerData();

    // ==========================================
    // 🦋 UIとゲームロジック
    // ==========================================

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
        let allAnswersText = ""; 

        selectedQuestions.forEach(q => {
            if (!q.isSkipped) {
                ansCount++;
                allAnswersText += q.userAnswer + " ";
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

        // 🌟 AIによる思考スタイル推定（★評価）
        let aiLogText = "";
        const aiRadarEl = document.getElementById('ai-radar-stats');
        
        if (ansCount > 0 && allAnswersText.length > 10) {
            let stars = predictThinkingStyle(allAnswersText);
            if (stars) {
                let html = "";
                const styleNames = ["構造抽象化", "時間予測", "論理検証", "前提確認", "現実補完", "独自仮説"];
                const mbtiMap = {"構造抽象化":"MBTI的Ni", "時間予測":"ソシオ的Ni", "論理検証":"Ti的", "前提確認":"Ti/Te的", "現実補完":"Si/Se/Ne的", "独自仮説":"Ne的"};
                
                styleNames.forEach(key => {
                    let starCount = stars[key] || 1;
                    let starStr = "★".repeat(starCount) + "☆".repeat(5 - starCount);
                    html += `<div class="stat-line"><span>${key} <span style="font-size:0.75rem;color:#94a3b8;">(${mbtiMap[key]})</span></span> <span class="stars">${starStr}</span></div>`;
                    aiLogText += `${key}: ${starStr}\n`;
                });
                aiRadarEl.innerHTML = html;
            } else {
                aiRadarEl.innerHTML = `<p style="color:#94a3b8; font-size:0.9rem;">判定不能（データ不足）</p>`;
            }
        } else {
            aiRadarEl.innerHTML = `<p style="color:#94a3b8; font-size:0.9rem;">判定不能（文字数不足）</p>`;
        }

        let logText = `--- 2つの「直観(Ni)」分析 散策の記録 ---\n`;
        if (userType) logText += `自認タイプ: ${userType}\n`;
        logText += `総合結果: ${finalJudgementText}\n`;
        logText += `構造・直感(MBTI): ${mbtiPercent}% | 時間・流れ(ソシオ): ${socioPercent}% | 独自・論理分析: ${uniquePercent}%\n\n`;
        logText += `🤖 AI思考スタイル推定:\n${aiLogText}`;
        logText += `==========================================\n\n`;

        selectedQuestions.forEach((q, idx) => {
            logText += `【Q${idx + 1}】\n${q.question}\n\n`;
            logText += `(あなたの回答):\n${q.userAnswer || '（スキップ）'}\n`;
            logText += `\n------------------------------------------\n\n`;
        });

        const logOutputEl = document.getElementById('log-output');
        if (logOutputEl) logOutputEl.value = logText;

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
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL.includes('YOUR_GAS_WEB_APP_URL')) return;
        fetch(GAS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error(err));
    }

    const copyLogBtn = document.getElementById('copy-log-btn');
    if (copyLogBtn) {
        copyLogBtn.addEventListener('click', () => {
            const logOutput = document.getElementById('log-output');
            try {
                logOutput.select();
                logOutput.setSelectionRange(0, 99999); 
                document.execCommand('copy');
                showToast("回答ログをコピーしました！🦋");
            } catch (err) {
                navigator.clipboard.writeText(logOutput.value).then(() => showToast("回答ログをコピーしました！🦋")).catch(() => showToast("コピー失敗"));
            }
        });
    }

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

    document.getElementById('save-img-btn').addEventListener('click', () => {
        showToast("画像を生成中です...🦋");
        const panel = document.getElementById('main-panel');
        const actionBtns = document.getElementById('action-buttons');
        const restartBtn = document.getElementById('restart-btn');
        const headerDesc = document.getElementById('header-desc'); 
        const panelNav = document.getElementById('panel-nav'); 
        const logContainer = document.getElementById('log-container'); 
        
        if (actionBtns) actionBtns.style.display = 'none';
        if (restartBtn) restartBtn.style.display = 'none';
        if (headerDesc) headerDesc.style.display = 'none';
        if (panelNav) panelNav.style.display = 'none';
        if (logContainer) logContainer.style.display = 'none'; 

        const originalHeight = panel.style.height;
        const originalOverflow = panel.style.overflowY;
        const originalMaxHeight = panel.style.maxHeight;
        
        panel.style.height = 'auto';
        panel.style.maxHeight = 'none';
        panel.style.overflowY = 'visible';
        
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        window.scrollTo(0, 0);

        setTimeout(() => {
            html2canvas(panel, {
                backgroundColor: "#1a2535", 
                scale: 2,
                windowWidth: 800, 
                onclone: (clonedDoc) => {
                    const clonedPanel = clonedDoc.getElementById('main-panel');
                    if (clonedPanel) {
                        clonedPanel.style.width = '700px';
                        clonedPanel.style.maxWidth = '700px';
                        clonedPanel.style.margin = '40px auto';
                        clonedPanel.style.padding = '40px';
                        clonedPanel.style.height = 'auto'; 
                        clonedPanel.style.maxHeight = 'none';
                        clonedPanel.style.overflowY = 'visible';

                        const hideIds = ['action-buttons', 'restart-btn', 'header-desc', 'panel-nav', 'log-container'];
                        hideIds.forEach(id => {
                            const el = clonedDoc.getElementById(id);
                            if (el) el.classList.add('hidden');
                        });
                    }
                }
            }).then(canvas => {
                const link = document.createElement('a');
                link.download = 'ni-analysis-result.png';
                link.href = canvas.toDataURL('image/png');
                link.click();
                
                if (actionBtns) actionBtns.style.display = 'flex';
                if (restartBtn) restartBtn.style.display = 'block';
                if (headerDesc) headerDesc.style.display = 'block';
                if (panelNav) panelNav.style.display = 'flex'; 
                if (logContainer) logContainer.style.display = 'block'; 

                panel.style.height = originalHeight;
                panel.style.maxHeight = originalMaxHeight;
                panel.style.overflowY = originalOverflow;
                window.scrollTo(0, scrollTop);

                showToast("保存が完了しました！");
            });
        }, 100); 
    });

    document.getElementById('share-btn').addEventListener('click', () => {
        const mbti = document.getElementById('mbti-percent').innerText;
        const socio = document.getElementById('socio-percent').innerText;
        const unique = document.getElementById('unique-percent').innerText;
        const shareText = `🦋 2つの「直観(Ni)」分析 🦋\n私の思考傾向は ${finalJudgementText} でした！\n\n構造・直感(MBTI): ${mbti}\n時間・流れ(Socio): ${socio}\n独自視点: ${unique}\n\n#2つの直観分析\nhttps://mofu-mitsu.github.io/ni-analysis/`;
        
        if (navigator.share) {
            navigator.share({ title: 'MBTIとソシオニクス 2つの「直観(Ni)」分析', text: shareText, url: 'https://mofu-mitsu.github.io/ni-analysis/' }).catch(console.error);
        } else {
            navigator.clipboard.writeText(shareText).then(() => showToast("コピーしました！")).catch(() => showToast("シェア機能非対応です"));
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
