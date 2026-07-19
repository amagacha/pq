// ========================================
// 変数
// ========================================

let questions = [];

let currentQuestion = null;

let score = 0;

let questionNumber = 0;

let answered = false;


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
        .innerHTML = svg;


    const map =
        document.querySelector(
            "#map svg"
        );


    // 県名ツールチップを削除

    map

        .querySelectorAll(
            "title, desc"
        )

        .forEach(
            element => {

                element.remove();

            }
        );


    // 都道府県の基本設定

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

                    "#6f86b6";


                prefecture.style.stroke =

                    "#263b70";

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
// ドロップダウンを作成
// ========================================

function createDropdown() {

    const dropdown =

        document

            .getElementById(
                "dropdown"
            );


    dropdown.innerHTML = "";


    questions

        .forEach(
            question => {

                const option =

                    document

                        .createElement(
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

        document

            .getElementById(
                "dropdown"
            );


    dropdown.classList.add(

        "show"

    );


    filterDropdown();

}


// ========================================
// ドロップダウンを閉じる
// ========================================

function closeDropdown() {

    const dropdown =

        document

            .getElementById(
                "dropdown"
            );


    dropdown.classList.remove(

        "show"

    );

}


// ========================================
// 入力文字で候補を絞り込む
// ========================================

function filterDropdown() {

    const input =

        document

            .getElementById(
                "answer"
            );


    const keyword =

        input

            .value

            .toLowerCase();


    const options =

        document

            .querySelectorAll(
                ".dropdown-option"
            );


    options

        .forEach(
            option => {

                const name =

                    option

                        .textContent

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
// コンボボタン
// ========================================

document

    .getElementById(
        "comboButton"
    )

    .addEventListener(

        "click",

        () => {

            const dropdown =

                document

                    .getElementById(
                        "dropdown"
                    );


            if (

                dropdown

                    .classList

                    .contains(
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
// 入力時
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
// 入力欄をクリック
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
// 外側をクリックしたら閉じる
// ========================================

document

    .addEventListener(

        "click",

        event => {

            const comboBox =

                document

                    .querySelector(
                        ".combo-box"
                    );


            if (

                !comboBox

                    .contains(
                        event.target
                    )

            ) {

                closeDropdown();

            }

        }

    );


// ========================================
// 新しい問題
// ========================================

function newQuestion() {

    const prefectures =

        document

            .querySelectorAll(

                "#map svg .prefecture"

            );


    prefectures

        .forEach(

            prefecture => {

                prefecture

                    .classList

                    .remove(
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

        document

            .querySelector(

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


    target

        .classList

        .add(
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

        document

            .getElementById(

                "answer"

            );


    answer.value = "";

    answer.disabled = false;


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

        .textContent = "";


    document

        .getElementById(

            "result"

        )

        .className =

        "result";


    answered = false;


    closeDropdown();

}


// ========================================
// 回答
// ========================================

function answerQuestion() {

    if (

        answered

    ) {

        return;

    }


    const answer =

        document

            .getElementById(

                "answer"

            );


    const userAnswer =

        answer.value.trim();


    if (

        !userAnswer

    ) {

        return;

    }


    answered = true;


    answer.disabled = true;


    document

        .getElementById(

            "comboButton"

        )

        .disabled = true;


    document

        .getElementById(

            "answerButton"

        )

        .style.display =

        "none";


    closeDropdown();


    const result =

        document

            .getElementById(

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
// 次の問題
// ========================================

document

    .getElementById(

        "nextButton"

    )

    .addEventListener(

        "click",

        () => {

            document

                .getElementById(

                    "comboButton"

                )

                .disabled =

                false;


            newQuestion();

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
// ゲーム開始
// ========================================

async function startGame() {

    try {

        await loadMap();

        await loadQuestions();

        newQuestion();

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