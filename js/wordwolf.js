$(function(){
    var resetTimer = null; // タイマーIDを保存する変数
    var isClear = false; // ぜんぶひょうじボタンが押された
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
        ['たし算', 'かけ算'],
        ['スニーカー', 'サンダル'],
        ['ジャングルジム', 'すべり台'],
        ['家庭科室', '理科室'],
        ['えんぴつ', '色えんぴつ'],
        ['プール', '温泉'],
        ['分度器', '定規'],
    ];
    var normalWord = '';
    var falseWord = '';
    var words = [];
    
    function reset() {

        // ランダムに1組選ぶ
        const pair = wordbank[Math.floor(Math.random() * wordbank.length)];

        // どちらをfalseWordにするかランダムで決める
        if (Math.random() < 0.5) {
            normalWord = pair[0];
            falseWord = pair[1];
        } else {
            normalWord = pair[1];
            falseWord = pair[0];
        }

        const selectedValue = parseInt($('input[name="attendCount"]:checked').val(), 10);
        if (!selectedValue) {
            console.log('人数が選択されていません');
        } else {
            words = Array(selectedValue).fill(normalWord); // すべてnormalWordで初期化
            const falseIndex = Math.floor(Math.random() * selectedValue); // ランダム位置を1つ選ぶ
            words[falseIndex] = falseWord; // その位置をfalseWordに

            // ボタン表示非表示
            $('[id^="button-"]').each(function() {
                const pt = parseInt($(this).attr('data-index'), 10);
                
                if (pt < selectedValue) {
                    $(this).parent().removeClass('d-none');
                } else {
                    $(this).parent().addClass('d-none');
                }
            });
        }
        isClear = false;
    }

    // 初期リセット
    reset();

  $('[id^="button-"]').on('click', function() {
    // 全部表示が押された後ならボタン無効
    if (isClear) {
        return;
    }

    const $btn = $(this);

    // タイマーが動いていれば破棄
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }

    // 他のボタンをすべてOFF
    $('[id^="button-"]').not($btn).removeClass('active').attr('aria-pressed', 'false').each(function() {
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
  $('#reset').on('click', function() {

    const $btn = $(this);

    // タイマーが動いていれば破棄
    if (resetTimer) {
      clearTimeout(resetTimer);
      resetTimer = null;
    }
    
    if (isClear || confirm('最初からやりなおしますか？')) {
        // すべてOFF
        $('[id^="button-"]').removeClass('active').removeClass('falseword').attr('aria-pressed', 'false').each(function() {
            $(this).html($(this).attr('id').replace('button-', ''));
        });

        // 人数のボタン分だけリセット
        reset();
    }

  });
  $('#showall').on('click', function() {
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

    // リセットされるまで有効
    isClear = true;

  });
});