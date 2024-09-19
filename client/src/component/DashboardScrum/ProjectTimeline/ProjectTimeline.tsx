import React, { useState } from 'react';

const ProjectTimeline = () => {
  const [currentSprintIndex, setCurrentSprintIndex] = useState(0);
  const sprintsData = [
    {
      name: "Sprint 1",
      startDate: "2024-08-01",
      endDate: "2024-08-10",
      completedTasks: 10,
      inProgressTasks: 5,
    },
    {
      name: "Sprint 2",
      startDate: "2024-08-11",
      endDate: "2024-08-20",
      completedTasks: 8,
      inProgressTasks: 7,
    },
    {
      name: "Sprint 3",
      startDate: "2024-08-21",
      endDate: "2024-08-30",
      completedTasks: 12,
      inProgressTasks: 3,
    },
  ];
  
  const sprintDates = sprintsData.map((sprint) => sprint.startDate);

  return (
    <div>
      <h2>Suivi du Projet</h2>
      
      {/* Timeline horizontale */}
    

      {/* Détails du sprint actuel */}
      <div className="sprint-details">
        <h3>{sprintsData[currentSprintIndex].name}</h3>
        <p>
          Date de début : {sprintsData[currentSprintIndex].startDate} <br />
          Date de fin : {sprintsData[currentSprintIndex].endDate}
        </p>
        <p>Tâches complétées : {sprintsData[currentSprintIndex].completedTasks}</p>
        <p>Tâches en cours : {sprintsData[currentSprintIndex].inProgressTasks}</p>
      </div>
    </div>
  );
};

export default ProjectTimeline;
