// 'use strict';
//その他、共通関数

//--------------星のクラス-----------------
class Star{//星の設定
  constructor(){//インスタンスを生成するときに実行したい、処理や設定を追加する機能
    this.x=rand(0,Field_w)<<8;//星のx座標//0〜320-0+1未満の整数+1をランダムに取得//8ビット左にシフト
    this.y=rand(0,Field_h)<<8;//星のy座標//0〜640-0+1未満の整数+1をランダムに取得//8ビット左にシフト
    this.vx=0;//星のxベクトル
    this.vy=rand(100,200);//星のyベクトル//0〜200-100+1未満の整数+1をランダムに取得
    this.sz=(2);//星のサイズ//2
  }
 //星の描画メソッド
  draw(){
    //無駄なフィールド部分の非表示
    let x=this.x>>8;//1/256倍
    let y=this.y>>8;//1/256倍
    if(x<camera_x || x>=camera_x+Screen_w//||はまたは（or）の意味
      ||y<camera_y || y>=camera_y+Screen_h)return;

    vcon.fillStyle=rand(0,2)!=0?"#66f":"#aef";//fillStyle属性で、スタイルの指定
    vcon.fillRect(this.x>>8,this.y>>8,this.sz,this.sz);//fillRectメソッドで塗り潰しの四角形を描く//8ビット右にシフト
  }
 //星の更新処理メソッド
  update(){
    this.x+=this.vx*starSpeed/100;//x座標にベクトル分を加える
    this.y+=this.vy*starSpeed/100;//y座標にベクトル分を加える
    if(this.y>Field_h<<8){//もし星のy座標が（8ビット左にシフトした状態で）フィールドの縦幅を超えた場合、
      this.y=0;//y座標は0に戻る
      this.x=rand(0,Field_w)<<8;//x座標はランダムに表示
    }
  }
}


//-------------キャラクターのベースクラス----------------
class CharaBase{
  constructor(snum,x,y,vx,vy){//キャラの初期位置を仮引数に設定
    //プロパティに保存
    this.sn  =snum;
    this.x   =x;
    this.y   =y;
    this.vx =vx;
    this.vy =vy;
    this.kill=false;//キャラを消すフラグ
    this.count=0;
  }
  //キャラの描画メソッド
  draw(){
    drawSprite(this.sn,this.x,this.y);
  }
  //キャラの更新メソッド
  update(){

    this.count++;//インクリメントする

    this.x+=this.vx;
    this.y+=this.vy;
      //キャラの消去//範囲外に出たときにキャラを消せ
      if( this.x+(100<<8)<0 || this.x-(100<<8)>Field_w<<8 || this.y+(100<<8)<0 || this.y-(100<<8)>Field_h<<8 ){
        this.kill = true;
      }
  }
}


//--------------------爆発のクラス---------------------
class Expl extends CharaBase{

  constructor(c,x,y,vx,vy){
    super(0,x,y,vx,vy);
    this.timer=c;
  }
  update(){
    if(this.timer){
      this.timer--;
      return;
    }
    super.update();
  }


  draw(){
    if(this.timer)return;
    this.sn=16+ (this.count>>2);
    if(this.sn==27){//27になったら終了（スプライト番号が）
      this.kill=true;
      return;
    }
    super.draw();
  }
}

//-------------------派手な爆発---------------------
function explosion(x,y,vx,vy){
  expl.push(new Expl(0,x,y,vx,vy));
  for(let i=0; i<10; i++){
    let evx=vx+(rand(-10,10)<<6);
    let evy=vy+(rand(-10,10)<<6);
    expl.push(new Expl(i,x,y,evx,evy));
  }
}


//キーボードが押されたとき
document.onkeydown=function(e){
  key[e.keyCode]=true;
  if(gameOver && e.keyCode==82){//Rが押された時//keycodeで検索すると出てくる
    delete machine;
    machine=new Machine();
    gameOver=false;
    score=0;

  }
}

//キーボードが離された時
document.onkeyup=function(e){
  key[e.keyCode]=false;
}


//--------------スプライトを描画----------------
function drawSprite(snum,x,y){//snumがどのスプライトか//x座標//y座標を渡してもらう
  let sx=sprite[snum].x;
  let sy=sprite[snum].y;
  let sw=sprite[snum].w;
  let sh=sprite[snum].h;

  let px=(x>>8)-sw/2;//サイズの半分引く
  let py=(y>>8)-sh/2;//サイズの半分引く

  if(px+sw<camera_x || px>=camera_x+Screen_w//||はまたは（or）の意味
    ||py+sh<camera_y || py>=camera_y+Screen_h)return;

  vcon.drawImage(spriteImage,sx,sy,sw,sh,px,py,sw,sh);//仮装フィールドにスプライトイメージ読み込み
}//引数(sx, sy)と引数(sw, sh)は、元イメージの使用範囲 //引数(dx, dy)は、描画するイメージを配置する座標。引数(dw, dh)は、イメージを描画する幅と高さ

//--------------整数のランダム構築---------------
function rand(min,max){//randomを作る関数//最大値と最小値を入れると乱数を取得
  return Math.floor(Math.random()*(max-min+1))+min//max-minで範囲＋1＋min
}

//------------------当たり判定の関数-------------------
function checkHit(x1,y1,r1, x2,y2,r2){
  //矩形同士の当たり判定（不採用）
  // let left1=x1>>8;
  // let right1=left1+w1;
  // let top1=y1>>8;
  // let bottom1=top1+h1;

  // let left2=x2>>8;
  // let right2=left2+w2;
  // let top2=y2>>8;
  // let bottom2=top2+h2;

  // return (left1<=right2&&
  //           right1>=left2&&
  //             top1<=bottom2&&
  //       bottom1>=top2);

  //円で当たり判定（採用）
  let a=(x2-x1)>>8;
  let b=(y2-y1)>>8;
  let r=r1+r2;

  return r*r>=a*a+b*b;

}
