import React, { useEffect, useState } from "react";
import { TSprint } from "../../types/Sprint";
import { getAllSprint, getUpcomingTasks } from "../../api/sprint-api";
import { getProjectName } from "../../api/project-api";
import { getCardCountsForSprints } from "../../api/sprint-api";
import SprintStore from "../../store/SprintStore";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import LineChart from "./LineChart/BubbleChart";


const DashboardScrum = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const idProject = projectId || "";
  const [nameProject, setnameProject] = useState("");
  const [endDateProject, setEndDateProject] = useState("");
  const [sprintList, setSprintList] = useState<{ result: TSprint[] }>({
    result: [],
  });
  const [taskCounts, setTaskCounts] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);

  const fetchSprint = async () => {
    try {
      const sprintData = await getAllSprint(idProject);
      SprintStore.getState().setListSprint(sprintData);
      setSprintList(sprintData);
    } catch (error) {
      console.error("Error fetching sprints:", error);
    }
  };

  const getCardCountsForSprintsCol = async () => {
    const response = await getCardCountsForSprints(idProject);
    const { result } = response;
    setTaskCounts(result);
    console.log("getCardCountsForSprints:::", result);
  };

  const getUpcomingTasksFront = async () => {
    const response = await getUpcomingTasks(idProject);
    setUpcomingTasks(response.result);
    console.log("getUpcomingTasksFront:::", response);
  };
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
      getUpcomingTasksFront();
    }
  }, [idProject]);

  useEffect(() => {
    console.log("Updated taskCounts state:", taskCounts);
  }, [taskCounts]);

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
          margin: "20px",
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
        {(sprintList as any).result.map((sprint: any) => {
          const taskCount = taskCounts.find(
            (count: any) => count.sprintId === sprint._id
          );
          const totalTasks =
            taskCount && taskCount.aFaireCount + taskCount.termineCount;
          const completedPercentage =
            totalTasks > 0
              ? Math.round((taskCount.termineCount / totalTasks) * 100)
              : 0;

          return (
            <div
              key={sprint._id}
              style={{
                background: "#ecf2ff",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingRight: "40px",
                paddingLeft: "40px",
                marginLeft: "20px",
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                borderRadius: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  color: "#767383",
                  fontWeight: "bold",
                  fontSize: "2.5rem",
                }}
              >
                {completedPercentage} %
              </div>
              <div style={{ marginBottom: "5px" }}>
                <h3
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#212125",
                    fontWeight: "bold",
                    fontSize: "1.25rem",
                  }}
                >
                  {sprint.name}
                </h3>
              </div>

              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
                        {taskCount ? taskCount.aFaireCount : 0}
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
                      {taskCount ? taskCount.termineCount : 0}
                    </span>
                    <span style={{ color: "#a0a0ab" }}>Completed</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div></div>
      </div>
      <div>
        {" "}
        <LineChart data={upcomingTasks} />
      </div>
    </div>
  );
};

export default DashboardScrum;
