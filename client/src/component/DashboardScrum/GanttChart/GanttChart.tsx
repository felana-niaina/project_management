import React, { useState } from "react";
import { Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Button } from "@mui/material";

// Définition des interfaces
interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  sprintId: string;
}

interface Sprint {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
}

// Typage des props
interface GanttChartBySprintProps {
  tasks: Task[];
  sprints: Sprint[];
}

const GanttChart: React.FC<GanttChartBySprintProps> = ({ tasks, sprints }) => {
  // État pour gérer le filtre
  const [filter, setFilter] = useState<"all" | "late" | "onTime">("all");

  // Fonction pour vérifier si une tâche est en retard
  const getTasksWithStatus = (tasks: Task[]) => {
    const today = new Date();
    return tasks.map((task) => {
      const isLate = task.end.getTime() < today.getTime(); // Vérification simple du retard
      const daysLate = isLate
        ? Math.floor(
            (today.getTime() - task.end.getTime()) / (1000 * 3600 * 24)
          )
        : 0;
      return {
        ...task,
        isLate,
        daysLate,
      };
    });
  };

  // Filtrage des tâches selon l'état du filtre
  const filterTasks = (tasks: Task[]) => {
    const tasksWithStatus = getTasksWithStatus(tasks);

    // Log tasks that do not have valid start/end dates
    const invalidTasks = tasksWithStatus.filter(
      (task) => !task.start || !task.end
    );
    console.log("Invalid tasks (missing dates):", invalidTasks);

    if (filter === "late") {
      return tasksWithStatus.filter((task) => task.isLate);
    } else if (filter === "onTime") {
      return tasksWithStatus.filter((task) => !task.isLate);
    }

    return tasksWithStatus;
  };

  return (
    <div>
      <h1 className= "flex justify-center mb-3">Diagramme de Gantt par Sprint</h1>

      {/* Boutons de filtre */}
      <div>
        <Button onClick={() => setFilter("all")}>Toutes les Tâches</Button>
        <Button onClick={() => setFilter("late")}>Tâches en Retard</Button>
        <Button onClick={() => setFilter("onTime")}>Tâches à Jour</Button>
      </div>

      {sprints.map((sprint) => {
        const sprintTasks = tasks.filter((task) => task.sprintId === sprint.id);
        const filteredTasks = filterTasks(sprintTasks); // Apply the filter

        // Debugging: Display valid tasks in the console
        console.log(`Filtered tasks for Sprint ${sprint.id}:`, filteredTasks);

        return (
          <div key={sprint.id}>
            <h2>{sprint.name}</h2>
            {filteredTasks.length > 0 ? (
              <Gantt
                tasks={
                  filteredTasks
                    .map((task) => {
                      if (task.start && task.end) {
                        return {
                          id: task.id,
                          name: `${task.name}${
                            task.isLate
                              ? ` (Retard: ${task.daysLate} jours)`
                              : ""
                          }`,
                          start: task.start,
                          end: task.end,
                          color: task.isLate ? "#FF0000" : "#008000",
                        };
                      }
                      return undefined; // Return undefined for tasks without valid dates
                    })
                    .filter((task) => task !== undefined) as any
                } // Filter undefined tasks
                viewMode={ViewMode.Week}
              />
            ) : (
              <p>Aucune tâche à afficher pour ce sprint.</p> // Message when there are no tasks
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GanttChart;
