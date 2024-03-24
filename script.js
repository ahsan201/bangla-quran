"use strict";
// toggle button
const toggoleBox = document.getElementById("toggoleBox");
const surah = document.getElementById("surah");
const juz = document.getElementById("juz");
const surahSection = document.querySelector(".surahSection");
const juzSection = document.querySelector(".juzSection");

// surah.addEventListener("click", function () {
//   toggoleBox.style.margin = "0% 0% 0% -47%";
//   changeView();
// });
// juz.addEventListener("click", function () {
//   toggoleBox.style.margin = "0% 0% 0% 47%";
//   changeView();
// });

// const changeView = function () {
//   surahSection.classList.toggle("hide");
//   juzSection.classList.toggle("hide");
// };

// Surah list / chapter list
const chapter = document.querySelector("#chapter ul");
const unorderedList = function (api) {
  chapter.innerHTML = "";
  api.chapters.forEach((element) => {
    chapter.insertAdjacentHTML(
      "beforeend",
      `<li>${element.id}. ${element.name_simple}</li>`
    );
  });
};
const genarateChapter = async function () {
  const apiCall = await fetch("https://api.quran.com/api/v4/chapters");
  const res = await apiCall.json();
  unorderedList(res);
};

// Search Chapter
const searchChapter = document.querySelector("[data-search-chapter]");

searchChapter.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  const surahListSelect = document.querySelectorAll("#chapter ul li");

  surahListSelect.forEach((surah) => {
    const isVisible = surah.textContent.toLowerCase().includes(value);
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
// const chapterLines = document.querySelector("#chapterLines ul");

// const getVerses = async function (element) {
//   const verse = await fetch(
//     `https://api.quran.com/api/v4/verses/by_chapter/${parseInt(
//       element.target.textContent
//     )}`
//   );
//   const verseJson = await verse.json();

//   for (let i = 1; i <= Number(verseJson.pagination.total_records); i++) {
//     chapterLines.insertAdjacentHTML("beforeend", `<li>${i}</li>`);
//   }
// };
let currentPageNumber = 1;
chapter.addEventListener("click", (e) => {
  surahContent.innerHTML = "";
  surahTitle.innerHTML = "";
  currentPageNumber = 1;
  if (document.querySelector(".showMoreBTN")) {
    const removeBtn = document.querySelector(".showMoreBTN");
    removeBtn.remove();
  }
  if (e.target.tagName == "LI") {
    for (let i = 0; i < e.target.parentElement.children.length; i++) {
      e.target.parentElement.children.item(i).classList.remove("selected");
    }
    e.target.classList.add("selected");
  }
  chapterTitleGenarator(parseInt(e.target.textContent));
  genarateSurah(parseInt(e.target.textContent));
  // getVerses(e);
});

// Surah / titel Titel

const chapterTitleGenarator = async function (chapterNum = 1) {
  skeletonLoadingTitle();
  const dataChapterTitle = await fetch(
    `https://api.quran.com/api/v4/chapters/${chapterNum}    `
  );
  const resChapterTitle = await dataChapterTitle.json();
  surahTitle.innerHTML = "";
  surahTitle.insertAdjacentHTML(
    "beforeend",
    `<span id="englishTitle">${resChapterTitle.chapter.name_simple}</span> /
<span id="arabicTitle">${resChapterTitle.chapter.name_arabic}</span>`
  );
};
// arabic audio constructor section
const ctx = new AudioContext();
let isPlaying = false;
let playSound; // Define playSound outside the play function

function play(targetAudio, nextAudio) {
  // If there's an existing playSound, stop it before starting a new one
  if (playSound) {
    playSound.stop();
  }

  // Create a new buffer source
  playSound = ctx.createBufferSource();
  playSound.buffer = targetAudio;
  playSound.connect(ctx.destination);

  // Add event listener to detect when the audio playback ends
  // trying to impliment autoplay function will go here
  // playSound.onended = function () {
  //   play(nextAudio);
  // };

  playSound.start(ctx.currentTime);
}

// surah / chapter Content
const genarateSurah = async function (chapterNum = 1, page = 1) {
  skeletonLoadingContent();
  const dataIndopak = await fetch(
    `https://api.quran.com/api/v4/verses/by_chapter/${chapterNum}?translations=162&audio=7&fields=text_indopak&page=${page}&per_page=30`
  );
  const resIndopak = await dataIndopak.json();
  let audio;
  const skeleton = document.querySelectorAll(".skeleton");
  skeleton.forEach((element) => {
    element.parentElement.parentElement.remove();
  });
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
      const nextLine = e.target
        .closest(".surahBox")
        .nextElementSibling.querySelector("#arabicPlay")
        .dataset.arabicaudiolink;

      fetch(e.target.closest("#arabicPlay").dataset.arabicaudiolink)
        .then((data) => data.arrayBuffer())
        .then((arrayBuffer) => ctx.decodeAudioData(arrayBuffer))
        .then((decodedAudio) => {
          audio = decodedAudio;

          play(audio, nextLine);
        });
      audio = undefined;
    });
  });
  // get to a particualr part of the chatper verse
  const surahBox = document.querySelectorAll(".surahBox");
  const chapterLinesNumber = document.querySelector("#chapterLines ul");

  // chapterLinesNumber.addEventListener("click", function (e) {
  //   console.log(e.target.textContent);
  //   surahBox[e.target.textContent - 1].scrollIntoView({
  //     behavior: "smooth",
  //   });
  // });
};
// skeleton Loading
const skeletonLoadingContent = function () {
  surahContent.insertAdjacentHTML(
    "beforeend",
    `
  <div class="surahBox">
  <div class="translationBox">
  <div id="lineNumber" class="skeleton skeleton-text" style="width:10%"></div>
  <div id="translationText" class="skeleton skeleton-text"></div>
    <div id="translation">
      <div id="translationText" class="skeleton skeleton-text"></div>
      <div id="translationPlay">
        
      </div>
    </div>
  </div>
  <div class="arabicBox">
    <div id="arabicText" class="skeleton skeleton-text" style="margin-left: 10px;margin-top:10px">
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    </div>
    <div id="arabicPlay">
      <div class="skeleton iconBox"></div>
    </div>
  </div>
</div>
<div class="surahBox">
  <div class="translationBox">
  <div id="lineNumber" class="skeleton skeleton-text" style="width:10%"></div>
  <div id="translationText" class="skeleton skeleton-text"></div>
    <div id="translation">
      <div id="translationText" class="skeleton skeleton-text"></div>
      <div id="translationPlay">
        
      </div>
    </div>
  </div>
  <div class="arabicBox">
    <div id="arabicText" class="skeleton skeleton-text" style="margin-left: 10px;margin-top:10px">
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    </div>
    <div id="arabicPlay">
      <div class="skeleton iconBox"></div>
    </div>
  </div>
</div>
<div class="surahBox">
  <div class="translationBox">
  <div id="lineNumber" class="skeleton skeleton-text" style="width:10%"></div>
  <div id="translationText" class="skeleton skeleton-text"></div>
    <div id="translation">
      <div id="translationText" class="skeleton skeleton-text"></div>
      <div id="translationPlay">
        
      </div>
    </div>
  </div>
  <div class="arabicBox">
    <div id="arabicText" class="skeleton skeleton-text" style="margin-left: 10px;margin-top:10px">
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    </div>
    <div id="arabicPlay">
      <div class="skeleton iconBox"></div>
    </div>
  </div>
</div>
<div class="surahBox">
  <div class="translationBox">
  <div id="lineNumber" class="skeleton skeleton-text" style="width:10%"></div>
  <div id="translationText" class="skeleton skeleton-text"></div>
    <div id="translation">
      <div id="translationText" class="skeleton skeleton-text"></div>
      <div id="translationPlay">
        
      </div>
    </div>
  </div>
  <div class="arabicBox">
    <div id="arabicText" class="skeleton skeleton-text" style="margin-left: 10px;margin-top:10px">
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    </div>
    <div id="arabicPlay">
      <div class="skeleton iconBox"></div>
    </div>
  </div>
</div>
<div class="surahBox">
  <div class="translationBox">
  <div id="lineNumber" class="skeleton skeleton-text" style="width:10%"></div>
  <div id="translationText" class="skeleton skeleton-text"></div>
    <div id="translation">
      <div id="translationText" class="skeleton skeleton-text"></div>
      <div id="translationPlay">
        
      </div>
    </div>
  </div>
  <div class="arabicBox">
    <div id="arabicText" class="skeleton skeleton-text" style="margin-left: 10px;margin-top:10px">
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    </div>
    <div id="arabicPlay">
      <div class="skeleton iconBox"></div>
    </div>
  </div>
</div>
<div class="surahBox">
  <div class="translationBox">
  <div id="lineNumber" class="skeleton skeleton-text" style="width:10%"></div>
  <div id="translationText" class="skeleton skeleton-text"></div>
    <div id="translation">
      <div id="translationText" class="skeleton skeleton-text"></div>
      <div id="translationPlay">
        
      </div>
    </div>
  </div>
  <div class="arabicBox">
    <div id="arabicText" class="skeleton skeleton-text" style="margin-left: 10px;margin-top:10px">
    <div class="skeleton skeleton-text"></div>
    <div class="skeleton skeleton-text"></div>
    </div>
    <div id="arabicPlay">
      <div class="skeleton iconBox"></div>
    </div>
  </div>
</div>
`
  );
};

const skeletonLoadingTitle = function () {
  surahTitle.innerHTML = `<div id="englishTitle" class="skeleton skeleton-surahTitle"></div> <div id="englishTitle" class="skeleton skeleton-surahTitle"></div>`;
};

//responsive chapter section
const arrow = document.getElementById("arrow");
const contentNavigation = document.getElementById("contentNavigation");
arrow.addEventListener("click", function () {
  contentNavigation.classList.toggle("sideChapterSection");
});
genarateChapter();
chapterTitleGenarator();
genarateSurah();

// info overlay
const info = document.getElementById("info");
const overlayContainer = document.getElementById("overlayContainer");
const overlayBox = document.getElementById("overlayBox");
const close = document.getElementById("close");

info.addEventListener("click", function () {
  if (overlayContainer.style.display == "grid") {
    overlayContainer.style.display = "none";
  } else {
    overlayContainer.style.display = "grid";
  }
});

overlayContainer.addEventListener("click", function () {
  overlayContainer.style.display = "none";
});

close.addEventListener("click", function () {
  overlayContainer.style.display = "none";
});
