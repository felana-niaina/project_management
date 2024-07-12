import React, { useEffect, useState } from "react";
import { TSprint } from "../../types/Sprint";
import { getAllSprint } from "../../api/sprint-api";
import SprintStore from "../../store/SprintStore";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = {
  labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  datasets: [
    {
      label: "# of Votes",
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const DashboardScrum = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const idProject = projectId || "";
  const [sprintList, setSprintList] = useState<{ result: TSprint[] }>({
    result: [],
  });
  const fetchSprint = async () => {
    try {
      const sprintData = await getAllSprint(idProject);
      SprintStore.getState().setListSprint(sprintData);
      setSprintList(sprintData);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };
  useEffect(() => {
    if (idProject) {
      fetchSprint();
    }
  }, [idProject]);
  return (
    <div>
      {(sprintList as any).result.map((sprint: any) => (
        <div>
          <div>
            <h3>{sprint.name}</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4>Start date</h4>
                <span>{sprint.startDate}</span>
              </div>
              <div>
                <h4>End date</h4>
                <span>{sprint.endDate}</span>
              </div>
            </div>
            <div>
              <div>
                <span>0 %</span>
                <span>Tasks</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span>5</span>
                  <span>Completed</span>
                </div>
                <div>
                  <span>10</span>
                  <span>Assigned</span>
                </div>
              </div>
            </div>
            <div>
              <h2>Task statuses</h2>
              <div style={{ width: "300px" }}>
                <Doughnut data={data} />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div></div>
    </div>
  );
};

export default DashboardScrum;
