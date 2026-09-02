/* ===== 麻雀のいろは：おすすめ入門グッズ 共通データ =====
   Amazon（もしも）承認後の差し替え手順：
   1) 各商品の amazon プロパティに、もしもの「かんたんリンク」で発行した
      Amazon用URLを入れる（例: amazon:"https://al.dmm...もしも発行URL"）
   2) 何も変えなくてOK。amazon が入っている商品だけ
      「Amazonで見る」ボタンが自動で増える（併記カードになる）
   ※ PR表記はカード側で自動出力するので個別対応は不要

   🔴 楽天リンクを足すときは必ず計測ID `_RTLink143604`（mahjong）を入れる。
      形式: https://hb.afl.rakuten.co.jp/ichiba/{アフィリID}/_RTLink143604?pc={エンコード済み商品URL}&link_type=hybrid_url
      （下の rk() を通せば自動で付く。手書きで足すときは付け忘れに注意）
      これが無いと楽天のサイト別レポートに載らず、どのサイトの成果か分からなくなる。
      対応表＝~/Desktop/claude/affiliate_links.md の「楽天 計測ID（site_pointback_id）」節
*/
(function () {
  "use strict";
  var RAKUTEN_ID = "56850033.f41b8543.56850034.48ac58ba";
  function rk(url) {
    return "https://hb.afl.rakuten.co.jp/ichiba/" + RAKUTEN_ID + "/_RTLink143604?pc=" +
      encodeURIComponent(url) + "&link_type=hybrid_url";
  }

  var ITEMS = [
    {
      id: "book-nyumon",
      cat: "入門書",
      emoji: "📘",
      name: "マンガでわかる！東大式麻雀入門",
      author: "井出洋介",
      price: "1,265円",
      why: "本サイトの第1〜5課をそのまま紙で復習できる1冊。マンガ主体なので、ルールを人に説明できるレベルまで一気に上がります。まず買うならこれ。",
      forWhom: "ルールを一通り覚えた人の最初の1冊",
      rakuten: rk("https://item.rakuten.co.jp/book/5003986/"),
      amazon: ""
    },
    {
      id: "book-tensuu",
      cat: "入門書",
      emoji: "🧮",
      name: "マンガでわかる！東大式麻雀点数計算入門",
      author: "井出洋介",
      price: "990円",
      why: "第10課で「最初は覚えなくていい」とした点数計算の専門書。対人で何度か打って「自分で数えたい」と思ったタイミングで読むと、驚くほどすんなり入ります。",
      forWhom: "デビュー後、点数を自分で数えたくなったら",
      rakuten: rk("https://item.rakuten.co.jp/book/13011848/"),
      amazon: ""
    },
    {
      id: "book-pocket",
      cat: "入門書",
      emoji: "📗",
      name: "早わかり麻雀点数計算ポケット版",
      author: "狩野洋一",
      price: "660円",
      why: "ポケットサイズなので、雀荘や友人宅にそのまま持ち込めます。卓上でこっそり確認できるのが利点。上の1冊と迷ったら、携帯性重視ならこちら。",
      forWhom: "卓に持ち込める早見表が欲しい人",
      rakuten: rk("https://item.rakuten.co.jp/book/1146142/"),
      amazon: ""
    },
    {
      id: "set-mat",
      cat: "麻雀牌・マット",
      emoji: "🀄",
      name: "麻雀牌＋マット＋点棒 セット（キャリーバッグ付）",
      author: "手打ち用フルセット",
      price: "5,680円〜",
      why: "牌・マット・点棒・サイコロが全部入りで、届いたその日に友人4人で打てます。マットがあると牌の音が静かになり、家でも打ちやすい。最初の1セットは全部入りが確実です。",
      forWhom: "家で友人と打ちたい人の最初の1セット",
      rakuten: rk("https://item.rakuten.co.jp/ichitastore/mjpmatset/"),
      amazon: ""
    }
  ];

  function card(it) {
    var btns =
      '<a class="shop-btn rakuten" href="' + it.rakuten + '" target="_blank" rel="nofollow sponsored noopener">楽天で見る</a>' +
      (it.amazon
        ? '<a class="shop-btn amazon" href="' + it.amazon + '" target="_blank" rel="nofollow sponsored noopener">Amazonで見る</a>'
        : "");
    return '' +
      '<div class="shop-card">' +
        '<div class="shop-head"><span class="shop-emoji">' + it.emoji + '</span>' +
          '<div><div class="shop-name">' + it.name + '</div>' +
          '<div class="shop-meta">' + it.author + '　参考価格 ' + it.price + '</div></div></div>' +
        '<p class="shop-why">' + it.why + '</p>' +
        '<div class="shop-for">こんな人に：' + it.forWhom + '</div>' +
        '<div class="shop-btns">' + btns + '</div>' +
      '</div>';
  }

  window.MJ_SHOP = {
    items: ITEMS,
    byId: function (id) { for (var i = 0; i < ITEMS.length; i++) if (ITEMS[i].id === id) return ITEMS[i]; return null; },
    cardHTML: card,
    prNote: '<p class="shop-pr">本セクションには広告（アフィリエイトリンク）が含まれます。リンク経由で購入されると当サイトに収益が入りますが、価格は変わりません。紹介しているのは実際に初心者に薦められる品だけです。</p>',
    renderInto: function (el, ids) {
      if (!el) return;
      var list = ids ? ids.map(this.byId).filter(Boolean) : ITEMS;
      el.innerHTML = this.prNote + '<div class="shop-grid">' + list.map(card).join("") + '</div>';
    }
  };
})();
