import registerServiceWorker from './registerServiceWorker';
import * as P from 'pixi.js';
import star from '../src/assets/star.png';
import test_34 from '../src/assets/test-34.mp4';
//import test from '../src/assets/test.webm';

function start_video() {
const app = new P.Application(400, 800, {backgroundColor : 21451655});

console.log(star);

document.body.appendChild(app.view);

const actor = P.Sprite.fromImage(star);
const time_graphics = new P.Graphics();
const name_graphics = new P.Graphics();
const time_text = new P.Text();
const name_text = new P.Text();
const TIME_TEXT_STYLE = new PIXI.TextStyle({
    fontFamily: ['STHeitiSC-Medium', 'Microsoft YaHei'],
    fontSize: '16px',
    fontWeight: 'bold',
    align: 'center',
    fill: '#ffffff',
  });
const video_basetexture = P.VideoBaseTexture.fromUrl({src: test_34, mime: 'video/mp4'}, false);
const video_texture1 = new P.Texture(video_basetexture);
const video_actor1 = new P.Sprite(video_texture1);
const first_frame_canvas = document.createElement('canvas');
const ctx = first_frame_canvas.getContext('2d') as any;


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

(video_basetexture as any).source.playbackRate = 10;

video_basetexture.on('loaded', set_video_actor);

function continue_video() {
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
    //play by first frame
    video_basetexture.source.currentTime = 0;
}

function set_video_actor() {
    //set size
    const ratio_width = app.renderer.width / video_basetexture.width > 1 ? 1 : app.renderer.width / video_basetexture.width;
    const ratio_height = app.renderer.height / video_basetexture.height > 1 ? 1 : app.renderer.height / video_basetexture.height;
    const ratio = Math.min(ratio_width, ratio_height);
    video_actor1.width *= ratio;
    video_actor1.height *= ratio;

    save_first_frame_image();
}

function get_all_video_time() {
    const sum_seconds = video_basetexture.source.duration;
    const minute = Math.floor(sum_seconds / 60 % 60);
    const second = Math.floor(sum_seconds % 60);
    const time = minute + '分' + second + '秒';
    time_graphics.x = video_actor1.width / 2;
    time_graphics.y = video_actor1.height / 2;
    time_graphics.pivot.x = time_graphics.x / 4;
    time_graphics.pivot.y = time_graphics.y / 4;
    time_graphics.lineStyle(2, 0xCCCCCC, 1);
    time_graphics.beginFill(0x999999);
    time_graphics.drawRect(0, 0, 80, 40);
    time_graphics.endFill();
    time_text.text = time;
    time_text.style = TIME_TEXT_STYLE;
    time_text.x = time_graphics.width / 2;
    time_text.y = time_graphics.height / 2;
    time_text.anchor.x = 0.5;
    time_text.anchor.y = 0.5
    video_name();
    time_graphics.addChild(time_text);
}

function save_first_frame_image() {
    if ((video_basetexture as any).source.currentTime == 0) {
        const video = video_basetexture.source;
        first_frame_canvas.width = video_basetexture.width;
        first_frame_canvas.height = video_basetexture.height;
        ctx.drawImage(video, 0, 0, first_frame_canvas.width, first_frame_canvas.height);

        document.body.appendChild(first_frame_canvas);
    }
}

function video_name() {
    //todo: get video name from backend url?
    const name = 'test-34';
    name_graphics.x = - video_actor1.width / 2;
    name_graphics.y = video_actor1.height / 2;
    name_graphics.pivot.x = - name_graphics.x / 4;
    name_graphics.pivot.y = name_graphics.y / 4;
    name_graphics.lineStyle(2, 0xCCCCCC, 1);
    name_graphics.beginFill(0x999999);
    name_graphics.drawRect(0, 0, 80, 40);
    name_graphics.endFill();
    name_text.text = name;
    name_text.style = TIME_TEXT_STYLE;
    name_text.x = name_graphics.width / 2;
    name_text.y = name_graphics.height / 2;
    name_text.anchor.x = 0.5;
    name_text.anchor.y = 0.5
    name_graphics.addChild(name_text); 
}

function delete_video() {
    app.stage.removeChild(video_actor1);
}


if (video_actor1.getChildByName('frame_sprite')) {
    const child = video_actor1.getChildByName('frame_sprite');
    video_actor1.removeChild(child);
}

console.log(video_basetexture);
console.log(video_actor1);

(video_basetexture as any).source.addEventListener('ended', () => {
    const frame_sprite = P.Sprite.from(first_frame_canvas);
    frame_sprite.anchor.x = 0.5;
    frame_sprite.anchor.y = 0.5;
    frame_sprite.name = 'frame_sprite';
    video_actor1.addChild(frame_sprite); 
    video_actor1.setChildIndex(frame_sprite, 0);
})


const pause_btn = document.getElementById('pause') as HTMLElement;
const continue_btn = document.getElementById('continue') as HTMLElement;
const hide_btn = document.getElementById('hide') as HTMLElement;
const display_btn = document.getElementById('display') as HTMLElement;
const play_btn = document.getElementById('play') as HTMLElement;
const video_length_btn = document.getElementById('video-length') as HTMLElement;
const delete_btn = document.getElementById('delete') as HTMLElement;

pause_btn.addEventListener('click', pause);
continue_btn.addEventListener('click', continue_video);
hide_btn.addEventListener('click', hide);
display_btn.addEventListener('click', display);
play_btn.addEventListener('click', play);
video_length_btn.addEventListener('click', get_all_video_time);
delete_btn.addEventListener('click', delete_video);

app.stage.addChild(actor);
app.stage.addChild(video_actor1);
video_actor1.addChild(time_graphics);
video_actor1.addChild(name_graphics);
}

const start_btn = document.getElementById('start') as HTMLElement;
start_btn.addEventListener('click', start_video);
registerServiceWorker();
