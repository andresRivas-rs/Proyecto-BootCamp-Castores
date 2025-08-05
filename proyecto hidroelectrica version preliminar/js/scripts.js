const ctx = document.getElementById('graficoEnergia').getContext('2d');

// Datos reales: Capacidad instalada en MW (2000–2022)
const datosOficiales = [
  { año: 2000, hidro: 9800, solar: 0 },
  { año: 2001, hidro: 9900, solar: 0 },
  { año: 2002, hidro: 10000, solar: 0 },
  { año: 2003, hidro: 10050, solar: 0 },
  { año: 2004, hidro: 10100, solar: 0 },
  { año: 2005, hidro: 10150, solar: 0 },
  { año: 2006, hidro: 10200, solar: 0 },
  { año: 2007, hidro: 10250, solar: 0 },
  { año: 2008, hidro: 10300, solar: 0 },
  { año: 2009, hidro: 10400, solar: 0 },
  { año: 2010, hidro: 10450, solar: 0 },
  { año: 2011, hidro: 10500, solar: 0 },
  { año: 2012, hidro: 10550, solar: 0 },
  { año: 2013, hidro: 10600, solar: 0 },
  { año: 2014, hidro: 10650, solar: 0 },
  { año: 2015, hidro: 10700, solar: 0 },
  { año: 2016, hidro: 10700, solar: 0 },
  { año: 2017, hidro: 10800, solar: 1 },
  { año: 2018, hidro: 10900, solar: 20 },
  { año: 2019, hidro: 11000, solar: 100 },
  { año: 2020, hidro: 11100, solar: 250 },
  { año: 2021, hidro: 11200, solar: 350 },
  { año: 2022, hidro: 11300, solar: 650 }
];

// Extraer columnas
const anios = datosOficiales.map(d => d.año);
const solar = datosOficiales.map(d => d.solar);
const hidro = datosOficiales.map(d => d.hidro);

// Crear gráfico
let grafico = new Chart(ctx, {
  type: 'line',
  data: {
    labels: anios,
    datasets: [
      {
        label: 'Capacidad Solar (MW)',
        data: solar,
        borderColor: '#f39c12',
        backgroundColor: 'rgba(243, 156, 18, 0.2)',
        fill: true,
        tension: 0.3
      },
      {
        label: 'Capacidad Hidroeléctrica (MW)',
        data: hidro,
        borderColor: '#3498db',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        fill: true,
        tension: 0.3
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Capacidad Instalada en Colombia (2000–2022)',
        font: { size: 18 }
      }
    },
    scales: {
      y: {
        title: { display: true, text: 'MW' }
      },
      x: {
        title: { display: true, text: 'Año' }
      }
    }
  }
});

// Mostrar tabla inicial
actualizarTabla(datosOficiales);

// Actualizar gráfico y tabla
function actualizarGraficoDesdeDatos(datos) {
  grafico.data.labels = datos.map(d => d.año);
  grafico.data.datasets[0].data = datos.map(d => d.solar);
  grafico.data.datasets[1].data = datos.map(d => d.hidro);
  grafico.update();

  actualizarTabla(datos);
}

// Mostrar tabla
function actualizarTabla(datos) {
  const cuerpo = document.getElementById('tablaDatos');
  cuerpo.innerHTML = '';
  datos.forEach(d => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${d.año}</td>
      <td>${d.solar}</td>
      <td>${d.hidro}</td>
    `;
    cuerpo.appendChild(fila);
  });
}

// Carga externa de archivo (opcional)
document.getElementById('archivoInput').addEventListener('change', function (e) {
  const archivo = e.target.files[0];
  if (!archivo) return;

  const lector = new FileReader();
  lector.onload = function (event) {
    const texto = event.target.result;
    try {
      let datos;
      if (archivo.name.endsWith('.json')) {
        const dataOriginal = JSON.parse(texto);

        // Armoniza nombres de campos para el gráfico
        datos = dataOriginal.map(d => ({
          año: d.Año || d.Anio || d.año || d.anio,
          hidro: Number(d.Capacidad_Hidroelectrica_MW || d.hidro || d.Hidro || d.HIDRO || d.Hidroeléctrica || 0),
          solar: Number(d.Capacidad_Solar_MW || d.solar || d.Solar || d.SOLAR || 0)
        }));

      } else if (archivo.name.endsWith('.csv')) {
        const filas = texto.trim().split('\n');
        datos = filas.slice(1).map(fila => {
          const [anio, hidro, solar] = fila.split(',').map(s => s.trim());
          return {
            año: parseInt(anio),
            hidro: parseFloat(hidro),
            solar: parseFloat(solar)
          };
        });
      } else {
        alert("Formato no soportado. Usa .json o .csv");
        return;
      }

      // Opcional: Asegura que los ceros también se muestran (no filtrar ceros)
      // Puedes filtrar solo valores nulos/NaN si quieres
      datos = datos.filter(d => 
        d.año !== undefined && !isNaN(d.año) &&
        d.hidro !== null && !isNaN(d.hidro) &&
        d.solar !== null && !isNaN(d.solar)
      );

      console.log(datos); // Para depuración, ver que haya ceros
      actualizarGraficoDesdeDatos(datos);
    } catch (e) {
      alert("Error al procesar el archivo: " + e.message);
    }
  };

  lector.readAsText(archivo);
});

document.getElementById('formCalculadora').addEventListener('submit', function (e) {
  e.preventDefault();

  const consumo = parseFloat(document.getElementById('consumoInput').value);
  const resultadoDiv = document.getElementById('resultado');

  if (isNaN(consumo) || consumo <= 0) {
    resultadoDiv.textContent = 'Por favor, ingresa un valor válido en kWh.';
    return;
  }

  // Suponiendo un 40% de energía renovable disponible según datos de referencia
  const porcentajeRenovable = 40;
  const energiaRenovable = (consumo * porcentajeRenovable) / 100;

  resultadoDiv.innerHTML = `
    De tu consumo de <strong>${consumo} kWh</strong>, aproximadamente 
    <strong>${energiaRenovable.toFixed(1)} kWh</strong> podrían ser cubiertos con energía renovable.
    <br><span class="text-success">Estimación basada en una participación del 40% de renovables en la matriz energética.</span>
  `;
});
