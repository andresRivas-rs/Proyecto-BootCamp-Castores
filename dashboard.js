// Datos base reales y estimados
const labels = ["Hidroituango", "Guavio", "San Carlos", "Urra I", "Chivor"];
const capacidades = [2400, 1250, 1240, 340, 1000]; // MW
const generacion = [13000, 8700, 9500, 4300, 7000]; // GWh aproximado/realizado

const totalGen = generacion.reduce((a,b)=>a+b,0);
const participacion = generacion.map(g=>(g/totalGen*100).toFixed(1));

// Gráfico de barras: capacidad instalada
new Chart(document.getElementById('graficoCapacidad').getContext('2d'), {
  type: 'bar',
  data: { labels, datasets:[{
    label:'Capacidad (MW)', data:capacidades,
    backgroundColor:['#007bff','#28a745','#ffc107','#17a2b8','#dc3545']
  }]},
  options:{ responsive:true, plugins:{ title:{ display:true, text:'Capacidad instalada por hidroeléctrica' }}, scales:{ y:{ beginAtZero:true } }}
});

// Gráfico de torta: participación en generación
new Chart(document.getElementById('graficoParticipacion').getContext('2d'), {
  type:'pie',
  data:{ labels:labels.map((l,i)=>`${l} (${participacion[i]}%)`),
    datasets:[{ label:'%', data:participacion, backgroundColor:['#007bff','#28a745','#ffc107','#17a2b8','#dc3545'] }]
  },
  options:{ responsive:true, plugins:{ title:{ display:true, text:'Participación en generación entre hidroeléctricas' } }}
});

// Gráfico de líneas: tendencia capacidad instalada nacional (2020‑2025)
const años=[2020,2021,2022,2023,2024,2025];
const capacidadNacional=[14000,14500,15000,15500,16000,16500]; // valores estimados según expansión del SIN
new Chart(document.getElementById('graficoLinea').getContext('2d'), {
  type:'line',
  data:{ labels:años, datasets:[{
    label:'Capacidad Nacional (MW)', data:capacidadNacional,
    borderColor:'#17a2b8', fill:false
  }]},
  options:{ responsive:true, plugins:{ title:{ display:true, text:'Tendencia capacidad hidráulica nacional (2020‑2025)' }}}
});

// Gráfico de área: consumo renovable vs convencional (estimado GWh)
const renov=[34000,35000,36000,37000,39000,40500]; // hidroeléctrica
const convencional=[17000,16500,16000,15800,15500,15000]; // térmica
new Chart(document.getElementById('graficoArea').getContext('2d'), {
  type:'line',
  data:{ labels:años, datasets:[
      { label:'Hidroeléctricas (GWh)', data:renov, backgroundColor:'rgba(76,175,80,0.3)', borderColor:'#4caf50', fill:true },
      { label:'Térmica (GWh)', data:convencional, backgroundColor:'rgba(244,67,54,0.3)', borderColor:'#f44336', fill:true }
    ]
  },
  options:{ responsive:true, plugins:{ title:{ display:true, text:'Generación renovable vs térmica (2020‑2025)' }}}
});