const apiKey =
"AIzaSyBJT03o2pl_2wSE54mWpoITz8a1zHrKi3A";

const projectTable =
document.getElementById(
"projectTable"
);

const searchProject =
document.getElementById(
"searchProject"
);

async function renderProjects(data){

projectTable.innerHTML = "";

for(const project of data){

let views = 0;

try{

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

}catch{

views = 0;

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

<span class="project-info">
${views} Views
</span>

</div>

</td>

<td>

<a class="download-btn"
href="download.html?id=${project.no}">

⬇ Download

</a>

</td>

</tr>

`;

}

}

function loadProjects(){

const keyword =
searchProject.value
.toLowerCase();

const filtered =
projects.filter(project =>

project.title
.toLowerCase()
.includes(keyword)

);

renderProjects(filtered);

}

searchProject.addEventListener(
"keyup",
loadProjects
);

loadProjects();