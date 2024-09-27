import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrer les composants nécessaires de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TaskDetails {
  taskName: string;
  deadline: string;
  assignee: string;
}

interface SprintData {
  sprintName: string;
  tachesEnRetard: number;
  tachesDetails: TaskDetails[];
}

interface StackedBarChartProps {
  chartData: SprintData[];
}

const BarChart: React.FC<StackedBarChartProps> = ({ chartData }) => {
  const sprintLabels = chartData.map(sprint => sprint.sprintName);

  const datasets = chartData.flatMap((sprint, index) =>
    sprint.tachesDetails.map((task) => ({
      label: `${task.taskName} (Assigné à: ${task.assignee}, Deadline: ${task.deadline})`,
      data: sprintLabels.map((_, idx) => (idx === index ? 1 : 0)), // 1 pour la barre empilée, 0 sinon
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`,
    }))
  );

  const data = {
    labels: sprintLabels,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context :any) {
            return context.dataset.label;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: function (value: any) {
            return value % 1 === 0 ? value : ''; // Affiche uniquement les valeurs entières
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;