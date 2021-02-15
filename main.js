// 'use strict';
//メイン関連

//デバッグのフラグ
const DEBUG=false;
//1秒間の計測の描画
let drawCount=0;
let fps=0;
let lastTime=Date.now();//時刻をms単位で取得

//スムージング
const SMOOTHING=false;//デフォルトでtrue

//ゲームスピード(ms)
const Game_Speed=1000/60;//秒間60回

//スクリーンサイズ
const Screen_w=320;
const Screen_h=320;

//キャンバスサイズ
const Canvas_w=Screen_w*2;//640
const Canvas_h=Screen_h*2;//640

//フィールドサイズ
const Field_w=Screen_w+120;//440
const Field_h=Screen_h+40;//360


//カメラの座標
let camera_x=0;
let camera_y=0;

//星の実態
let star=[];

//星の数
const star_max=300;

//キーボードの状態
let key=[];

//---------------オブジェクト達-----------------
let enemy=[];
let enemybullet=[];
let bullet=[];
let expl=[];
let machine=new Machine();

//-----------ファイル読み込み------------
let spriteImage=new Image();//Imageオブジェクト
spriteImage.src="sprite.png";//画像の読み込み


//------------キャンバス---------------
let can=document.getElementById("can");//HTMLElementのcanからエレメントを取得
let con=can.getContext("2d");//canから2d（３Dとかそれ）のコンテキスト（this）を取得
can.width=Canvas_w;//キャンバスの幅指定
can.height=Canvas_h;//キャンバスの高さ指定
con.font="20px 'Impact'";//フォントインパクト


//----------------スムージング（画質をよくする）-------------------
con.garbledSmoothingEnagbled=SMOOTHING;//garbled=文字化け
con.webkitimageSmoothingEnabled=SMOOTHING
con.msimageSmoothingEnabled=SMOOTHING
con.imageSmoothingEnabled=SMOOTHING



//-------------フィールド（仮装画面）-------------
let vcan=document.createElement("canvas")//画面には出ないcanvasの構築//"canvas"はHTMLで作ってないからここで作った。
let vcon=vcan.getContext("2d");//vcanから2d（３Dとかそれ）のコンテキスト（this）を取得
vcan.width=Field_w;//フィールドの幅指定
vcan.height=Field_h;//フィールドの高さ指定
con.font="12px 'Impact'";//フォントインパクト


//---------------------ゲームオーバーフラグ-----------------------
let gameOver=false;
let score=0;

///
let bossHP=0;
let bossMHP=0;

//-------------ゲーム初期化-----------------
function gameInit(){
  for(let i=0; i<star_max; i++){//300個星表示
    star[i]=new Star();//星のクラスの呼び出し・表示
  }
  setInterval(gameLoop,Game_Speed);//1秒間に60回のスピードで更新
};

//-----------------全てのオブジェクトアップデート-----------------------
function updateObj(obj){
  for(let i=obj.length-1; i>=0; i--){//消した以降の要素番号が変わるため、逆から攻めてる
    obj[i].update();//objのアップデート
    if(obj[i].kill)obj.splice(i,1);//objの消去
  }
}
//------------------全てのオブジェクト描画---------------------
function drawObj(obj){
  for(let i=0; i<obj.length; i++){
    obj[i].draw();//objメソッドの呼び出し
    }
}


//--------------------移動更新の処理-----------------------
function updateAll(){
  updateObj(star);//星のアップデート
  updateObj(bullet);//弾のアップデート
  updateObj(enemybullet);//敵の弾アップデート
  updateObj(enemy);//敵のアップデート
  updateObj(expl);//爆発のアップデート
  if(!gameOver)machine.update();//フラグが立ってない時、自機のupdateメソッド読み込み//!は立っていないの意
}

//--------------------描画の処理------------------------
function drawAll(){
  vcon.fillStyle=(machine.damage)?"red":"black";//背景の設置//ダメージあるときはRED
  vcon.fillRect(camera_x,camera_y,Screen_w,Screen_h);//スクリーンサイズで表示

  drawObj(star);//星の描画（一番奥　）
  drawObj(bullet);//弾の描画（２番目に奥）
  if(!gameOver)machine.draw();//gameOverのフラグが立ってない時に自機描写（３番目に奥）

  drawObj(enemy);//敵の描画（4番目に奥）
  drawObj(expl);//爆発の描画（5番目に奥）
  drawObj(enemybullet);//敵の弾描画（6番目に奥）
  

 //自機の範囲０〜（Field_w）
 //カメラの範囲０〜（Field_w-Screen_w）
 camera_x=Math.floor((machine.x>>8)/Field_w*(Field_w-Screen_w));
 camera_y=Math.floor((machine.y>>8)/Field_h*(Field_h-Screen_h));

 //ボスのhp表示
 if( bossHP>0 )
 {
   let sz  = (Screen_w-20)*bossHP/bossMHP;
   let sz2 = (Screen_w-20);
   
   vcon.fillStyle="rgba(255,0,0,0.5)";
   vcon.fillRect(camera_x+10,camera_y+10,sz,10);
   vcon.strokeStyle="rgba(255,0,0,0.9)";
   vcon.strokeRect(camera_x+10,camera_y+10,sz2,10);
 }

 //自機のhp表示
 if( machine.hp>0 )
 {
   let sz  = (Screen_w-20)*machine.hp/machine.mhp;
   let sz2 = (Screen_w-20);
   
   vcon.fillStyle="rgba(0,0,255,0.5)";
   vcon.fillRect(camera_x+10,camera_y+Screen_h-14,sz,10);
   vcon.strokeStyle="rgba(0,0,255,0.9)";
   vcon.strokeRect(camera_x+10,camera_y+Screen_h-14,sz2,10);
 }

 //スコア表示
 vcon.fillStyle="white";
 vcon.fillText("SCORE"+score,camera_x+10,camera_y+14);


  //仮装画面から実際のキャンバスにコピー
  con.drawImage(vcan,camera_x,camera_y,Screen_w,Screen_h,
    0,0,Canvas_w,Canvas_h);//使用範囲と配置位置を指定して、キャンバスにコピーを表示
}

//--------------------情報の表示-----------------------
function putInfo(){

  con.fillStyle ="white";
  //ゲームオーバーの表示
  if(gameOver){//gameOverフラグが立った時
    let s="Game Over"
    let w=con.measureText(s).width;
    let x=Canvas_w/2 - w/2;//キャンバスサイズの半分ー文字の半分
    let y=Canvas_h/2 - 20;
    con.fillText(s,x,y);
    s="Push 'R' key to restart"
    w=con.measureText(s).width;
    x=Canvas_w/2 - w/2;//キャンバスサイズの半分ー文字の半分
    y=Canvas_h/2;
    con.fillText(s,x,y);
  }


    //デバッグというフラグ
    if(DEBUG)
    {
     drawCount++;
     if( lastTime +1000 <= Date.now() )
     {
       fps=drawCount;
       drawCount=0;
       lastTime=Date.now();
     }
     

     con.fillText("FPS :"+fps,20,20);
     con.fillText("Bullet:"+bullet.length,20,40);
     con.fillText("Enemy:"+enemy.length,20,60);
     con.fillText("EnemyBullet:"+enemybullet.length,20,80);
     con.fillText("X:"+(machine.x>>8),20,120);
     con.fillText("Y:"+(machine.y>>8),20,140);
     con.fillText("HP:"+machine.hp,20,160); //fillText(表示する関数,表示位置横,表示位置縦)
     con.fillText("Score:"+score,20,180); //fillText(表示する関数,表示位置横,表示位置縦)
     con.fillText("COUNT:"+gameCount,20,200);
     con.fillText("WAVE:"+gameWave,20,220);
     }
}

//ゲームループ内の処理に使う
let gameCount    =0;
let gameWave     =0;
let gameRound   =0;

let starSpeed       =100;//星の速さ
let starSpeedReq =100;//星の速さ(requiest)
//------------ゲームループ（60fps（１秒間に60回画面の更新を行う））------------
function gameLoop(){

  gameCount++;
  if(starSpeedReq > starSpeed)starSpeed++;//reqの方が大きければ、足していく
  if(starSpeedReq < starSpeed)starSpeed--;//

//----------------------敵を出す----------------------
//ピンクヒヨコ
if(gameWave==0){
  if(rand(0,15)==1){
    enemy.push(new Enemy(0,rand(0,Field_w)<<8,0,0,rand(300,1200)));
  }
  if(gameCount > 60*20){//20秒経ったら
    gameWave++;//次のwaveに進む
    gameCount = 0;//countは0になる
    starSpeedReq =100;//星の速さ
  }
}
//黄色ヒヨコ
else if(gameWave==1){
  if(rand(0,15)==1){
    enemy.push(new Enemy(1,rand(0,Field_w)<<8,0,0,rand(300,1200)));
  }
  if(gameCount > 60*20){//20秒経ったら
    gameWave++;//次のwaveに進む
    gameCount = 0;//countは0になる
    starSpeedReq =300;//星の速さ
  }
}
//ピンクヒヨコと黄色ヒヨコ
else if(gameWave==2){
  if(rand(0,10)==1){
    let r = rand(0,1);//敵を両方出す
    enemy.push(new Enemy(r,rand(0,Field_w)<<8,0,0,rand(300,1200)));
  }
  if(gameCount > 60*20){//20秒経ったら
    gameWave++;//次のwaveに進む
    gameCount = 0;//countは0になる
    enemy.push(new Enemy(2,(Field_w/2)<<8,-(70<<8),0,200));
    starSpeedReq =600;//星の速さ
  }
}
//ボス
else if(gameWave==3){
  if(enemy.length==0){//敵の配列が無くなったら
    gameWave=0;
    gameCount=0;
    gameRound++;
    starSpeedReq =100;//星の速さ
  }
}


  //関数の呼び出し
  updateAll();
  drawAll();
  putInfo();
}



//----------------オンロードでゲーム開始-----------------
window.onload=function(){
  gameInit();//初期化関数
  // enemy.push(new Enemy(2,(Field_w/2)<<8,0,0,200));
}


//メソッドはオブジェクト内の（プロパティ：値）の値の部分が関数になっているもののことを言う
//メソッドはオブジェクト.プロパティ名で呼び出しできる
