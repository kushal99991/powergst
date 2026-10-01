
import ReactHtmlParser from 'react-html-parser';

let captcha_value = '';
let captcha_number = '';
let backgroundColor_value = '';
let fontColor_value = '';
let charMap_value = '';
let CanvasTemplate_HTML = "<div><canvas id=\"canv\"></canvas><div><a id=\"reload_href\"  style=\"cursor: pointer; color: blue\">Captcha</a></div></div>";


export const CaptchaEnginge = (numberOfCharacters, backgroundColor = 'white', fontColor = 'black', charMap = '') => {

    backgroundColor_value = backgroundColor;
    fontColor_value = fontColor;
    charMap_value = charMap;
    captcha_number = numberOfCharacters;
    let retVal = "";
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if (charMap === "upper") {
        charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    } else if (charMap === "lower") {
        charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    }
    else if (charMap === "numbers") {
        charset = "0123456789";
    }
    else if (charMap === "special_char") {
        charset = "~`!@#$%^&*()_+-=[]{}\|:'<>,.?/";
    }

    let length = parseInt(numberOfCharacters);

    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    let captcha = retVal;

    captcha_value = captcha;

    let length_height_canvas = Math.round(parseInt(length) / 3);

    //let canvas = canvasRef.current;
    let canvas = document.getElementById('canv'),
        ctx = canvas.getContext('2d'),
        img = document.getElementById('image');


    let text = captcha;
    let x = 12.5;
    let y = 15;
    let lineheight = 30;

    let canvas_height = (parseInt(length) - parseInt(length_height_canvas)) * 18;
    let lines = text.split('\n');
    let lineLengthOrder = lines.slice(0).sort(function (a, b) {
        return b.length - a.length;
    });
    ctx.canvas.width = parseInt(length) * 25;
    ctx.canvas.height = (lines.length * lineheight);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.textBaseline = "middle";
    ctx.font = "italic 20px Arial";
    ctx.fillStyle = fontColor;
    ctx.beginPath(); 
    // Staring point (10,45)
    ctx.moveTo(15,15);
    // End point (180,47)
    ctx.lineTo(200,0);
    // Make the line visible
    ctx.stroke();

    let num = 0;
    for (let i = 0; i < parseInt(length); i++) {
        num = parseInt(num) + 1;
        let heigt_num = 18 * num;
        ctx.fillText(retVal[i], heigt_num, Math.round(Math.random() * (15 - 12) + 12));
    }

    // document.getElementById("reload_href").onclick = function () {
    //     CaptchaEnginge(captcha_number, backgroundColor, fontColor, charMap);
    // }
};

export const validateCaptcha = (userValue, reload = true) => {
    if (userValue != captcha_value) {
        if (reload == true) {
            CaptchaEnginge(captcha_number, backgroundColor_value, fontColor_value, charMap_value);
        }
        return false;
    }
    else {
        return true;
    }
};

export const CanvasTemplate = () => {
    return (
         <canvas id="canv"></canvas>
    )
};
