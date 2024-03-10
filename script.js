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
const chapterLines = document.querySelector("#chapterLines ul");
// const chapter = document.querySelector("#chapter ul");
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
chapter.addEventListener("click", (e) => {
  chapterLines.innerHTML = "";
  if (e.target.tagName == "LI") {
    for (let i = 0; i < e.target.parentElement.children.length; i++) {
      e.target.parentElement.children.item(i).classList.remove("selected");
    }
    e.target.classList.add("selected");
  }
  getVerses(e);
});
