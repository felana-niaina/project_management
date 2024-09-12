// BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartData {
  sprintName: string;
  heuresTravaillees: number;
  tachesRestantes: number;
  tachesEnRetard: number;
}

interface BarChartProps {
  data: BarChartData[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Préparer les données pour le graphique
  const chartData = {
    labels: data.map(item => item.sprintName), // Noms des sprints
    datasets: [
      {
        label: 'Heures travaillées',
        data: data.map(d => d.heuresTravaillees),
        backgroundColor: 'rgb(255, 163, 70)',
      },
      {
        label: 'Tâches restantes',
        data: data.map(d => d.tachesRestantes),
        backgroundColor: 'rgb(0, 128, 64)',
      },
      {
        label: 'Tâches en retard',
        data: data.map(d => d.tachesEnRetard),
        backgroundColor: 'rgb(156, 1, 1)',  // Different color for overdue tasks
      },
    ],
  };

  // Configuration du graphique
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem :any) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sprints'
        }
      },
      y: {
        beginAtZero: true,
        min: 0,
        title: {
          display: true,
          text: 'Valeur'
        }
      }
    }
  };

  return (
    <div>
      <h3 style={{display:"flex", justifyContent:"center",marginBottom:"20px",marginTop:"30px"}}>Suivi des Heures Travaillées, Tâches Restantes et Tâches en Retard</h3>
      <Bar data={chartData} options={options as any} />
    </div>
);
};

export default BarChart;
