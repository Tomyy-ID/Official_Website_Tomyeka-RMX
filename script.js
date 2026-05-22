/* ======================================================
API KEY
====================================================== */

const apiKey =
"AIzaSyBJT03o2pl_2wSE54mWpoITz8a1zHrKi3A";

/* ======================================================
MOBILE MENU
====================================================== */

const menuToggle =
document.getElementById(
"menuToggle"
);

const navMenu =
document.getElementById(
"navMenu"
);

menuToggle.addEventListener(
"click",
() => {

navMenu.classList.toggle(
"active"
);

}
);

/* ======================================================
ELEMENT
====================================================== */

const projectTable =
document.getElementById(
"projectTable"
);

const searchProject =
document.getElementById(
"searchProject"
);

const filterButtons =
document.querySelectorAll(
".filter-btn"
);

/* ======================================================
VIEW CACHE
====================================================== */

const viewCache = {};

/* ======================================================
CURRENT FILTER
====================================================== */

let currentFilter = "all";

/* ======================================================
RENDER PROJECT
====================================================== */

async function renderProjects(data){

projectTable.innerHTML = "";

for(const project of data){

let views = 0;

try{

if(viewCache[project.videoid]){

views =
viewCache[project.videoid];

}else{

const response =
await fetch(

`https://www.googleapis.com/youtube/v3/videos?id=${project.videoid}&part=statistics&key=${apiKey}`

);

const result =
await response.json();

views =
parseInt(
result.items[0]
.statistics.viewCount
);

viewCache[project.videoid] =
views;

}

}catch{

views = 0;

}

let statusBadge = "";

if(views >= 1000){

statusBadge =
`
<span class="project-info">
1K Views ✅
</span>
`;

}else{

statusBadge =
`
<span class="project-info">
${views} Views
</span>
`;

}

projectTable.innerHTML += `

<tr>

<td class="project-number">
${project.no}
</td>

<td class="project-title">
${project.title}
</td>

<td>

<div style="
display:flex;
gap:10px;
flex-wrap:wrap;
">

<span class="project-info">
${project.info}
</span>

${statusBadge}

</div>

</td>

<td>

<button class="download-btn openPopup"

data-title="${project.title}"
data-type="${project.type}"
data-size="${project.size}"
data-date="${project.date}"
data-videoid="${project.videoid}"
data-link="${project.link}">

⬇ Download

</button>

</td>

</tr>

`;

}

setupPopup();

}

/* ======================================================
LOAD PROJECT
====================================================== */

async function loadProjects(){

let filtered =
[...projects].reverse();

/* SEARCH */

const keyword =
searchProject.value
.toLowerCase();

filtered =
filtered.filter(project =>

project.title
.toLowerCase()
.includes(keyword)

);

/* FILTER */

if(currentFilter !== "all"){

const temp = [];

for(const project of filtered){

let views = 0;

try{

if(viewCache[project.videoid]){

views =
viewCache[project.videoid];

}else{

const response =
await fetch(

`https://www.googleapis.com/youtube/v3/videos?id=${project.videoid}&part=statistics&key=${apiKey}`

);

const result =
await response.json();

views =
parseInt(
result.items[0]
.statistics.viewCount
);

viewCache[project.videoid] =
views;

}

}catch{

views = 0;

}

/* FILTER LOGIC */

if(
currentFilter === "unlocked"
&& views >= 1000
){

temp.push(project);

}

if(
currentFilter === "locked"
&& views < 1000
){

temp.push(project);

}

if(
currentFilter === "edited"
&& project.info
.toLowerCase()
.includes("edit")
){

temp.push(project);

}

}

filtered = temp;

}

renderProjects(filtered);

}

/* ======================================================
SEARCH
====================================================== */

searchProject.addEventListener(
"keyup",
() => {

loadProjects();

}
);

/* ======================================================
FILTER BUTTON
====================================================== */

filterButtons.forEach(button => {

button.addEventListener(
"click",
() => {

filterButtons.forEach(btn => {

btn.classList.remove(
"active-filter"
);

});

button.classList.add(
"active-filter"
);

currentFilter =
button.dataset.filter;

loadProjects();

}
);

});

/* ======================================================
POPUP ELEMENT
====================================================== */

const popupOverlay =
document.getElementById(
"popupOverlay"
);

const closePopup =
document.getElementById(
"closePopup"
);

const popupTitle =
document.getElementById(
"popupTitle"
);

const popupType =
document.getElementById(
"popupType"
);

const popupSize =
document.getElementById(
"popupSize"
);

const popupDate =
document.getElementById(
"popupDate"
);

const popupViews =
document.getElementById(
"popupViews"
);

const popupStatus =
document.getElementById(
"popupStatus"
);

const popupDownloadBtn =
document.getElementById(
"popupDownloadBtn"
);

const progressFill =
document.getElementById(
"progressFill"
);

const progressPercent =
document.getElementById(
"progressPercent"
);

/* ======================================================
SETUP POPUP
====================================================== */

function setupPopup(){

const popupButtons =
document.querySelectorAll(
".openPopup"
);

popupButtons.forEach(button => {

button.addEventListener(
"click",
async () => {

popupOverlay.classList.add(
"active"
);

popupTitle.innerHTML =
button.dataset.title;

popupType.innerHTML =
button.dataset.type;

popupSize.innerHTML =
button.dataset.size;

popupDate.innerHTML =
button.dataset.date;

popupDownloadBtn.disabled =
true;

popupDownloadBtn.innerHTML =
"⏳ Mengecek Views...";

popupStatus.innerHTML =
"Checking...";

progressFill.style.width =
"0%";

progressPercent.innerHTML =
"0%";

const videoId =
button.dataset.videoid;

const downloadLink =
button.dataset.link;

try{

let views;

if(viewCache[videoId]){

views =
viewCache[videoId];

}else{

const response =
await fetch(

`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${apiKey}`

);

const data =
await response.json();

views =
parseInt(
data.items[0]
.statistics.viewCount
);

viewCache[videoId] =
views;

}

popupViews.innerHTML =
`Views : ${views.toLocaleString()}`;

let percent =
Math.min(
(views / 1000) * 100,
100
);

progressFill.style.width =
percent + "%";

progressPercent.innerHTML =
Math.floor(percent) + "%";

if(views >= 1000){

popupStatus.innerHTML =
"Unlocked ✅";

popupDownloadBtn.disabled =
false;

popupDownloadBtn.innerHTML =
"⬇ Download Sekarang";

popupDownloadBtn.onclick =
() => {

window.open(
downloadLink,
"_blank"
);

};

}else{

popupStatus.innerHTML =
"Locked 🔒";

popupDownloadBtn.disabled =
true;

popupDownloadBtn.innerHTML =
`🔒 Kurang ${
1000 - views
} Views`;

}

}catch(error){

popupStatus.innerHTML =
"Error";

popupDownloadBtn.innerHTML =
"❌ Gagal mengambil data";

console.log(error);

}

}
);

});

}

/* ======================================================
CLOSE POPUP
====================================================== */

closePopup.addEventListener(
"click",
() => {

popupOverlay.classList.remove(
"active"
);

}
);

popupOverlay.addEventListener(
"click",
(e) => {

if(
e.target === popupOverlay
){

popupOverlay.classList.remove(
"active"
);

}

}
);

/* ======================================================
INIT
====================================================== */

loadProjects();