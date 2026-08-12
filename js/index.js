const TH01 = "th01";
const TH02 = "th02";
const TH03 = "th03";
const TH04 = "th04";
const TH05 = "th05";
const TH06 = "th06";
const TH07 = "th07";
const TH075 = "th075";
const TH08 = "th08";
const TH09 = "th09";
const TH095 = "th095";
const TH10 = "th10";
const TH105 = "th105";
const TH11 = "th11";
const TH12 = "th12";
const TH123 = "th123";
const TH125 = "th125";
const TH128 = "th128";
const TH13 = "th13";
const TH135 = "th135";
const TH14 = "th14";
const TH143 = "th143";
const TH145 = "th145";
const TH15 = "th15";
const TH155 = "th155";
const TH16 = "th16";
const TH165 = "th165";
const TH17 = "th17";
const TH175 = "th175";
const TH18 = "th18";
const TH185 = "th185";
const TH19 = "th19";
const TH20 = "th20";

const THLIST = [
    TH01, TH02, TH03, TH04, TH05,
    TH06, TH07, TH075, TH08, TH09, TH095,
    TH10, TH105, TH11, TH12, TH123, TH125, TH128,
    TH13, TH135, TH14, TH143, TH145, TH15, TH155,
    TH16, TH165, TH17, TH175, TH18, TH185, TH19,
    TH20
];
const THCAT = {
    pc98: [ TH01, TH02, TH03, TH04, TH05 ],
    main: [ TH06, TH07, TH08, TH09, TH10, TH11, TH12, TH13, TH14, TH15, TH16, TH17, TH18, TH19, TH20 ],
    sp1: [ TH095, TH125, TH128, TH143, TH165, TH185 ],
    sp2: [ TH075, TH105, TH123, TH135, TH145, TH155, TH175 ],
};
const THTITLE = {
    th01: "Highly Responsive to Prayers",
    th02: "Story of Eastern Wonderland",
    th03: "Phantasmagoria of Dimensional Dream",
    th04: "Lotus Land Story",
    th05: "Mystic Square",
    th06: "Embodiment of Scarlet Devil",
    th07: "Perfect Cherry Blossom",
    th075: "Immaterial and Missing Power",
    th08: "Imperishable Night",
    th09: "Phantasmagoria of Flower View",
    th095: "Shoot the Bullet",
    th10: "Mountain of Faith",
    th105: "Scarlet Weather Rhapsody",
    th11: "Subterranean Animism",
    th12: "Undefined Fantastic Object",
    th123: "Touhou Hisoutensoku",
    th125: "Double Spoiler",
    th128: "Great Fairy Wars",
    th13: "Ten Desires",
    th135: "Hopeless Masquerade",
    th14: "Double Dealing Character",
    th143: "Impossible Speil Card",
    th145: "Urban Legend in Limbo",
    th15: "Legacy of Lunatic Kingdom",
    th155: "Antinomy of Common Flowers",
    th16: "Hidden Star in Four Seasons",
    th165: "Violet Detector",
    th17: "Wily Beast and Weakest Creature",
    th175: "Sunken Fossil World",
    th18: "Unconnected Marketeers",
    th185: "100th Black Market",
    th19: "Unfinished Dream of All Living Ghost",
    th20: "Fossilized Wonders",
};
var thSeSelect, thSeConfirm;
var thImg = {}, thChecked;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function saveSelection() {
    localStorage.setItem("thChecked", JSON.stringify(thChecked));
}

function loadSelection() {
    let s = localStorage.getItem("thChecked");
    if (s != null)
        thChecked = JSON.parse(s);
    else {
        thChecked = {};
        for (let th of THLIST)
            thChecked[th] = false;
    }
}

function drawImage(img) {
    const cw = $("#canvas")[0].width;
    const ch = $("#canvas")[0].height;
    const scale = Math.min(cw / img.width, ch / img.height);
    // const w = img.width * scale;
    // const h = img.height * scale;
    const w = cw;
    const h = ch;
    $("#canvas").clearCanvas().drawImage({
        source: img,
        x: cw / 2,
        y: ch / 2,
        width: w,
        height: h,
    });
}

function initCP() {
    $("#game-all").on("change", (ev) => {
        let val = $(ev.target).is(":checked");
        $(".game").prop("checked", val);
        for (let th of THLIST)
            thChecked[th] = val;
        saveSelection();
    });

    for (let cat of Object.keys(THCAT))
        for (let th of THCAT[cat]) {
            $(`#cp-game-${cat}`).append($("<div>").append(
                $("<input>", {
                    type: "checkbox",
                    class: "btn-check game",
                    id: `game-${th}`,
                    checked: thChecked[th],
                }).on("change", (ev) => {
                    thChecked[th] = $(ev.target).is(":checked");
                    saveSelection();
                }),
                $("<label>", {
                    for: `game-${th}`,
                    text: th,
                    class: "btn btn-outline-primary"
                })
            ));
        }
}

function initTh() {
    for (let th of THLIST) {
        const img = new Image();
        img.src = `assets/cover/${th}.jpg`;
        thImg[th] = img;
    }
    thSeSelect = new Audio("assets/sfx/se_select00.wav");
    thSeConfirm = new Audio("assets/sfx/se_extend.wav");

    loadSelection();
}

function initEv() {
    $("#cp-action-clear").on("click", () => {
        $("#canvas").clearCanvas();
        $("#roll-result span").text("");
    });

    $("#cp-action-roll").on("click", async () => {
        // TODO: Add a starting decay to randomize two selected games
        let a = 100;
        let b = 0.2;
        let c = 1.25;
        let stop = 1000;

        let delay;
        let idx = -1, _idx = -1;

        let thSelected = [];
        let thChosen;
        for (let th of THLIST)
            if (thChecked[th])
                thSelected.push(th);
        if (thSelected.length == 0) {
            // TODO: Replace this with the pichun sfx
            alert("CHEEEEEEEEEEEENNN!!!");
            return;
        }
        if (thSelected.length == 1) {
            thChosen = thSelected[0];
            drawImage(thImg[thChosen]);
            thSeSelect.play();
            thSeConfirm.play();
            $("#roll-result span").text(THTITLE[thChosen]);
            return;
        }

        $("#cp-action-clear").attr("disabled", true);
        $("#cp-action-roll").attr("disabled", true);
        $("#roll-result span").text("");

        for (let i = 0; i < 1000; i++) {
            delay = a + b * c ** i;

            let maxIteration = 10;
            do {
                _idx = idx;
                idx = Math.floor(Math.random() * thSelected.length);
            } while (idx == _idx && maxIteration--);

            drawImage(thImg[thSelected[idx]]);
            // Bug: this does't rewind the seeker to the beginning in Firefox
            thSeSelect.currentTime = 0;
            thSeSelect.play();

            if (delay > stop) {
                thChosen = thSelected[idx];
                break;
            }
            await sleep(delay);
        }

        thSeConfirm.play();
        $("#cp-action-clear").attr("disabled", false);
        $("#cp-action-roll").attr("disabled", false);
        $("#roll-result span").text(THTITLE[thChosen]);
    });
}

$(() => {
    initTh();
    initCP();
    initEv();

    $("#canvas").attr({
        width: 600,
        height: 600,
    });
});
