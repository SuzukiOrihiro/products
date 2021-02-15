// 'use script';
//敵関連

//---------------敵の弾クラス--------------
class EnemyBullet extends CharaBase{
  //CharaBaseのコンストラクタとメソッドをそのまま使う

  constructor(sn,x,y,vx,vy,t){
    super(sn,x,y,vx,vy);
    this.r=3;
    if(t==undefined)this.timer==0;//tが入れられなかったらtimer0
    else this.timer=t;
  }


  update(){
    if(this.timer){//timerあれば、
      this.timer --;//timer引く
      return;//終了
    }
    super.update();

    //自機への当たり判定
    if(!gameOver && !machine.muteki && checkHit(//mutekiが1になるとチェックヒットが発動
      this.x,this.y,this.r,
      machine.x,machine.y,machine.r )){
      this.kill=true;
      if((machine.hp -=30)<=0){//hpを30減らして0以下になったら
        gameOver=true;//gameOverフラッグ立てる
      }
      machine.damage=10;//赤色状態の時間
      machine.muteki=60;//無敵状態の時間
     }

     this.sn=14+(this.count&1);
  }


}

//-----------------敵のクラス---------------
class Enemy extends CharaBase{//extendsでChraBase(親クラス)のクラスを継承
  constructor(e,x,y,vx,vy){
    super(0,x,y,vx,vy);//親クラスのコンストラクタを呼び出す
    this.enenum=enemyMaster[e].enenum;
    this.r           =enemyMaster[e].r;
    this.mhp     =enemyMaster[e].hp;
    this.hp        =this.mhp;
    this.score   =enemyMaster[e].score;
    this.flag     =false;

    this.dr        =90;//ボスの弾プロパティ
    this.relo     =0
   //（フラッグとは、onかoffのどちらかの状態が入る関数）
  }
  draw(){
    super.draw();//親クラスのメソッドを呼び出す
    
  }
  update(){
    //共通のアップデート処理
    if(this.relo)this.relo--;
    super.update();//親クラスのメソッドを呼び出す

    //個別のアップデート
    enemyFunc[this.enenum](this);



    //当たり判定
    if(!gameOver && !machine.muteki && checkHit(//mutekiが1になるとチェックヒットが発動
      this.x,this.y,this.r,
      machine.x,machine.y,machine.r )){
      if(this.mph<500)this.kill=true;//mphが500以上の敵はあたっただけで死なない
      if((machine.hp -= 30)<=0){//１発で30減らして0以下になったら
        gameOver=true;//gameOverフラッグ立てる
      }
      machine.damage=10;//赤色状態の時間
      machine.muteki=60;//無敵状態の時間
     }
  }
}

//弾を自機にむけて発射
function enemyShot(obj,speed){
  if(gameOver)return;//gameOverフラグが立ってたら終了

  //敵の弾を画面外から来ないようにする
  let px=(obj.x>>8)
  let py=(obj.y>>8)

  if(px-40<camera_x || px+40>=camera_x+Screen_w//||はまたは（or）の意味
    ||py-40<camera_y || py+40>=camera_y+Screen_h)return;

  let an,dx,dy;
  an=Math.atan2(machine.y-obj.y, machine.x-obj.x);//敵と自機との「角度」を呼び出す//anはラジアン単位//atan2の時は割らずにカンマ,でおけ
  dx=Math.cos(an)*speed;//角度からxベクトルを求める//弾のスピードをかける
  dy=Math.sin(an)*speed;//角度からyベクトルを求める

  enemybullet.push(new EnemyBullet(15,obj.x,obj.y,dx,dy));//敵の弾が発射（trueに変わるとき）//dx,dyについて
}



//--------------------敵の移動パターン１----------------------
function enemyMove01(obj){
  if(!obj.flag){//フラグが立ったら
    if(machine.x>obj.x && obj.vx<120){//自機のx座標の方が大きい場合、
      obj.vx+=4;//移動量をプラスに加算
    }
    else if(machine.x<obj.x && obj.vx>-120){//自機のx座標の方が小さい場合
      obj.vx-=4;//移動量をマイナスに加算
    }
  }else{//フラグが立たなかったら
    if(machine.x<obj.x && obj.vx<400){//横に逃げる
      obj.vx+=30;
    }else if(machine.x>obj.x && obj.vx>-400){
      obj.vx-=30;
    }
  }

  if(Math.abs(machine.y-obj.y)<(100<<8) && !obj.flag){//絶対値//自機に近づいたら
    obj.flag=true;//フラグを立てる
    enemyShot(obj,600);
  }

  if(obj.flag && obj.vy>-800) obj.vy-=30;//フラグが立ってたら(-800より大きい)、縦方向にマイナス30

  //スプライトの変更
  const ptn=[39,40,39,41];
  obj.sn=ptn[(obj.count>>3)&3];
}

//----------------------敵の移動パターン２-----------------------
function enemyMove02(obj){
  if(!obj.flag){//フラグが立ったら
    if(machine.x>obj.x && obj.vx<600){//自機のx座標の方が大きい場合、
      obj.vx+=4;//移動量をプラスに加算
    }
    else if(machine.x<obj.x && obj.vx>-600){//自機のx座標の方が小さい場合
      obj.vx-=4;//移動量をマイナスに加算
    }
  }else{//フラグが立たなかったら
    if(machine.x<obj.x && obj.vx<600){//横に逃げる
      obj.vx+=30;
    }else if(machine.x>obj.x && obj.vx>-600){
      obj.vx-=30;
    }
  }

  if(Math.abs(machine.y-obj.y)<(100<<8) && !obj.flag){//絶対値//自機に近づいたら
    obj.flag=true;//フラグを立てる
    enemyShot(obj,600);
  }

  //if(obj.flag && obj.vy>-800) obj.vy-=30;//フラグが立ってたら(-800より大きい)、縦方向にマイナス30

  //スプライトの変更
  const ptn=[33,34,33,35];
  obj.sn=ptn[(obj.count>>3)&3];
}

//-----------------------ボス(黄色ヒヨコ)の移動パターン-------------------
function enemyMove03(obj){

  if(!obj.flag && (obj.y>>8) >= 60)obj.flag = 1;//フラグが立ってなく、y座標が60より大きければ、フラグを1にする

  if(obj.flag==1){//フラグが1の時
    if((obj.vy -=2) <=0){//vyを２減らし、0以下になったら
      obj.flag=2;//フラグを2にする
      obj.vy=0;//vyを0にする
    }
  }
  else if(obj.flag==2){//objフラグが2の時
    if(obj.vx<300)obj.vx+=10;//右に移動（300まで）
    if((obj.x>>8) > (Field_w-100))obj.flag=3;//x座標がフィールドサイズ-100より大きい時、フラグを3にする
  }
  else if(obj.flag==3){//フラグが3の時
    if(obj.vx>-300)obj.vx -= 10;//x座標-300より大きい時、-10ずつ移動
    if((obj.x>>8) < 100 )obj.flag = 2;//x座標が100以上で、フラグを2にする
  }

  //弾の発射
  if(obj.flag>1){
    let an,dx,dy;
    an=obj.dr*Math.PI/180;
    dx=Math.cos(an)*300;//角度からxベクトルを求める//弾のスピードをかける
    dy=Math.sin(an)*300;//角度からyベクトルを求める
    let x2=(Math.cos(an)*70)<<8;//敵の弾を出す位置を設定
    let y2=(Math.sin(an)*70)<<8;
    enemybullet.push(new EnemyBullet(15,obj.x+x2,obj.y+y2,dx,dy,60));//敵の弾が発射（trueに変わるとき）//dx,dyについて
  
    if((obj.dr +=12) >=360)obj.dr=0;
  }

  //追加攻撃
  if(obj.hp< obj.mhp/2){
    let c =obj.count%(60*5);
    if(c/10<4 && c%10==0){
      let an,dx,dy;
      an=(90+45-(c/10)*30)*Math.PI/180;
      dx=Math.cos(an)*300;//角度からxベクトルを求める//弾のスピードをかける
      dy=Math.sin(an)*300;//角度からyベクトルを求める
      let x2=(Math.cos(an)*70)<<8;//敵の弾を出す位置を設定
      let y2=(Math.sin(an)*70)<<8;
      enemybullet.push(new Enemy(3,obj.x+x2,obj.y+y2,dx,dy));//敵の弾が発射（trueに変わるとき）//dx,dyについて
    }
  }
    //スプライトの変更
    obj.sn=75;
}

//------------------------ボスの配下の敵の行動パターン----------------------
function enemyMove04(obj){

  if(obj.count==10){
    obj.vx=obj.vy=0;
  }
  if(obj.count==60){
    if(obj.x>machine.x)obj.vx=-30;
    else obj.vx=30;
    obj.vy=100;
  }
  if(obj.count>100 && !obj.relo){
    if(rand(0,100)==1){
      enemyShot(obj,300);
      obj.relo=200;
    }
  }

  //スプライトの変更
  const ptn=[33,34,33,35];
  obj.sn=ptn[(obj.count>>3)&3];
}



let enemyFunc=[
  enemyMove01,
  enemyMove02,
  enemyMove03,
  enemyMove04,
];
