document.addEventListener('DOMContentLoaded', function() {
    let resetTimer = null; // タイマーIDを保存する変数
    let isIdle = true; // ゲーム中ではない場合にtrue。
    // ワードバンク定義
    const wordbank = [
        ['ねこ', 'ヒョウ'],
        ['ゴリラ', 'オランウータン'],
        ['馬', 'ロバ'],
        ['犬', 'オオカミ'],
        ['羊', 'ヤギ'],
        ['ネズミ', 'リス'],
        ['ハンバーグ', 'ステーキ'],
        ['そば', 'うどん'],
        ['コロッケ', 'メンチカツ'],
        ['とりのからあげ', 'フライドチキン'],
        ['フライドポテト', 'ポテトサラダ'],
        ['きゅうり', 'ズッキーニ'],
        ['クッキー', 'ビスケット'],
        ['目玉焼き', 'たまご焼き'],
        ['牛乳', '豆乳'],
        ['たし算', 'かけ算'],
        ['スニーカー', 'サンダル'],
        ['ジャングルジム', 'すべり台'],
        ['家庭科室', '理科室'],
        ['えんぴつ', '色えんぴつ'],
        ['プール', '温泉'],
        ['紅茶', 'ほうじ茶'],
    ];
    let wordstage = []; // 残りの単語ストック
    let normalWord = '';
    let falseWord = '';
    let words = [];
    // 配列をシャッフルする関数（Fisher-Yates方式）
    function shuffle(array) {
        const arr = array.slice(); // 元を壊さない
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    function reset() {

        let selectedValue = parseInt($('input[name="attendCount"]:checked').val(), 10)|| 0;;

        // ボタン表示非表示
        $('button[id^="button-"]').each(function() {
            const pt = parseInt($(this).attr('data-index'), 10);
            
            if (pt < selectedValue) {
                $(this).parent().removeClass('d-none');
            } else {
                $(this).parent().addClass('d-none');
            }
        });

        // 人数が選ばれていない場合は説明文を表示して抜ける
        if (selectedValue <= 0) {
            $('div#explanation').removeClass('d-none');
            isIdle = true;
            return;
        }

        // wordstageが空ならwordbankを再シャッフル
        if (wordstage.length === 0) {
            wordstage = shuffle(wordbank);
            // console.log('wordstageを再生成:', wordstage);
        }

        // ステージから1組取り出し
        const pair = wordstage.pop();

        // どちらをfalseWordにするかランダムで決める
        if (Math.random() < 0.5) {
            normalWord = pair[0];
            falseWord = pair[1];
        } else {
            normalWord = pair[1];
            falseWord = pair[0];
        }

        // console.log('選ばれたペア:', pair);
        // console.log('normal:', normalWord, 'false:', falseWord);

        words = Array(selectedValue).fill(normalWord); // すべてnormalWordで初期化
        const falseIndex = Math.floor(Math.random() * selectedValue); // ランダム位置を1つ選ぶ
        words[falseIndex] = falseWord; // その位置をfalseWordに
        
        // 説明の非表示
        $('div#explanation').addClass('d-none');
        isIdle = false;
    }

    // 初期リセット
    reset();

    $('button[id^="button-"]').on('click', function() {
        // 全部表示が押された後ならボタン無効
        if (isIdle) {
            return;
        }

        const $btn = $(this);

        // タイマーが動いていれば破棄
        if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
        }

        // 他のボタンをすべてOFF
        $('button[id^="button-"]').not($btn).removeClass('active').attr('aria-pressed', 'false').each(function() {
        $(this).html($(this).attr('id').replace('button-', ''));
        });

        if ($btn.hasClass('active')) {
            // 割り当てられたワードを表示
            const pt = parseInt($(this).attr('data-index'), 10);
            $btn.html(words[pt]);

            resetTimer = setTimeout(function() {
                // ボタンを非アクティブに戻す
                $btn.removeClass('active').attr('aria-pressed', 'false');
                $btn.html($btn.attr('id').replace('button-', ''));
                resetTimer = null; // 終了後にクリア
            }, 5000);
        } else {
            $btn.html($btn.attr('id').replace('button-', ''));
        }

    });
    $('button#start').on('click', function() {

        const $btn = $(this);

        // タイマーが動いていれば破棄
        if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
        }
        
        if (isIdle || confirm('最初からやりなおしますか？')) {
            // すべてOFF
            $('button[id^="button-"]').removeClass('active').removeClass('falseword').attr('aria-pressed', 'false').each(function() {
                $(this).html($(this).attr('id').replace('button-', ''));
            });

            // 人数のボタン分だけリセット
            reset();
        }

    });
    $('button#showall').on('click', function() {
        const $btn = $(this);

        // タイマーが動いていれば破棄
        if (resetTimer) {
            clearTimeout(resetTimer);
            resetTimer = null;
        }

        // すべてON
        $('[id^="button-"]').addClass('active').attr('aria-pressed', 'true').each(function() {
            // 割り当てられたワードを表示
            const pt = parseInt($(this).attr('data-index'), 10);
            $(this).html(words[pt]);
            // はずれワードの場合
            if (falseWord === words[pt]) {
                $(this).addClass('falseword');
            }
        });

        isIdle = true;

    });
});