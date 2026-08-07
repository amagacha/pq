// ========================================
// 都道府県クイズ
// ========================================


// ========================================
// 変数
// ========================================

let questions = [];

let currentQuestion = null;

let score = 0;

let questionNumber = 0;

let answered = false;


// ========================================
// ローカルストレージ
// ========================================

const SAVE_KEY =
    "prefectureQuizProgress";


// ========================================
// 地図を読み込む
// ========================================

async function loadMap() {

    const response =
        await fetch(
            "map.svg"
        );


    const svg =
        await response.text();


    document
        .getElementById(
            "map"
        )
        .innerHTML =
        svg;


    const map =
        document.querySelector(
            "#map svg"
        );


    map
        .querySelectorAll(
            "title, desc"
        )
        .forEach(
            element => {

                element.remove();

            }
        );


    map
        .querySelectorAll(
            ".prefecture"
        )
        .forEach(
            prefecture => {

                prefecture
                    .removeAttribute(
                        "title"
                    );


                prefecture
                    .removeAttribute(
                        "aria-label"
                    );


                prefecture.style.fill =
                    "#53678d";


                prefecture.style.stroke =
                    "#17213a";

            }
        );

}


// ========================================
// 問題を読み込む
// ========================================

async function loadQuestions() {

    const response =
        await fetch(
            "question.json"
        );


    questions =
        await response.json();


    createDropdown();

}


// ========================================
// ドロップダウン作成
// ========================================

function createDropdown() {

    const dropdown =
        document.getElementById(
            "dropdown"
        );


    dropdown.innerHTML =
        "";


    questions.forEach(
        question => {


            const option =
                document.createElement(
                    "div"
                );


            option.className =
                "dropdown-option";


            option.textContent =
                question.name;


            option.dataset.value =
                question.name;


            option.addEventListener(
                "click",
                () => {


                    document
                        .getElementById(
                            "answer"
                        )
                        .value =
                        question.name;


                    closeDropdown();

                }
            );


            dropdown.appendChild(
                option
            );

        }
    );

}


// ========================================
// ドロップダウンを開く
// ========================================

function openDropdown() {


    const dropdown =
        document.getElementById(
            "dropdown"
        );


    const comboBox =
        document.querySelector(
            ".combo-box"
        );


    const rect =
        comboBox.getBoundingClientRect();


    dropdown.classList.add(
        "show"
    );


    const windowHeight =
        window.innerHeight;


    const margin =
        8;


    const maxHeight =
        240;


    const spaceBelow =
        windowHeight -
        rect.bottom -
        margin;


    const spaceAbove =
        rect.top -
        margin;


    let dropdownHeight;


    if (
        spaceBelow >=
        maxHeight
    ) {


        dropdownHeight =
            maxHeight;


        dropdown.style.top =
            `${rect.bottom + margin}px`;

    }


    else if (
        spaceAbove >=
        maxHeight
    ) {


        dropdownHeight =
            maxHeight;


        dropdown.style.top =
            `${rect.top - dropdownHeight - margin}px`;

    }


    else if (
        spaceBelow >=
        spaceAbove
    ) {


        dropdownHeight =
            Math.max(
                spaceBelow,
                80
            );


        dropdown.style.top =
            `${rect.bottom + margin}px`;

    }


    else {


        dropdownHeight =
            Math.max(
                spaceAbove,
                80
            );


        dropdown.style.top =
            `${rect.top - dropdownHeight - margin}px`;

    }


    dropdown.style.maxHeight =
        `${dropdownHeight}px`;


    dropdown.style.left =
        `${rect.left}px`;


    dropdown.style.width =
        `${rect.width}px`;


    filterDropdown();

}


// ========================================
// ドロップダウンを閉じる
// ========================================

function closeDropdown() {

    const dropdown =
        document.getElementById(
            "dropdown"
        );


    dropdown.classList.remove(
        "show"
    );

}


// ========================================
// ドロップダウン検索
// ========================================

function filterDropdown() {


    const input =
        document.getElementById(
            "answer"
        );


    const keyword =
        input.value.toLowerCase();


    const options =
        document.querySelectorAll(
            ".dropdown-option"
        );


    options.forEach(
        option => {


            const name =
                option.textContent
                    .toLowerCase();


            if (
                name.includes(
                    keyword
                )
            ) {


                option.style.display =
                    "block";

            }


            else {


                option.style.display =
                    "none";

            }

        }
    );

}


// ========================================
// 新しい問題
// ========================================

function newQuestion() {


    const prefectures =
        document.querySelectorAll(
            "#map svg .prefecture"
        );


    prefectures.forEach(
        prefecture => {


            prefecture.classList.remove(
                "target"
            );

        }
    );


    currentQuestion =
        questions[
            Math.floor(
                Math.random() *
                questions.length
            )
        ];


    const target =
        document.querySelector(
            `#map svg .prefecture[data-code="${currentQuestion.code}"]`
        );


    if (
        !target
    ) {


        console.error(
            "地図に見つからない都道府県:",
            currentQuestion
        );


        newQuestion();


        return;

    }


    target.classList.add(
        "target"
    );


    questionNumber++;


    document
        .getElementById(
            "questionNumber"
        )
        .textContent =
        `第${questionNumber}問`;


    const answer =
        document.getElementById(
            "answer"
        );


    answer.value =
        "";


    answer.disabled =
        false;


    document
        .getElementById(
            "comboButton"
        )
        .disabled =
        false;


    document
        .getElementById(
            "answerButton"
        )
        .style.display =
        "block";


    document
        .getElementById(
            "nextButton"
        )
        .style.display =
        "none";


    document
        .getElementById(
            "result"
        )
        .textContent =
        "";


    document
        .getElementById(
            "result"
        )
        .className =
        "result";


    answered =
        false;


    closeDropdown();

}


// ========================================
// 回答する
// ========================================

function answerQuestion() {


    if (
        answered
    ) {

        return;

    }


    const answer =
        document.getElementById(
            "answer"
        );


    const userAnswer =
        answer.value.trim();


    if (
        !userAnswer
    ) {

        return;

    }


    answered =
        true;


    answer.disabled =
        true;


    document
        .getElementById(
            "comboButton"
        )
        .disabled =
        true;


    document
        .getElementById(
            "answerButton"
        )
        .style.display =
        "none";


    closeDropdown();


    const result =
        document.getElementById(
            "result"
        );


    if (
        userAnswer ===
        currentQuestion.name
    ) {


        score++;


        document
            .getElementById(
                "score"
            )
            .textContent =
            score;


        result.textContent =
            "🎉 正解！！";


        result.classList.add(
            "correct"
        );

    }


    else {


        result.textContent =
            `❌ 不正解！正解は「${currentQuestion.name}」`;


        result.classList.add(
            "wrong"
        );

    }


    document
        .getElementById(
            "nextButton"
        )
        .style.display =
        "block";

}


// ========================================
// 進捗を保存
// ========================================

function saveProgress() {


    if (
        !currentQuestion
    ) {

        alert(
            "まだ保存できる進捗がありません。"
        );


        return;

    }


    const progress = {


        score:
            score,


        questionNumber:
            questionNumber,


        currentQuestion:
            currentQuestion,


        answered:
            answered

    };


    localStorage.setItem(

        SAVE_KEY,

        JSON.stringify(
            progress
        )

    );


    alert(
        "💾 進捗を保存しました！"
    );

}


// ========================================
// 進捗を読み込む
// ========================================

function loadProgress() {


    const savedProgress =
        localStorage.getItem(
            SAVE_KEY
        );


    if (
        !savedProgress
    ) {

        return false;

    }


    try {


        const progress =
            JSON.parse(
                savedProgress
            );


        score =
            progress.score;


        questionNumber =
            progress.questionNumber;


        currentQuestion =
            progress.currentQuestion;


        answered =
            progress.answered;


        const target =
            document.querySelector(
                `#map svg .prefecture[data-code="${currentQuestion.code}"]`
            );


        if (
            !target
        ) {

            return false;

        }


        target.classList.add(
            "target"
        );


        document
            .getElementById(
                "score"
            )
            .textContent =
            score;


        document
            .getElementById(
                "questionNumber"
            )
            .textContent =
            `第${questionNumber}問`;


        if (
            answered
        ) {


            document
                .getElementById(
                    "answer"
                )
                .disabled =
                true;


            document
                .getElementById(
                    "comboButton"
                )
                .disabled =
                true;


            document
                .getElementById(
                    "answerButton"
                )
                .style.display =
                "none";


            document
                .getElementById(
                    "nextButton"
                )
                .style.display =
                "block";

        }


        return true;

    }


    catch (
        error
    ) {


        console.error(
            "進捗の読み込みに失敗しました:",
            error
        );


        return false;

    }

}


// ========================================
// 進捗を削除
// ========================================

function deleteProgress() {


    const savedProgress =
        localStorage.getItem(
            SAVE_KEY
        );


    if (
        !savedProgress
    ) {


        alert(
            "保存されている進捗はありません。"
        );


        return;

    }


    const confirmed =
        confirm(

            "⚠️ 本当に進捗を削除しますか？\n\n保存したスコアや問題数もすべて削除されます。"

        );


    if (
        !confirmed
    ) {

        return;

    }


    localStorage.removeItem(
        SAVE_KEY
    );


    alert(
        "🗑️ 進捗を削除しました！"
    );


    location.reload();

}


// ========================================
// ▼ボタン
// ========================================

document
    .getElementById(
        "comboButton"
    )
    .addEventListener(
        "click",
        event => {


            event.stopPropagation();


            const dropdown =
                document.getElementById(
                    "dropdown"
                );


            if (
                dropdown.classList.contains(
                    "show"
                )
            ) {


                closeDropdown();

            }


            else {


                openDropdown();

            }

        }
    );


// ========================================
// 入力
// ========================================

document
    .getElementById(
        "answer"
    )
    .addEventListener(
        "input",
        () => {


            openDropdown();

        }
    );


// ========================================
// フォーカス
// ========================================

document
    .getElementById(
        "answer"
    )
    .addEventListener(
        "focus",
        () => {


            openDropdown();

        }
    );


// ========================================
// 外側クリック
// ========================================

document
    .addEventListener(
        "click",
        event => {


            const comboBox =
                document.querySelector(
                    ".combo-box"
                );


            if (
                !comboBox.contains(
                    event.target
                )
            ) {


                closeDropdown();

            }

        }
    );


// ========================================
// 回答ボタン
// ========================================

document
    .getElementById(
        "answerButton"
    )
    .addEventListener(
        "click",
        answerQuestion
    );


// ========================================
// 次の問題
// ========================================

document
    .getElementById(
        "nextButton"
    )
    .addEventListener(
        "click",
        () => {


            newQuestion();

        }
    );


// ========================================
// Enterキー
// ========================================

document
    .getElementById(
        "answer"
    )
    .addEventListener(
        "keydown",
        event => {


            if (
                event.key ===
                "Enter"
            ) {


                answerQuestion();

            }

        }
    );


// ========================================
// 保存ボタン
// ========================================

document
    .getElementById(
        "saveProgressButton"
    )
    .addEventListener(
        "click",
        saveProgress
    );


// ========================================
// 削除ボタン
// ========================================

document
    .getElementById(
        "deleteProgressButton"
    )
    .addEventListener(
        "click",
        deleteProgress
    );


// ========================================
// 画面サイズ変更
// ========================================

window
    .addEventListener(
        "resize",
        () => {


            const dropdown =
                document.getElementById(
                    "dropdown"
                );


            if (
                dropdown.classList.contains(
                    "show"
                )
            ) {


                openDropdown();

            }

        }
    );


// ========================================
// ゲーム開始
// ========================================

async function startGame() {


    try {


        await loadMap();


        await loadQuestions();


        const loaded =
            loadProgress();


        if (
            !loaded
        ) {


            newQuestion();

        }


    }


    catch (
        error
    ) {


        console.error(
            "ゲームの読み込みに失敗しました:",
            error
        );

    }

}


startGame();
