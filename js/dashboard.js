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

// Gráfico de área: consumo renovable vs convencional (estimado TWh)
const años2 = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

const hidros =     [113.1,117.6,143.3,140.9,134.7,123.1,149.0,158.1,145.9,132.9];
const solars =     [0.0,0.0,0.0,0.0,0.3,0.5,0.8,1.2,2.9,8.1];
const eolicas =    [0.2,0.1,0.0,0.1,0.2,0.0,0.1,0.2,0.5,0.4];
const carbons =    [57.8,63.5,48.4,45.5,53.6,47.5,37.7,49.4,54.3,61.6];
const gass =       [200.2,225.0,222.0,232.5,231.4,192.9,227.3,266.9,254.8,252.6];
const petroleos =  [112.1,120.7,118.3,127.3,128.7,131.2,126.3,125.9,130.5,134.5];

new Chart(document.getElementById('graficoArea').getContext('2d'), {
  type: 'line',
  data: {
    labels: años,
    datasets: [
      // Renovables
      {label: 'Hidroeléctrica (TWh)',
        data: hidros,
        backgroundColor: 'rgba(76,175,80,0.3)',
        borderColor: '#4caf50',
        fill: true,},
      {label: 'Solar (TWh)',
        data: solars,
        backgroundColor: 'rgba(255,235,59,0.3)',
        borderColor: '#fbc02d',
        fill: true,},
      {label: 'Eólica (TWh)',
        data: eolicas,
        backgroundColor: 'rgba(33,150,243,0.3)',
        borderColor: '#2196f3',
        fill: true,},

      // Convencionales
      {label: 'Carbón (TWh)',
        data: carbons,
        backgroundColor: 'rgba(121,85,72,0.3)',
        borderColor: '#795548',
        fill: true,},
      {label: 'Gas (TWh)',
        data: gass,
        backgroundColor: 'rgba(158,158,158,0.3)',
        borderColor: '#9e9e9e',
        fill: true,},
      {label: 'Petróleo (TWh)',
        data: petroleos,
        backgroundColor: 'rgba(255,87,34,0.3)',
        borderColor: '#ff5722',
        fill: true,}
    ]
  },
  options:{ responsive:true, plugins:{ title:{ display:true, text:'Generación renovable vs térmica (2020‑2025)' }}}
});