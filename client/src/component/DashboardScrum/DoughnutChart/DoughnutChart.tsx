import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface TaskStatusCounts {
  totalInProgressCount: number;
  totalTermineCount: number;
  totalOverdueCount: number;
}

interface DoughnutChartProps {
  taskCounts: TaskStatusCounts;
}

const prepareDoughnutData = (taskCounts: TaskStatusCounts) => {
  return {
    labels: ["Completed", "In Progress", "Overdue"],
    datasets: [
      {
        data: [
          taskCounts.totalTermineCount ?? 0, // Valeur par défaut en cas de `undefined`
          taskCounts.totalInProgressCount ?? 0,
          taskCounts.totalOverdueCount ?? 0,
        ],
        backgroundColor: ["#36a2eb", "#ffce56", "#ff6384"],
        hoverBackgroundColor: ["#36a2eb", "#ffce56", "#ff6384"],
      },
    ],
  };
};

const DoughnutChart: React.FC<DoughnutChartProps> = ({ taskCounts }) => {
  const doughnutData = prepareDoughnutData(taskCounts);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataset = tooltipItem.dataset.data;
            const totalTasks = dataset.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const currentValue = dataset[tooltipItem.dataIndex];
            const percentage = ((currentValue / totalTasks) * 100).toFixed(2);
            return `${tooltipItem.label}: ${currentValue} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "320px", margin: "auto" }}>
      <h3 style={{ textAlign: "center" }}>
        Présentation global des tâches par statut d'achèvement
      </h3>
      <Doughnut data={doughnutData} options={options} />
    </div>
  );
};

export default DoughnutChart;
