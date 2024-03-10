"use strict";
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
