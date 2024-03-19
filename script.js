"use strict";
// toggle button
const toggoleBox = document.getElementById("toggoleBox");
const surah = document.getElementById("surah");
const juz = document.getElementById("juz");
const surahSection = document.querySelector(".surahSection");
const juzSection = document.querySelector(".juzSection");

surah.addEventListener("click", function () {
  toggoleBox.style.margin = "0% 0% 0% -47%";
  changeView();
});
juz.addEventListener("click", function () {
  toggoleBox.style.margin = "0% 0% 0% 47%";
  changeView();
});

const changeView = function () {
  surahSection.classList.toggle("hide");
  juzSection.classList.toggle("hide");
};

// Surah list / chapter list
const chapter = document.querySelector("#chapter ul");
const genarateChapter = async function () {
  const apiCall = await fetch("https://api.quran.com/api/v4/chapters");
  const res = await apiCall.json();
  //   console.log(res.chapters);
  const unorderedList = function () {
    res.chapters.forEach((element) => {
      chapter.insertAdjacentHTML(
        "beforeend",
        `<li>${element.id}. ${element.name_simple}</li>`
      );
    });
  };
  unorderedList();
};
genarateChapter();

// Search Chapter
const searchChapter = document.querySelector("[data-search-chapter]");

searchChapter.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const surahListSelect = document.querySelectorAll("#chapter ul li");

  surahListSelect.forEach((surah) => {
    const isVisible = surah.textContent.toLowerCase().includes(value);
    // console.log(isVisible);
    surah.classList.toggle("hide", !isVisible);
  });
});

// // remove selection fucntion for chapter
// const removeSelectionChapter = function () {
//   chapter.childNodes.forEach(function (element) {
//     console.log(element);
//   });
// };

// verses genarate
const surahContent = document.querySelector("#surahContent"); // surah / chapter Content
const surahTitle = document.getElementById("surahTitle");
const chapterLines = document.querySelector("#chapterLines ul");

const getVerses = async function (element) {
  const verse = await fetch(
    `https://api.quran.com/api/v4/verses/by_chapter/${parseInt(
      element.target.textContent
    )}`
  );
  const verseJson = await verse.json();

  for (let i = 1; i <= Number(verseJson.pagination.total_records); i++) {
    chapterLines.insertAdjacentHTML("beforeend", `<li>${i}</li>`);
  }
};
let currentPageNumber = 1;
chapter.addEventListener("click", (e) => {
  chapterLines.innerHTML = "";
  surahContent.innerHTML = "";
  surahTitle.innerHTML = "";
  currentPageNumber = 1;
  if (e.target.tagName == "LI") {
    for (let i = 0; i < e.target.parentElement.children.length; i++) {
      e.target.parentElement.children.item(i).classList.remove("selected");
    }
    e.target.classList.add("selected");
  }
  chapterTitleGenarator(parseInt(e.target.textContent));
  genarateSurah(parseInt(e.target.textContent));
  getVerses(e);
});

// Surah / titel Titel

const chapterTitleGenarator = async function (chapterNum = 1) {
  const dataChapterTitle = await fetch(
    `https://api.quran.com/api/v4/chapters/${chapterNum}    `
  );
  const resChapterTitle = await dataChapterTitle.json();

  surahTitle.insertAdjacentHTML(
    "beforeend",
    `<span id="englishTitle">${resChapterTitle.chapter.name_simple}</span> /
<span id="arabicTitle">${resChapterTitle.chapter.name_arabic}</span>`
  );
};
// arabic audio constructor section
const ctx = new AudioContext();
let isPlaying = false;
function play(targetAudio) {
  const playSound = ctx.createBufferSource();
  playSound.buffer = targetAudio;
  playSound.connect(ctx.destination);
  playSound.start(ctx.currentTime);
}

// surah / chapter Content
const genarateSurah = async function (chapterNum = 1, page = 1) {
  const dataIndopak = await fetch(
    `https://api.quran.com/api/v4/verses/by_chapter/${chapterNum}?translations=162&audio=7&fields=text_indopak&page=${page}&per_page=30`
  );
  const resIndopak = await dataIndopak.json();
  // console.log(resIndopak.verses[0].audio.url);
  let audio;

  resIndopak.verses.forEach((element) => {
    surahContent.insertAdjacentHTML(
      "beforeend",
      `
      <div class="surahBox">
      <div class="translationBox">
        <div id="lineNumber">${element.verse_key}</div>
        <div id="translation">
          <div id="translationText">${element.translations[0].text}</div>
          <div id="translationPlay">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask
                id="mask0_5_55"
                style="mask-type: alpha"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="24"
                height="24"
              >
                <rect width="24" height="24" fill="#D9D9D9" />
              </mask>
              <g mask="url(#mask0_5_55)">
                <path
                  d="M19.95 15.95L18.4 14.4C19.1333 13.7167 19.7083 12.9083 20.125 11.975C20.5417 11.0417 20.75 10.05 20.75 9C20.75 7.95 20.5417 6.96667 20.125 6.05C19.7083 5.13334 19.1333 4.33334 18.4 3.65L19.95 2.05C20.8833 2.93334 21.625 3.975 22.175 5.175C22.725 6.375 23 7.65 23 9C23 10.35 22.725 11.625 22.175 12.825C21.625 14.025 20.8833 15.0667 19.95 15.95ZM16.75 12.75L15.15 11.15C15.45 10.8667 15.6917 10.5458 15.875 10.1875C16.0583 9.82917 16.15 9.43334 16.15 9C16.15 8.56667 16.0583 8.17084 15.875 7.8125C15.6917 7.45417 15.45 7.13334 15.15 6.85L16.75 5.25C17.2833 5.73334 17.7 6.29584 18 6.9375C18.3 7.57917 18.45 8.26667 18.45 9C18.45 9.73334 18.3 10.4208 18 11.0625C17.7 11.7042 17.2833 12.2667 16.75 12.75ZM9 13C7.9 13 6.95833 12.6083 6.175 11.825C5.39167 11.0417 5 10.1 5 9C5 7.9 5.39167 6.95834 6.175 6.175C6.95833 5.39167 7.9 5 9 5C10.1 5 11.0417 5.39167 11.825 6.175C12.6083 6.95834 13 7.9 13 9C13 10.1 12.6083 11.0417 11.825 11.825C11.0417 12.6083 10.1 13 9 13ZM1 21V18.2C1 17.65 1.14167 17.1333 1.425 16.65C1.70833 16.1667 2.1 15.8 2.6 15.55C3.45 15.1167 4.40833 14.75 5.475 14.45C6.54167 14.15 7.71667 14 9 14C10.2833 14 11.4583 14.15 12.525 14.45C13.5917 14.75 14.55 15.1167 15.4 15.55C15.9 15.8 16.2917 16.1667 16.575 16.65C16.8583 17.1333 17 17.65 17 18.2V21H1ZM3 19H15V18.2C15 18.0167 14.9542 17.85 14.8625 17.7C14.7708 17.55 14.65 17.4333 14.5 17.35C13.9 17.05 13.1292 16.75 12.1875 16.45C11.2458 16.15 10.1833 16 9 16C7.81667 16 6.75417 16.15 5.8125 16.45C4.87083 16.75 4.1 17.05 3.5 17.35C3.35 17.4333 3.22917 17.55 3.1375 17.7C3.04583 17.85 3 18.0167 3 18.2V19ZM9 11C9.55 11 10.0208 10.8042 10.4125 10.4125C10.8042 10.0208 11 9.55 11 9C11 8.45 10.8042 7.97917 10.4125 7.5875C10.0208 7.19584 9.55 7 9 7C8.45 7 7.97917 7.19584 7.5875 7.5875C7.19583 7.97917 7 8.45 7 9C7 9.55 7.19583 10.0208 7.5875 10.4125C7.97917 10.8042 8.45 11 9 11Z"
                  fill="#262429"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div class="arabicBox">
        <div id="arabicText">${element.text_indopak}</div>
        <div id="arabicPlay" data-arabicAudioLink="https://verses.quran.com/${element.audio.url}">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_3_49"
              style="mask-type: alpha"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="24"
              height="24"
            >
              <rect width="24" height="24" fill="#D9D9D9" />
            </mask>
            <g mask="url(#mask0_3_49)">
              <path
                d="M9.5 16.5L16.5 12L9.5 7.5V16.5ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
                fill="#262429"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
    `
    );
  });
  if (resIndopak.pagination.next_page !== null) {
    if (document.querySelector(".showMoreBTN")) {
      const removeBtn = document.querySelector(".showMoreBTN");
      removeBtn.remove();
    }
    surahContent.insertAdjacentHTML(
      "afterend",
      `<div class="showMoreBTN">Show More</div>`
    );

    const showMoreBTN = document.querySelector(".showMoreBTN");
    console.log(showMoreBTN);
    showMoreBTN.addEventListener("click", function () {
      currentPageNumber++;
      genarateSurah(chapterNum, currentPageNumber);
      showMoreBTN.remove();
    });
  }

  // arabic audio
  const arabicPlay = document.querySelectorAll("#arabicPlay");
  arabicPlay.forEach((element) => {
    element.addEventListener("click", function (e) {
      console.log(e.target.closest("#arabicPlay").dataset.arabicaudiolink);
      fetch(e.target.closest("#arabicPlay").dataset.arabicaudiolink)
        .then((data) => data.arrayBuffer())
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((decodedAudio) => {
          audio = decodedAudio;

          play(audio);
        });
      audio = undefined;
    });
  });
};

chapterTitleGenarator();
genarateSurah();

// arabic audio
