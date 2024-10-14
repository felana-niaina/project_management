import React, { useState } from "react";
import Chart, {
  ArgumentAxis,
  ValueAxis,
  Series,
  Legend,
  Label,
  Export,
  Title,
  Tooltip,
  CommonSeriesSettings
} from "devextreme-react/chart";

import dayjs from "dayjs";
import moment from "moment"; // Pour manipuler les dates

interface Task {
  title: string;
  progress: number;
  assignee: string; // Nom de l'utilisateur assigné
  deadline: string;
  startDate: string;
  columnName: string; // 'En cours' ou 'En retard'
  sprintName: string;
  actualEndDate?: string;
  durationEstimate: number; // Durée estimée
  durationActual: number; // Durée réelle
  durationLate: number
}

interface Sprint {
  sprintName: string;
  tasks: Task[];
}

interface SprintsChartProps {
  sprintsData: Sprint[];
}

const GanttChart: React.FC<SprintsChartProps> = ({ sprintsData }) => {
    // Obtenez la date actuelle
    if (sprintsData.length === 0) {
      return <p>Chargement des données...</p>;
    }

  return (
    <div>
     {sprintsData.map((sprint, sprintIndex) => (
      
        <div key={sprintIndex} >
          <h2>{sprint.sprintName}</h2>
          <Chart dataSource={sprint.tasks} rotated={true} title={`Suivi des tâches - ${sprint.sprintName}`}>
            {/* Paramètres communs pour les séries */}
            <CommonSeriesSettings argumentField="title" type="stackedbar" barWidth={20} />
            
            {/* Série pour la prévision (durée estimée) */}
            <Series
              name="Prévision (Estimée)"
              valueField="durationEstimate"
              color="#4caf50" // Vert pour la durée estimée
            />

            {/* Partie non retardée de la réalité */}
            <Series
              name="Réalité (Non retardée)"
              valueField="durationActual"
              color="#2196f3" // Bleu pour la partie non retardée
              stack="reality" // Stack pour empiler avec la partie retardée
            >
            <Label visible={true} customizeText={(info :any) => `${info.point.data.assignee}`} />
            </Series>
            {/* Partie retardée de la réalité */}
            <Series
              name="Réalité (Retard)"
              valueField="durationLate"
              color="#f44336" // Rouge pour la durée de retard
              stack="reality" // Empilé avec la partie non retardée
            />

            <Legend verticalAlignment="bottom" horizontalAlignment="center" />
            <Tooltip enabled={true} />
          </Chart>
        </div>
      ))}
    </div>
  );
};

export default GanttChart;
