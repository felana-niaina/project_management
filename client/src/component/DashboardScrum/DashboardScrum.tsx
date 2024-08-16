import React, { useEffect, useState } from "react";
import { TSprint } from "../../types/Sprint";
import { getAllSprint } from "../../api/sprint-api";
import { getProjectName } from "../../api/project-api";
import { getCardCountsForSprints } from "../../api/sprint-api";
import SprintStore from "../../store/SprintStore";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import ProjectStore from "../../store/StoreProject";

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
  const [nameProject, setnameProject] = useState("");
  const [endDateProject, setEndDateProject] = useState("");
  const [sprintList, setSprintList] = useState<{ result: TSprint[] }>({
    result: [],
  });
  const [taskCounts, setTaskCounts] = useState<any[]>([]);

  
  const fetchSprint = async () => {
    try {
      const sprintData = await getAllSprint(idProject);
      SprintStore.getState().setListSprint(sprintData);
      setSprintList(sprintData);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  const getCardCountsForSprintsCol  = async ()=>{
    const result= await getCardCountsForSprints(idProject);
    setTaskCounts(result);
    console.log("getCardCountsForSprints:::",result)
  }
  const getNameProject = async () => {
    const result = await getProjectName(idProject);
    setnameProject(result.name);
    setEndDateProject(result.endDate);
    console.log("nameProject by id", result);
  };
  useEffect(() => {
    if (idProject) {
      fetchSprint();
      getNameProject();
      getCardCountsForSprintsCol();
    }
  }, [idProject]);

  // Calculer les jours restants
  const calculateDaysLeft = (endDate: string) => {
    const today = new Date();
    const projectEndDate = new Date(endDate);
    const timeDiff = projectEndDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0; // Retourne 0 si la date est passée
  };

  const daysLeft = calculateDaysLeft(endDateProject);
  return (
    <div>
      <div
        style={{
          margin: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            background: "",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontFamily: "Lora, Roboto", fontSize: "2.5rem" }}>
              {nameProject}
            </h3>
            <span
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
              }}
            >
              Project name
            </span>
          </div>
          <div
            style={{
              background: "#ee780d",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h5
              style={{
                fontSize: "2rem",
                textAlign: "center",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              J-{daysLeft}
            </h5>
            <span style={{ color: "#fff", fontSize: "0.75rem" }}>
              {endDateProject}
            </span>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {(sprintList as any).result.map((sprint: any) => (
          
          <div
            style={{ background: "#ecf2ff", padding: "20px", margin: "10px" }}
          >
            <div style={{ marginBottom: "5px" }}>
              <h3
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "#212125",
                  fontWeight: "bold",
                }}
              >
                {sprint.name}
              </h3>
            </div>
            <div>
              {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h4>Start date</h4>
                <span>{sprint.startDate}</span>
              </div>
              <div>
                <h4>End date</h4>
                <span>{sprint.endDate}</span>
              </div>
            </div> */}
              {/* <div> */}
              {/* <div>
                <span>0</span>
                <span>Tasks</span>
              </div> */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div
                  style={{
                    borderRight: "3px solid #2e74ff",
                    marginRight: "5px",
                  }}
                >
                  <div
                    style={{
                      marginRight: "15px",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        color: "#212125",
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                      }}
                    >
                      5
                    </span>
                    <span style={{ color: "#a0a0ab" }}>Tasks</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      color: "#212125",
                      fontWeight: "bold",
                      fontSize: "1.25rem",
                    }}
                  >
                    10
                  </span>
                  <span style={{ color: "#a0a0ab" }}>Completed</span>
                </div>
              </div>
              {/* </div> */}
              {/* <div>
              <h2>Task statuses</h2>
              <div style={{ width: "300px" }}>
                <Doughnut data={data} />
              </div>
            </div> */}
            </div>
          </div>
        ))}

        <div></div>
      </div>
    </div>
  );
};

export default DashboardScrum;
