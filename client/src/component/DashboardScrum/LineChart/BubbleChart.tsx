import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, BubbleController, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend, PointElement } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(BubbleController, CategoryScale, LinearScale, TimeScale, Title, Tooltip, Legend, PointElement);

interface UpcomingTask {
  taskId: string;
  taskName: string;
  endDate: string;
  sprintName: string;
  assignee : string
}

interface SprintUpcomingTasks {
  sprintId: string;
  sprintName: string;
  tasks: UpcomingTask[];
}

interface BubbleChartProps {
  data: SprintUpcomingTasks[];
}

const transformUpcomingTasksData = (data: SprintUpcomingTasks[]) => {
  const bubbleData = data.flatMap(sprint =>
    sprint.tasks
      .filter(task => {
        const dueDate = new Date(task.endDate);
        const today = new Date();
        const sevenDaysLater = new Date();
        sevenDaysLater.setDate(today.getDate() + 7);
        return dueDate >= today && dueDate <= sevenDaysLater;
      })
      .map(task => ({
        x: sprint.sprintName,
        y: new Date(task.endDate),
        r: 10, // Taille des bulles
        taskName: task.taskName,
        dueDate: task.endDate,
        assignee: task.assignee, // Ajouter l'assigné
      }))
  );

  return {
    datasets: [
      {
        label: 'Tasks Due in Next 7 Days',
        data: bubbleData,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: '#2e74ff',
      },
    ],
  };
};

const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const chartData = transformUpcomingTasksData(data);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category' as const,
        title: {
          display: true,
          text: 'Sprints',
          color: '#ee780d',
        },
        ticks: {
          color: '#666666', // Couleur des valeurs sur l'axe X
        },
      },
      y: {
        type: 'time' as const,
        time: {
          unit: 'day',
          tooltipFormat: 'PP',
        },
        title: {
          display: true,
          text: 'Due Dates',
          color: '#ee780d',
        },
        ticks: {
          color: '#666666', // Couleur des valeurs sur l'axe X
          fontWeight : "bold"
        },
        min: new Date().toISOString(), // Commence aujourd'hui
        max: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(), // Fin dans 7 jours
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems: any) => {
            const item = tooltipItems[0].raw;
            return `${item.taskName}\nDue Date: ${item.dueDate}\nAssigned to: ${item.assignee}`;
          },
          label: (tooltipItem: any) => {
            const item = tooltipItem.raw;
            return `Assigned to: ${item.assignee}`;
          },
        },
      },
    },
  };

  return (
    <div>
      <h3 style={{display:"flex", justifyContent:"center",marginBottom:"20px",marginTop:"30px"}}>Tâches dont la date limite est dans les 7 prochains jours par sprint</h3>
      <Bubble data={chartData} options={options as any} style={{marginLeft:"20px"}}/>
    </div>
  );
};

export default BubbleChart;
