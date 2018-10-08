import registerServiceWorker from './registerServiceWorker';
import * as P from 'pixi.js';
import star from '../src/assets/star.png';
import test_48 from '../src/assets/test-48.mp4';

const app = new P.Application(1000, 800, {backgroundColor : 21451655});

document.body.appendChild(app.view);

const actor = P.Sprite.fromImage(star);
const video_basetexture = P.VideoBaseTexture.fromUrl({src: test_48, mime: 'video/mp4'}, false);
const video_texture1 = new P.Texture(video_basetexture);
const video_actor1 = new P.Sprite(video_texture1);

const graphics = new P.Graphics();
const time_text = new P.Text();
const TIME_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: ['STHeitiSC-Medium', 'Microsoft YaHei'],
    fontSize: '16px',
    fontWeight: 'bold',
    align: 'center',
    fill: '#ffffff',
  });

actor.x = app.renderer.width / 2;
actor.y = app.renderer.height / 2;
actor.anchor.x = 0.5;
actor.anchor.y = 0.5;
actor.scale.x = 0.5;
actor.scale.y = 0.5;

video_actor1.x = app.renderer.width / 2;
video_actor1.y = app.renderer.height / 2;
video_actor1.anchor.x = 0.5;
video_actor1.anchor.y = 0.5;

video_basetexture.on('loaded', set_video_actor_size);

console.log('texture', video_texture1);
console.log('texture', video_texture1.frame);
console.log(video_basetexture);


function begin() {
    video_basetexture.source.play();
}

function pause() {
    video_basetexture.source.pause();
}

function hide() {
    video_actor1.visible = false;
}

function display() {
    video_actor1.visible = true;
}

function play() {
    //从第一桢开始播放
    video_basetexture.source.currentTime = 0;
    //video_basetexture.updateSourceImage('../src/assets/star.png');
}

function set_video_actor_size() {
    //readonly video_basetexture.source.poster = '../src/assets/star.png';
    const ratio_width = app.renderer.width / video_basetexture.width > 1 ? 1 : app.renderer.width / video_basetexture.width;
    const ratio_height = app.renderer.height / video_basetexture.height > 1 ? 1 : app.renderer.height / video_basetexture.height;
    const ratio = Math.min(ratio_width, ratio_height);
    video_actor1.width *= ratio;
    video_actor1.height *= ratio;

    const output = document.getElementById('output') as HTMLElement;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as any;
    const video_source = video_basetexture.source as HTMLVideoElement;
    console.log(typeof(video_source));
    canvas.width = video_actor1.width * (video_actor1.scale as any);
    canvas.height = video_actor1.height * (video_actor1.scale as any);
    ctx.drawImage(video_source, 0, 0, canvas.width, canvas.height);

    const image = document.createElement('img');
    image.src = canvas.toDataURL();
    output.appendChild(image);
}

function get_all_video_time() {
    const sum_seconds = video_basetexture.source.duration;
    const minute = Math.floor(sum_seconds / 60 % 60);
    const second = Math.floor(sum_seconds % 60);
    const time = minute + '分' + second + '秒';
    graphics.x = video_actor1.width / 2;
    graphics.y = video_actor1.height / 2;
    graphics.pivot.x = graphics.x / 2;
    graphics.pivot.y = graphics.y / 2;
    graphics.lineStyle(2, 0xCCCCCC, 1);
    graphics.beginFill(0x999999);
    graphics.drawRect(0, 0, 80, 40);
    graphics.endFill();
    time_text.text = time;
    time_text.style = TIME_TEXT_STYLE;
    time_text.x = graphics.width / 2;
    time_text.y = graphics.height / 2;
    time_text.anchor.x = 0.5;
    time_text.anchor.y = 0.5
    graphics.addChild(time_text); 
}

//video_basetexture.on('loaded', get_all_video_time());
//const time_string = get_all_video_time();

const pause_btn = document.getElementById('pause') as HTMLElement;
const begin_btn = document.getElementById('begin') as HTMLElement;
const hide_btn = document.getElementById('hide') as HTMLElement;
const display_btn = document.getElementById('display') as HTMLElement;
const play_btn = document.getElementById('play') as HTMLElement;
const video_length_btn = document.getElementById('video-length') as HTMLElement;

pause_btn.addEventListener('click', pause);
begin_btn.addEventListener('click', begin);
hide_btn.addEventListener('click', hide);
display_btn.addEventListener('click', display);
play_btn.addEventListener('click', play);
video_length_btn.addEventListener('click', get_all_video_time);

app.stage.addChild(actor);
app.stage.addChild(video_actor1);
video_actor1.addChild(graphics);

registerServiceWorker();
