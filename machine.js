// 'use strct';
//自機関連


//-----------------弾のクラス---------------
class Bullet extends CharaBase{//extendsでChraBase(親クラス)のクラスを継承
  constructor(x,y,vx,vy){
    super(6,x,y,vx,vy);//親クラスのコンストラクタを呼び出す
    this.r=4;//弾の範囲収縮具合
    //
  }
  draw(){
    super.draw();//親クラスのメソッドを呼び出す
    //
    //
  }
  update(){
    super.update();//親クラスのメソッドを呼び出す
    
    for(let i=0; i<enemy.length; i++){
      if(!enemy[i].kill){
        if(checkHit(
          this.x,this.y,this.r,
          enemy[i].x,enemy[i].y,enemy[i].r
        )){
          this.kill=true;
          if((enemy[i].hp-=10)<=0){//敵のhpが0以下になったら
            enemy[i].kill=true;//敵kill
            explosion(//爆発
              enemy[i].x, enemy[i].y, enemy[i].vx>>3, enemy[i].vy>>3);
              score +=enemy[i].score;//スコアを付ける
          }else{
            expl.push(new Expl(0,this.x,this.y,0,0));//弾があたった場所で爆発する描画//this.x,thisyは弾自体の座標
          }
          if(enemy[i].mhp>=1000){//敵のHPが1000以上で//mph→mhp
            bossHP=enemy[i].hp;
            bossMHP=enemy[i].mhp;
          }

          break;
        }
      }
    }
  }
}


//---------------自機のクラス------------------
class Machine{
  constructor(){
    this.x=(Field_w/2)<<8;//始めの描画位置
    this.y=(Field_h-50)<<8;(Field_h/2)<<8;//始めの描画位置
    this.mhp=100;//自機のマックスhp
    this.hp=this.mhp;//自機のhp

    this.speed=  512;
    this.anime=  0;
    this.reload=  0;//reloadプロパティ持たせる
    this.reload2=0;//reload2プロパティ持たせる
    this.r=           3;//半径プロパティ持たせる
    this.damage=0;//ダメージプロパティ持たせる
    this.muteki= 0;//mutekiプロパティ持たせる
    this.count=   0;//カウンタ
  }
  //自機の描画メソッド
  draw(){

    if(this.muteki && (this.count&1))return;
    drawSprite(2+this.anime,this.x,this.y);//snum,x,y
    if(this.muteki && (this.count&1))return;
    drawSprite(9+this.anime,this.x,this.y+(20<<8));//snum,x,y
  }
  //自機の更新処理メソッド
  update(){
    this.count++;
    if(this.damage)this.damage--;//毎フレームごとに10減る
    if(this.muteki)this.muteki--;//毎フレームごとに10減る

    //自機の弾の量
    if(key[32]&&this.reload===0){
			bullet.push( new Bullet(this.x+(6<<8),this.y-(10<<8),  0,-2000 ) );//pushでbulletの配列の中にここのが追加できる
			bullet.push( new Bullet(this.x-(6<<8),this.y-(10<<8),  0,-2000 ) );
			bullet.push( new Bullet(this.x+(8<<8),this.y-(5<<8), 300,-2000 ) );
			bullet.push( new Bullet(this.x-(8<<8),this.y-(5<<8),-300,-2000 ) );

      this.reload=4;//１弾ごとの間隔
      if(++this.reload2==8){//連射回数
        this.reload=20;//1かたまりごとの間隔（約0.3s）
        this.reload2=0;
      }
    }

    if(this.reload>0){
      this.reload--;
    }

    if(key[37]&&this.x>this.speed){//左//x座標がspeedより大きい時
      this.x-=this.speed;//左に512スピード
      if(this.anime>-2)this.anime--;//animeが-2より大きい時、animeに--
    }else if(key[39]&&this.x<=(Field_w<<8)){//右//x座標がフィールド内の時
      this.x+=this.speed;//右に512スピード
      if(this.anime<2)this.anime++;//animeが+2より小さい時、animeに++
    }else{//それ以外の時
      if(this.anime>0)this.anime--;//animeが0より大きいとき、anime--
      if(this.anime<0)this.anime++;//animeが0より小さいとき、anime++
    }

    if(key[38]&&this.y>this.speed){//上
      this.y-=this.speed;
    }

    if(key[40]&&this.y<=(Field_h<<8)-this.speed){//下
      this.y+=this.speed;
    }

  }
}
