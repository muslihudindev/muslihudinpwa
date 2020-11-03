var base_url = "https://api.football-data.org/v2/";
var optionsdate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
var loader = `<div class="progress">
<div class="indeterminate"></div>
</div>`;

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

//dateformat
function formatDate(date) {
  var d = new Date(date),
  month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear();
  
  if (month.length < 2) 
  month = '0' + month;
  if (day.length < 2) 
  day = '0' + day;
  
  return [year, month, day].join('-');
}

// Blok kode untuk melakukan request data json
function getDataTim() {
  
  if ("caches" in window) {
    caches.match(base_url + "competitions/2021/teams").then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var datatimHTML = resdatatim(data);
          
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("datatim").innerHTML = datatimHTML;
        });
      }
    });
  }
  
  
  var requestOptions = {
    method: 'GET',
    headers: {
      'X-Auth-Token': "70cafa8df7f942c689db882dde9863d1"
    },
    redirect: 'follow'
  };
  fetch(base_url + "competitions/2021/teams",requestOptions)
  .then(status)
  .then(json)
  .then(function(data) {
    // Objek/array JavaScript dari response.json() masuk lewat data.
    
    // Menyusun komponen card artikel secara dinamis
    var datatimHTML = resdatatim(data);
    
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("datatim").innerHTML = datatimHTML;
  })
  .catch(error);
}

function resdatatim(data) { 
  var datatimHTML = "";
  data.teams.forEach(function(datatim) {
    datatimHTML += `
    <ul class="collection">
    <li class="collection-item avatar">
    <img src="${datatim.crestUrl}" alt="${datatim.name}" class="circle">
    <span class="title">${datatim.name}</span>
    <p>${datatim.venue}<br>
    <a href="./datatim.html?id=${datatim.id}">
    <span>Profil tim <i class="material-icons iconlink">trending_flat</i></span>
    </a>
    </p>
    </li>
    </ul>
    `;
  });
  return datatimHTML;
}

function getArticleById() {
  
  document.getElementById("body-content").innerHTML = loader;
  
  return new Promise(function (resolve, reject) {
    // Ambil nilai query parameter (?id=)
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = urlParams.get("id");
    
    if ("caches" in window) {
      caches.match(base_url + "teams/" + idParam).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            var datatimHTML = resdatatimbyid(data);
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = datatimHTML;
            
            var collapsibles = document.querySelectorAll('.collapsible')
            for (var i = 0; i < collapsibles.length; i++){
              M.Collapsible.init(collapsibles[i]);
            }
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }
    
    var requestOptions = {
      method: 'GET',
      headers: {
        'X-Auth-Token': "70cafa8df7f942c689db882dde9863d1"
      },
      redirect: 'follow'
    };
    fetch(base_url + "teams/" + idParam,requestOptions)
    .then(status)
    .then(json)
    .then(function(data) {
      
      var datatimHTML = resdatatimbyid(data);
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = datatimHTML;
      
      var collapsibles = document.querySelectorAll('.collapsible')
      for (var i = 0; i < collapsibles.length; i++){
        M.Collapsible.init(collapsibles[i]);
      }
      // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
      resolve(data);
    });
  });
}

function resdatatimbyid(data) { 
  var kompetisi = `<ul class="collection">`;
  data.activeCompetitions.forEach(function(listkomp) {
    kompetisi += `
    <li class="collection-item">${listkomp.name} (${listkomp.area.name})</li>
    `;
  });
  kompetisi += "</ul>";
  
  var squad = `<table class="responsive-table">
  <thead>
  <tr>
  <th>Nama</th>
  <th>Posisi</th>
  <th>WN</th>
  </tr>
  </thead>
  <tbody>`;
  data.squad.forEach(function(listsquad) {
    squad += `
    <tr>
    <td>${listsquad.name}</td>
    <td>${listsquad.position}</td>
    <td>${listsquad.nationality}</td>
    </tr>
    `;
  });
  squad += "</tbody></table>";
  
  var datatimHTML = `
  <div class="card">
  <div class="card-content">
  <img src="${data.crestUrl}" width="30%" />
  <h3>${data.name}</h3>
  <blockquote>
  <p>Stadion : ${data.venue}</p>
  <p>Alamat : ${data.address}</p>
  <p>Telp : ${data.phone}</p>
  <p>Website : ${data.website}</p>
  <p>Email : ${data.email}</p>
  <p>Berdiri Tahun : ${data.founded}</p>
  <p>Warna Tim : ${data.clubColors}</p>
  </blockquote>
  <ul class="collapsible">
  <li>
  <div class="collapsible-header"><i class="material-icons">airplay</i>Kompetisi</div>
  <div class="collapsible-body">${kompetisi}</div>
  </li>
  <li>
  <div class="collapsible-header"><i class="material-icons">assignment_ind</i>Squad</div>
  <div class="collapsible-body">${squad}</div>
  </li>
  </ul>
  </div>
  </div>
  `;
  return datatimHTML;
}


function getSavedArticles() {
  
  document.getElementById("body-content").innerHTML = loader;
  
  getAll().then(function (datatim) {
    // Menyusun komponen card artikel secara dinamis
    if (datatim.length>0) {
      
      var datatimHTML = `<h3 class="light">Tim Favorit</h3><hr><div class="row"><div class="col s12 m12">`;
      datatim.forEach(function(datatim) {
        datatimHTML += `
        <ul class="collection">
        <li class="collection-item avatar">
        <img src="${datatim.crestUrl}" alt="${datatim.name}" class="circle">
        <span class="title">${datatim.name}</span>
        <p>${datatim.venue}<br>
        <a href="./datatim.html?id=${datatim.id}&saved=true">
        <span>Profil tim <i class="material-icons iconlink">trending_flat</i></span>
        </a>
        </p>
        </li>
        </ul>
        `;
      });
      datatimHTML += `</div>`;
    } else {
      var datatimHTML = `<h3 class="light">Tim Favorit</h3><hr><div class="row"><div class="col s12 m12">Anda Belum Memilih Tim Favorit</div></div>`;
    }
    // Sisipkan komponen card ke dalam elemen dengan id #body-content
    document.getElementById("body-content").innerHTML = datatimHTML;
  });
}

function getSavedArticleById() {
  
  document.getElementById("body-content").innerHTML = loader;
  
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(idParam).then(function (data) {
    
    var kompetisi = `<ul class="collection">`;
    data.activeCompetitions.forEach(function(listkomp) {
      kompetisi += `
      <li class="collection-item">${listkomp.name} (${listkomp.area.name})</li>
      `;
    });
    kompetisi += "</ul>";
    
    var squad = `<table class="responsive-table">
    <thead>
    <tr>
    <th>Nama</th>
    <th>Posisi</th>
    <th>WN</th>
    </tr>
    </thead>
    <tbody>`;
    data.squad.forEach(function(listsquad) {
      squad += `
      <tr>
      <td>${listsquad.name}</td>
      <td>${listsquad.position}</td>
      <td>${listsquad.nationality}</td>
      </tr>
      `;
    });
    squad += "</tbody></table>";
    
    var datatimHTML = `
    <div class="card">
    <div class="card-content">
    <img src="${data.crestUrl}" width="30%" />
    <h3>${data.name}</h3>
    <blockquote>
    <p>Stadion : ${data.venue}</p>
    <p>Alamat : ${data.address}</p>
    <p>Telp : ${data.phone}</p>
    <p>Website : ${data.website}</p>
    <p>Email : ${data.email}</p>
    <p>Berdiri Tahun : ${data.founded}</p>
    <p>Warna Tim : ${data.clubColors}</p>
    </blockquote>
    <ul class="collapsible">
    <li>
    <div class="collapsible-header"><i class="material-icons">airplay</i>Kompetisi</div>
    <div class="collapsible-body">${kompetisi}</div>
    </li>
    <li>
    <div class="collapsible-header"><i class="material-icons">assignment_ind</i>Squad</div>
    <div class="collapsible-body">${squad}</div>
    </li>
    </ul>
    </div>
    </div>              
    `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = datatimHTML;
  });
}

function getKompetisi() {
  
  var Day = new Date();
  var firstDay = formatDate(new Date());
  var nextWeek = formatDate(new Date(Day.getTime() + 7 * 24 * 60 * 60 * 1000));
  if ("caches" in window) {
    caches.match(base_url + "competitions/2021/matches?dateFrom="+firstDay+"&dateTo="+nextWeek).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          var datatimHTML = `<table class="striped"><thead><tr><th>${data.competition.name}</th></tr></thead><tbody>`;
          data.matches.forEach(function(datatim) {
            var d = new Date(datatim.utcDate);
            datatimHTML += `
            <tr><td>
            <strong>${d.toLocaleDateString("en-US",optionsdate)}</strong><br>
            ${datatim.homeTeam.name} VS ${datatim.awayTeam.name}
            </td></tr>
            `;
          });
          datatimHTML += `</tbody></table>`;
          // Sisipkan komponen card ke dalam elemen dengan id #content
          document.getElementById("competitions").innerHTML = datatimHTML;
          
        });
      }
    });
  }
  
  var requestOptions = {
    method: 'GET',
    headers: {
      'X-Auth-Token': "70cafa8df7f942c689db882dde9863d1"
    },
    redirect: 'follow'
  };
  fetch(base_url + "competitions/2021/matches?dateFrom="+firstDay+"&dateTo="+nextWeek,requestOptions)
  .then(status)
  .then(json)
  .then(function(data) {
    // Objek/array JavaScript dari response.json() masuk lewat data.
    // Menyusun komponen card artikel secara dinamis
    var datatimHTML = `<table class="highlight"><thead><tr><th>Jadwal Terbaru ${data.competition.name}</th></tr></thead><tbody>`;
    data.matches.forEach(function(datatim) {
      var d = new Date(datatim.utcDate);
      datatimHTML += `
      <tr><td>
      <strong>${d.toLocaleDateString("en-US",optionsdate)}</strong><br>
      ${datatim.homeTeam.name} VS ${datatim.awayTeam.name}
      </td></tr>
      `;
    });
    datatimHTML += `</tbody></table>`;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("competitions").innerHTML = datatimHTML;
    
  })
  .catch(error);
  
}


