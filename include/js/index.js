let isRecording = false; // 녹화 중인지 확인
let framesAdded = 0;
let totalFrames = 60; // 녹화할 프레임 수
let gif = null;
let spans = [];

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
}

function onClickConvertBtn(_obj){
    $(".main_txt_temp").html($(".txt_string").val());
    $(".main_txt").html($(".main_txt_temp").html());
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
}



function onClickFontBtn(obj) {
    $(".main_txt").css("font-family", $(obj).html());
    $(".main_txt").css("font-weight", "900");
    $(".txt_finish_title").html("");
    $(".txt_finish_desc").html("");
}

function setStartAnimation() {
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
    gsap.to(spans, {
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
                    scale: 1.5,
                    duration: 0.6,
                    repeat: 1,
                    yoyo: true,
                    ease: "power1.inOut",
                    delay: index * 0.2, // 개별적으로 순차 실행
                    onComplete: function () {
                        if (index === spans.length - 1) {
                            console.log("애니메이션 종료 -> GIF 캡처 종료");
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

    captureFrames3(firstAnimation+secondAnimation); // 프레임 캡처 시작
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
    $(".txt_finish_title").html("녹화 시작");
    totalFrames = Math.ceil((_sec*1000) / (1000 / 30)); // 4.5초 동안 30FPS 캡처
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
