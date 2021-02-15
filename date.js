// 'use strict';
//データ関連

//--------------------敵マスター-----------------------
class EnemyMaster{
  constructor(enenum,r,hp,score){
    this.enenum=enenum;
    this.r=r;
    this.hp=hp;
    this.score=score;
  }
};

let enemyMaster=[
  new EnemyMaster(0,10,1,            100),//0,ピンクひよこ
  new EnemyMaster(1,10,1,            100),//1,黄色ひよこ
  new EnemyMaster(2,70,3000,10000),//2,ボス黄色ひよこ
  new EnemyMaster(3,10,1,              10),//3,ボスの配下ひよこ
];

//------------スプライトクラス（オブジェクト）------------
class Sprite{//スプライトクラスはオブジェクトとして使える
  constructor(x,y,w,h){//メソッド名constructorでコンストラクタを定義
    this.x=x;
    this.y=y;
    this.w=w;
    this.h=h;
  }
};

//------------スプライトの情報（データの用意）-------------
let sprite=[
  //newでインスタンス化（コピー化）する
  new Sprite(    0,0,22,42),//0,自機　左2
  new Sprite(  23,0,33,42),//1,自機　左1
  new Sprite(  57,0,43,42),//2,自機　正面
  new Sprite(101,0,33,42),//3,自機　右1
  new Sprite(135,0,21,42),//4,自機　右2

  new Sprite(    0,50,3,7),//5,弾1
  new Sprite(    4,50,5,5),//6,弾2

  new Sprite(3,42,16,5),//7噴射左2
  new Sprite(29,42,21,5),//8噴射左1
  new Sprite(69,42,19,5),//9噴射正面
  new Sprite(108,42,21,5),//10噴射右1
  new Sprite(138,42,16,5),//11噴射右2

  new Sprite(11,50,7,7),//12敵弾1−1
  new Sprite(19,50,7,7),//13敵弾1−2
  new Sprite(32,49,8,8),//14敵弾2-1
  new Sprite(42,47,12,12),//15敵弾2−2

  new Sprite(5,351,9,9),//16爆発1
  new Sprite(21,346,20,20),//17爆発2
  new Sprite(46,343,29,27),//18爆発3
  new Sprite(80,343,33,30),//19爆発4
  new Sprite(117,340,36,33),//20爆発5
  new Sprite(153,340,36,33),//21爆発6
  new Sprite(191,341,25,31),//22爆発7
  new Sprite(216,349,19,16),//23爆発8
  new Sprite(241,350,15,14),//24爆発9
  new Sprite(259,350,14,13),//25爆発10
  new Sprite(276,351,13,12),//26爆発11

  new Sprite(6,373,9,9),//27ヒット1
  new Sprite(19,371,16,15),//28ヒット2
  new Sprite(38,373,11,12),//29ヒット3
  new Sprite(54,372,17,17),//30ヒット4
  new Sprite(75,374,13,14),//31ヒット5


  new Sprite(4,62,24,27),//32黄色1
  new Sprite(36,62,24,27),//33黄色2
  new Sprite(68,62,24,27),//34黄色3
  new Sprite(100,62,24,27),//35黄色4
  new Sprite(133,62,24,27),//36黄色5
  new Sprite(161,62,30,27),//37黄色6

  new Sprite(4,95,24,26),//38ピンク1
  new Sprite(36,95,24,26),//39ピンク2
  new Sprite(68,95,24,26),//40ピンク3
  new Sprite(100,95,24,26),//41ピンク4
  new Sprite(133,92,24,29),//42ピンク5
  new Sprite(161,95,30,26),//43ピンク6

  new Sprite(4,125,24,29),//44青グラサン1
  new Sprite(36,125,24,29),//45青グラサン2
  new Sprite(68,125,24,29),//46青グラサン3
  new Sprite(100,125,24,30),//47青グラサン4
  new Sprite(133,124,24,30),//48青グラサン5
  new Sprite(161,125,30,29),//49青グラサン6

  new Sprite(4,160,25,27),//50ロボ1
  new Sprite(34,160,26,27),//51ロボ2
  new Sprite(66,160,26,27),//52ロボ3
  new Sprite(98,160,26,27),//53ロボ4
  new Sprite(132,160,26,27),//54ロボ5
  new Sprite(161,158,30,29),//55ロボ6

  new Sprite(4,194,24,28),//56にわとり1
  new Sprite(36,194,24,28),//57にわとり2
  new Sprite(68,194,24,28),//58にわとり3
  new Sprite(100,194,24,28),//59にわとり4
  new Sprite(133,194,24,30),//60にわとり5
  new Sprite(161,194,30,28),//61にわとり6

  new Sprite(4,230,22,26),//62たまご1
  new Sprite(41,230,22,26),//63たまご2
  new Sprite(73,230,22,26),//64たまご3
  new Sprite(105,230,22,26),//65たまご4
  new Sprite(137,230,22,26),//66たまご5

  new Sprite(6,261,24,28),//67殻帽ヒヨコ1
  new Sprite(38,261,24,28),//68殻帽ヒヨコ2
  new Sprite(70,261,24,28),//69殻帽ヒヨコ3
  new Sprite(102,262,24,28),//70殻帽ヒヨコ4
  new Sprite(135,261,24,28),//71殻帽ヒヨコ5

  new Sprite(206,58,69,73),//72黄色（中）
  new Sprite(204,134,69,73),//73ピンク（中）
  new Sprite(205,212,69,78),//74青グラサン（中）

  new Sprite(337,0,139,147),//75黄色（大）
  new Sprite(336,151,139,147),//76ピンク（大）
  new Sprite(336,301,139,155),//77青グラサン（大）
];
