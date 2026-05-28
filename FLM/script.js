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

if(menuToggle){

menuToggle.addEventListener(
"click",
() => {

navMenu.classList.toggle(
"active"
);

}
);

}

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
CACHE
====================================================== */

const viewCache = {};

let currentFilter = "all";

/* ======================================================
GO TO DOWNLOAD
====================================================== */

function goToDownload(id){

window.location.href =
`../DOWNLOAD/download.html?id=${id}`;

}

/* ======================================================
GET YOUTUBE VIEWS
====================================================== */

async function getViews(videoId){

try{

if(viewCache[videoId]){

return viewCache[videoId];

}

const response =
await fetch(

`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=statistics&key=${apiKey}`

);

const result =
await response.json();

if(
!result.items ||
!result.items.length
){

return 0;

}

const views =
parseInt(
result.items[0]
.statistics.viewCount
);

viewCache[videoId] =
views;

return views;

}catch(error){

console.log(error);

return 0;

}

}

/* ======================================================
RENDER PROJECT TABLE
====================================================== */

async function renderProjects(data){

if(!projectTable) return;

projectTable.innerHTML = "";

for(const project of data){

const views =
await getViews(
project.videoid
);

const unlocked =
views >= 1000;

projectTable.innerHTML += `

<tr>

<td class="project-number">
${project.no}
</td>

<td class="project-title">
${project.title}
</td>

<td>

<div class="project-flex">

<span class="project-info">
${project.info}
</span>

<span class="project-info">

${unlocked
? '1K Views ✅'
: `${views.toLocaleString()} Views`}

</span>

</div>

</td>

<td>

<button

class="download-btn
${unlocked
? 'unlock'
: 'lock'}"

onclick="
goToDownload(
'${project.id}'
)
">

${unlocked
? '⬇ Download'
: '🔒 Locked'}

</button>

</td>

</tr>

`;

}

}

/* ======================================================
LOAD PROJECTS
====================================================== */

async function loadProjects(){

if(!projectTable) return;

let filtered =
[...projects].reverse();

/* SEARCH */

if(searchProject){

const keyword =
searchProject.value
.toLowerCase();

filtered =
filtered.filter(project =>

project.title
.toLowerCase()
.includes(keyword)

);

}

/* FILTER */

if(currentFilter !== "all"){

const temp = [];

for(const project of filtered){

const views =
await getViews(
project.videoid
);

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

}

filtered = temp;

}

renderProjects(filtered);

}

/* ======================================================
SEARCH EVENT
====================================================== */

if(searchProject){

searchProject.addEventListener(
"keyup",
() => {

loadProjects();

}
);

}

/* ======================================================
FILTER EVENT
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
INIT PROJECT PAGE
====================================================== */

loadProjects();

/* ======================================================
DOWNLOAD PAGE
====================================================== */

const downloadTitle =
document.getElementById(
"title"
);

if(downloadTitle){

const params =
new URLSearchParams(
window.location.search
);

const id =
params.get("id");

const project =
projects.find(
p => p.id == id
);

const viewsText =
document.getElementById(
"views"
);

const type =
document.getElementById(
"type"
);

const size =
document.getElementById(
"size"
);

const date =
document.getElementById(
"date"
);

const status =
document.getElementById(
"status"
);

const btn =
document.getElementById(
"downloadBtn"
);

const fileName =
document.getElementById(
"fileName"
);

const videoId =
document.getElementById(
"videoId"
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
SET DATA
====================================================== */

if(project){

/* TITLE */

document.title =
`${project.title} | Tomy Eka RMX`;

downloadTitle.innerHTML =
project.title;

/* TYPE */

if(type){

type.innerHTML =
project.type;

}

/* SIZE */

if(size){

size.innerHTML =
project.size;

}

/* DATE */

if(date){

date.innerHTML =
project.date;

}

/* FILE NAME */

if(fileName){

fileName.innerHTML =
project.title;

}

/* VIDEO ID */

if(videoId){

videoId.innerHTML =
project.videoid;

}

/* LOAD YOUTUBE VIEW */

loadDownloadViews();

}

/* ======================================================
LOAD DOWNLOAD VIEWS
====================================================== */

async function loadDownloadViews(){

try{

const response =
await fetch(

`https://www.googleapis.com/youtube/v3/videos?id=${project.videoid}&part=statistics&key=${apiKey}`

);

const data =
await response.json();

if(
!data.items ||
!data.items.length
){

status.innerHTML =
"Video Tidak Ditemukan";

return;

}

const views =
parseInt(
data.items[0]
.statistics.viewCount
);

/* VIEW TEXT */

viewsText.innerHTML =
`Views : ${views.toLocaleString()}`;

/* PROGRESS */

const percent =
Math.min(
(views / 1000) * 100,
100
);

progressFill.style.width =
percent + "%";

progressPercent.innerHTML =
Math.floor(percent) + "%";

/* UNLOCK */

if(views >= 1000){

status.innerHTML =
"Unlocked ✅";

btn.disabled = false;

btn.innerHTML =
"⬇ Download Sekarang";

btn.onclick = () => {

window.open(
project.link,
"_blank"
);

};

}else{

status.innerHTML =
"Locked 🔒";

btn.disabled = true;

btn.innerHTML =
`🔒 Kurang ${
1000 - views
} Views`;

}

}catch(error){

console.log(error);

status.innerHTML =
"Error Load Data";

}

}

}