let isRecording = false; // 녹화 중인지 확인
let framesAdded = 0;
let totalFrames = 60; // 녹화할 프레임 수
let gif = null;
let spans = [];
let m_font_animation = null;
let m_f_color_0 = ["#F7AC43", "#73D674", "#000000"];
let m_f_color_1 = ["#F7AC43", "#FFFFFF", "#000000"];
const strokeWidth = 7;
let m_mode = "1";
let m_f_txt = "테스트용문자열";


function setInit() {

    $(".font_btn").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickFontBtn(this);
    });
    $(".btn_download").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickDownloadBtn(this);
    });

    $(".btn_convert").on("touchstart mousedown", function (e) {
        e.preventDefault();
        onClickConvertBtn(this);
    });

    $(".txt_string").on("focus", function (e) {
        e.preventDefault();
        $(".txt_string").val("");
    });

    $("#id_color_0, #id_color_1, #id_color_3, #id_color_4").on("input", function (e) {
        e.preventDefault();
        onClickColorPicker(this);
    });

    $("#id_color_2, #id_color_5").on("input", function (e) {
        e.preventDefault();
        onClickStroke(this);
    });
    $(".main_txt").html(m_f_txt);

    $(".main_png_txt").html($("#id_input").val());
    $(".main_txt").html($("#id_input").val());
    $(".main_txt_temp").html($(".main_txt").text());
    const $mainTxt = $(".main_txt");
    const text = $mainTxt.text();
    $mainTxt.empty(); // 기존 텍스트 제거
    $.each(text.split(""), function (index, char) {
        const $span = $("<span>").text(char).css({
            opacity: 1
        });
        $mainTxt.append($span);
        spans.push($span);
    });

    updateTextColorsCSS_0(m_f_color_0[0], m_f_color_0[1]);
    $(".main_txt span").each(function () {
        this.style.webkitTextStroke = `${strokeWidth}px ${m_f_color_0[2]}`;
    });
    updateTextColorsCSS_1(m_f_color_1[0], m_f_color_1[1]);
    $(".main_png_txt").each(function () {
        this.style.webkitTextStroke = `${strokeWidth}px ${m_f_color_1[2]}`;
    });
    $("#id_color_0").val(m_f_color_0[0]);
    $("#id_color_1").val(m_f_color_0[1]);
    $("#id_color_2").val(m_f_color_0[2]);
    $("#id_color_3").val(m_f_color_1[0]);
    $("#id_color_4").val(m_f_color_1[1]);
    $("#id_color_5").val(m_f_color_1[2]);
}

function onClickStroke(_obj) {
    let t_color = "#000000";
    if (m_mode == "0") {
        t_color = $("#id_color_2").val();
        $(".main_txt span").each(function () {
            this.style.webkitTextStroke = `${strokeWidth}px ${strokeColor}`;
        });
    }else {
        t_color = $("#id_color_5").val();
        $(".main_png_txt").each(function () {
            this.style.webkitTextStroke = `${strokeWidth}px ${t_color}`;
        });
    }
}

function onClickColorPicker(_obj) {
    let t_color_0 = "";
    let t_color_1 = "";
    if (m_mode == "0") { //gif 모드
        t_color_0 = $("#id_color_0").val();
        t_color_1 = $("#id_color_1").val();
        updateTextColorsCSS_0(t_color_0, t_color_1);
    } else {
        t_color_0 = $("#id_color_3").val();
        t_color_1 = $("#id_color_4").val();
        updateTextColorsCSS_1(t_color_0, t_color_1);
    }
}

function updateTextColorsCSS_0(_color0, _color1) {
    let styleTag = $("#dynamicStyles");

    // 스타일 태그가 없으면 생성
    if (styleTag.length === 0) {
        $("head").append('<style id="dynamicStyles"></style>');
        styleTag = $("#dynamicStyles");
    }

    // 새로운 스타일을 설정
    styleTag.html(`
        .main_txt span:nth-child(odd) {
            color: ${_color0} !important;
        }
        .main_txt span:nth-child(even) {
            color: ${_color1} !important;
        }
    `);
}

function updateTextColorsCSS_1(_color0, _color1) {
    
    $(".main_png_txt").css({
        "background": "linear-gradient(0deg, " + _color1 + ", " + _color0 + ")",
        "-webkit-background-clip": "text",
        "-webkit-text-fill-color": "transparent"
    });
}

function onClickConvertBtn(_obj) {
    $(".main_txt_temp").html($(".txt_string").val());
    $(".main_txt").html($(".main_txt_temp").html());
    const $mainTxt = $(".main_txt");
    const text = $mainTxt.text();
    $mainTxt.empty(); // 기존 텍스트 제거
    spans = [];
    $.each(text.split(""), function (index, char) {
        const $span = $("<span>").text(char).css({
            opacity: 1
        });
        $mainTxt.append($span);
        spans.push($span);
    });
}



function onClickFontBtn(obj) {
    $(".main_txt").css("font-family", $(obj).html());
    $(".main_txt").css("font-weight", "900");
    $(".txt_finish_title").html("");
    $(".txt_finish_desc").html("");
    $(".main_png_txt").css("font-family", $(obj).html());
    $(".main_png_txt").css("font-weight", "900");
}


function saveTextAsImage() {
    const textElement = $(".main_png_txt")[0];
    const text = textElement.innerText || textElement.textContent;  
    const fontSize = parseInt(window.getComputedStyle(textElement).fontSize);
    const fontFamily = window.getComputedStyle(textElement).fontFamily;
    const gradientColor1 = $("#id_color_3").val(); 
    const gradientColor2 = $("#id_color_4").val();
    const strokeColor = $("#id_color_5").val();
    const strokeWidth = parseInt($("#stroke_width").val()) || 5;

    // 📌 Canvas 생성
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // 📌 Canvas 크기 설정
    canvas.width = textElement.offsetWidth;
    canvas.height = textElement.offsetHeight;

    // 📌 배경 투명 설정
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 📌 폰트 설정
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 📌 그라데이션 설정
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, gradientColor1);
    gradient.addColorStop(1, gradientColor2);

    // 📌 테두리(stroke) 먼저 그리기
    //ctx.strokeStyle = strokeColor;
    //ctx.lineWidth = strokeWidth;
    //ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    
    for (let i = 0; i < strokeWidth*3; i++) {
        ctx.lineWidth = i;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    }
    
    // 📌 채우기(fill) 적용
    ctx.fillStyle = gradient;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // 📌 이미지 저장
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "text_image.png";
    link.click();
}


function saveTextAsImageOld() {
    const textElement = $(".main_png_txt")[0];  
    const text = textElement.innerText || textElement.textContent;
    const textWidth = $(".main_png_txt").outerWidth();
    const textHeight = $(".main_png_txt").outerHeight();
    const fontSize = parseInt(window.getComputedStyle(textElement).fontSize);
    const fontFamily = window.getComputedStyle(textElement).fontFamily;
    const gradientColor1 = $("#id_color_3").val(); 
    const gradientColor2 = $("#id_color_4").val();
    const strokeColor = $("#id_color_5").val();
    const strokeWidth = parseInt($("#stroke_width").val()) || 5;

    // 📌 SVG 코드 생성
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${textWidth}" height="${textHeight}">
            <defs>
                <linearGradient id="textGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:${gradientColor1};" />
                    <stop offset="100%" style="stop-color:${gradientColor2};" />
                </linearGradient>
            </defs>
            <text x="50%" y="50%" font-size="${fontSize}px" font-family="${fontFamily}"
                text-anchor="middle" dominant-baseline="middle"
                stroke="${strokeColor}" stroke-width="${strokeWidth}" fill="url(#textGradient)">
                ${text}
            </text>
        </svg>`;

    // 📌 SVG를 데이터 URL로 변환
    const svgData = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    const img = new Image();
    img.src = svgData;
    $(".main_svg_zone").append(img);
    
    return;
    //const img = new Image();
    img.src = svgData;

    img.onload = function () {
        // 📌 Canvas 생성 및 SVG 렌더링
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 300;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // 📌 이미지 저장
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "text_image.png";
        link.click();
    };
}

function saveGradientTextCanvas() {
    const text = $(".main_png_txt").text();  
    const fontSize = parseInt(window.getComputedStyle($(".main_png_txt")[0]).fontSize);
    const fontFamily = window.getComputedStyle($(".main_png_txt")[0]).fontFamily;
    const textColor1 = $("#id_color_3").val(); 
    const textColor2 = $("#id_color_4").val(); 
    const strokeColor = $("#id_color_5").val();     
    let width = $(".main_png_txt").outerWidth();
    let height = $(".main_png_txt").outerHeight();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // 그라데이션 설정
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, textColor1);
    gradient.addColorStop(1, textColor2);

    // 텍스트 스타일 설정
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    //ctx.lineWidth = strokeWidth;
    
    for (let i = 0; i < strokeWidth*3; i++) {
        ctx.lineWidth = i;
        ctx.strokeStyle = strokeColor;
        ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    // 이미지 다운로드
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "text_image.png";
    link.click();
}



function setStartAnimation() {
    if (m_mode == "1") {
        //saveGradientTextCanvas();
        saveTextAsImageOld();
        return;
    }
    $(".txt_finish_title").html("");
    $(".txt_finish_desc").html("");
    /*
    const $mainTxt = $(".main_txt");
    const text = $mainTxt.text();
    $mainTxt.empty(); // 기존 텍스트 제거

    let spans = [];
    $.each(text.split(""), function (index, char) {
        const $span = $("<span>").text(char).css({
            opacity: 1
        });
        $mainTxt.append($span);
        spans.push($span);
    });
    
    */

    /*
    gsap.to(spans, {
        startAt: {
            scale: 2
        },
        opacity: 1,
        scale: 1,
        duration: 0.5,
        stagger: 0.2, // 한 글자씩 순차적으로 등장
        ease: "elastic.out(1, 0.5)", // 부드럽게 튕기는 효과
        onComplete: function () {
            // 모든 글자가 나타난 후, 한 글자씩 개별적으로 커졌다 작아지는 애니메이션 실행
            spans.forEach((span, index) => {
                gsap.to(span, {
                    scale: 1.5,
                    duration: 0.3,
                    repeat: 1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: index * 0.1 // 개별적으로 순차 실행
                });
            });
        }
    });
    */
    let startTime = performance.now();
    //console.log(startTime);

    if (m_font_animation) {
        m_font_animation.kill();
    }

    m_font_animation = gsap.to(spans, {
        startAt: {
            scale: 2
        },
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.4, // 한 글자씩 순차적으로 등장
        ease: "elastic.out(1, 0.5)", // 부드럽게 튕기는 효과
        onComplete: function () {
            // 모든 글자가 나타난 후, 한 글자씩 개별적으로 커졌다 작아지는 애니메이션 실행
            spans.forEach((span, index) => {
                gsap.to(span, {
                    //                    scale: 1.5,
                    y: -70,
                    duration: 0.6,
                    repeat: 1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: index * 0.2, // 개별적으로 순차 실행
                    onComplete: function () {
                        if (index === spans.length - 1) {
                            console.log("애니메이션 종료");
                            /*
                            gif.on('progress', function (p) {
                                console.log(`GIF 렌더링 진행률: ${(p * 100).toFixed(2)}%`);
                            });

                            gif.once('finished', function (blob) {
                                console.log("GIF 렌더링 완료! 파일 저장 시작...");
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "animation.gif";
                                a.click();
                            });
                            gif.render(); // 마지막 애니메이션이 끝나면 GIF 생성
                            */
                        }
                        //startTime = performance.now();
                        //console.log(startTime);
                    }
                });
            });
        }
    });

    startRecording();
}

function startRecording() {
    framesAdded = 0;
    gif = new GIF({
        workers: 4, // 워커 수 증가 (병렬 처리 속도 향상)
        quality: 1, // 퀄리티 최상 (0~30, 낮을수록 고품질)
        repeat: -1, // 무한 반복
        transparent: 0x00000000, // 배경 투명 유지
        workerScript: 'include/js/lib/gif.worker.js'
    });

    const firstAnimation = 1 + (spans.length - 1) * 0.4;
    const secondAnimation = (spans.length - 1) * 0.2 + 1.2;

    captureFrames3(firstAnimation + secondAnimation); // 프레임 캡처 시작
}

async function captureFrames() {
    for (let i = 0; i < totalFrames; i++) {
        await html2canvas(document.querySelector(".main_txt"), {
            willReadFrequently: true,
            scale: 1,
            backgroundColor: null // 배경 투명 설정
        }).then(canvas => {
            console.log(`캔버스 크기: ${canvas.width}x${canvas.height}`);
            gif.addFrame(canvas, {
                delay: 30
            });
            framesAdded++;
            console.log(`프레임 추가됨: ${framesAdded}/${totalFrames}`);
        });
    }

    console.log("프레임 추가 완료! GIF 렌더링 시작...");
    console.log(gif);

    gif.on('progress', function (p) {
        console.log(`GIF 렌더링 진행률: ${(p * 100).toFixed(2)}%`);
    });

    gif.on('finished', function (blob) {
        console.log("GIF 렌더링 완료!");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "animation.gif";
        a.click();
    });

    gif.render(); // GIF 렌더링 시작
}

async function captureFrames2() {
    totalFrames = 135;
    const frameDuration = 1000 / 30; // 30FPS -> 1프레임당 33.3ms (1000ms / 30)

    for (let i = 0; i < totalFrames; i++) {
        const startTime = performance.now(); // 현재 시간 기록
        //console.log(startTime);
        await html2canvas(document.querySelector(".main_txt"), {
            willReadFrequently: true,
            scale: 1,
            backgroundColor: null // 배경 투명 설정
        }).then(originalCanvas => {
            // 새로운 캔버스 생성
            let newCanvas = document.createElement("canvas");
            newCanvas.width = originalCanvas.width;
            newCanvas.height = originalCanvas.height;
            let ctx = newCanvas.getContext("2d");
            // 기존 캔버스를 새로운 캔버스로 복사
            ctx.drawImage(originalCanvas, 0, 0);
            //console.log(startTime);
            //console.log(`캔버스 크기: ${newCanvas.width}x${newCanvas.height}`);
            gif.addFrame(newCanvas, {
                delay: frameDuration
            });
            framesAdded++;
            //console.log(`프레임 추가됨: ${framesAdded}/${totalFrames}`);
        });

        // 다음 프레임까지 남은 시간만큼 대기
        const elapsedTime = performance.now() - startTime;
        //        const waitTime = Math.max(0, frameDuration - elapsedTime);
        const waitTime = Math.abs(frameDuration - elapsedTime);
        //console.log(frameDuration, elapsedTime, waitTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    console.log(frameDuration / 1000 * framesAdded);
    console.log("프레임 추가 완료! GIF 렌더링 시작...");
    console.log(gif);

    gif.on('progress', function (p) {
        console.log(`GIF 렌더링 진행률: ${(p * 100).toFixed(2)}%`);
    });

    gif.on('finished', function (blob) {
        console.log("GIF 렌더링 완료!");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "animation.gif";
        a.click();
    });
    gif.render();
}

async function captureFrames3(_sec) {

    console.log(_sec);
    console.log($(".main_txt").width(), $(".main_txt").height());

    $(".main_txt").css("width", "auto");
    let t_w = $(".main_txt").width() * 1.2;
    if (t_w > 1280) {
        t_w = 1280
    };
    $(".main_txt").css("width", t_w + "px");
    //    return;


    $(".txt_finish_title").html("녹화 시작");
    totalFrames = Math.ceil((_sec * 1000) / (1000 / 30)); // 4.5초 동안 30FPS 캡처
    const frameDuration = 1000 / 30; // 30FPS -> 1프레임당 33.3ms
    let framePromises = [];

    for (let i = 0; i < totalFrames; i++) {
        const startTime = performance.now();
        // html2canvas 캡처 작업을 비동기적으로 배열에 저장
        framePromises.push(
            html2canvas(document.querySelector(".main_txt"), {
                willReadFrequently: true,
                scale: 1,
                backgroundColor: null
            }).then(originalCanvas => {
                let newCanvas = document.createElement("canvas");
                newCanvas.width = originalCanvas.width;
                newCanvas.height = originalCanvas.height;
                let ctx = newCanvas.getContext("2d");
                ctx.drawImage(originalCanvas, 0, 0);
                $(".txt_finish_desc").html("(" + (i + 1) + "/" + totalFrames + ")장 저장중");
                gif.addFrame(newCanvas, {
                    delay: frameDuration
                });
            })
        );

        // 프레임 간격 조정
        const elapsedTime = performance.now() - startTime;
        const waitTime = Math.max(0, frameDuration - elapsedTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    await Promise.all(framePromises);
    console.log("프레임 추가 완료! GIF 렌더링 시작...");
    $(".txt_finish_title").html("녹화 완료 렌더링 시작");
    gif.on('progress', function (p) {
        $(".txt_finish_desc").html(Math.round(p * 100) + "% 완료");
        console.log(`GIF 렌더링 진행률: ${(p * 100).toFixed(2)}%`);
    });

    gif.once('finished', function (blob) {
        console.log("GIF 렌더링 완료! 파일 저장 시작...");
        $(".txt_finish_title").html("작업 완료 파일 저장 시작");
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "animation.gif";
        a.click();
    });
    gif.render();
}



// 💾 GIF 다운로드 (버튼 클릭 시 실행)
function onClickDownloadBtn() {
    setStartAnimation();
}
