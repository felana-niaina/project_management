import React, { useEffect, useState } from "react";
import { TSprint } from "../../types/Sprint";
import {
  getAllSprint,
  getTotalTaskCountsForProject,
  getUpcomingTasks,
} from "../../api/sprint-api";
import { getProjectName } from "../../api/project-api";
import {
  getCardCountsForSprints,
  getTaskCountsForChart,
} from "../../api/sprint-api";
import SprintStore from "../../store/SprintStore";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import LineChart from "./LineChart/BubbleChart";
import DoughnutChart from "./DoughnutChart";
import BarChart from "./BarChart";
import "@reactuiutils/horizontal-timeline/timeline.css";
import {
  Action,
  Event,
  Subtitle,
  Timeline,
  Title,
} from "@reactuiutils/horizontal-timeline";
import { FaRegCalendarCheck, FaBug, FaProjectDiagram } from "react-icons/fa";

const DashboardScrum = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const idProject = projectId || "";
  const [nameProject, setnameProject] = useState("");
  const [endDateProject, setEndDateProject] = useState("");
  const [startDateProject, setstartDateProject] = useState("");
  const [sprintList, setSprintList] = useState<{ result: TSprint[] }>({
    result: [],
  });
  const [taskCounts, setTaskCounts] = useState<any[]>([]);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [staticBarChartData, setStaticBarChartData] = useState<any[]>([]);

  const [totalTaskCountsForProject, setTotalTaskCountsForProject] = useState({
    totalInProgressCount: 0,
    totalOverdueCount: 0,
    totalTermineCount: 0,
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

  const getTotalTaskCountsForProjectFront = async () => {
    const response = await getTotalTaskCountsForProject(idProject);
    setTotalTaskCountsForProject(response);
    console.log("TotalTaskCountsForProject::", totalTaskCountsForProject);
  };

  const getTaskCountsForChartFront = async () => {
    const response = await getTaskCountsForChart(idProject);
    setStaticBarChartData(response.chartData);
    console.log("getTaskCountsForChartFront::", response.chartData);
    console.log("staticBarChartData::", staticBarChartData);
  };

  const getNameProject = async () => {
    const result = await getProjectName(idProject);
    setnameProject(result.name);
    setEndDateProject(result.endDate);
    setstartDateProject(result.startDate);
    console.log("nameProject by id", result);
  };
  useEffect(() => {
    if (idProject) {
      fetchSprint();
      getNameProject();
      getCardCountsForSprintsCol();
      getUpcomingTasksFront();
      getTotalTaskCountsForProjectFront();
      getTaskCountsForChartFront();
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
    <div style={{ backgroundColor: "#f3f3f4" }}>
      <div style={{display:"flex", justifyContent:"space-between"}}>
        <div
          style={{
            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            borderRadius: "5px",
            background: "#f3f3f4",
            paddingTop: "10px",
            paddingBottom: "10px",
            paddingRight: "30px",
            paddingLeft: "30px",
          }}
        >
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Project name
          </span>
          <h3 style={{ fontFamily: "Lora, Roboto", fontSize: "2rem" }}>
            {nameProject}
          </h3>
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

      <div>
        <Timeline style={{width:"100%",display:"flex", justifyContent:"center"}}>
          {/* Début du projet */}
          <Event color="#4CAF50" icon={FaProjectDiagram}>
            <Title>Début du projet</Title>
            <Subtitle>Date de début : {startDateProject}</Subtitle>
          </Event>

          {/* Sprints */}
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
              <div>
                <Event
                  color="#87a2c7"
                  icon={FaRegCalendarCheck}
                  key={sprint._id}
                >
                  <Title>{sprint.name}</Title>
                  <Subtitle>{`Début : ${sprint.startDate}, Fin : ${sprint.endDate}`}</Subtitle>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: "20px",
                      padding: "10px 0",
                      textAlign: "center",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                      marginTop: "15px",
                    }}
                  >
                    <div
                      style={{
                        borderRight: "2px solid #ddd",
                        paddingRight: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          color: "#212125",
                        }}
                      >
                        {taskCount ? taskCount.aFaireCount : 0}
                      </span>
                      <p style={{ color: "#a0a0ab", margin: "5px 0 0" }}>
                        Tâches à faire
                      </p>
                    </div>

                    <div
                      style={{
                        borderRight: "2px solid #ddd",
                        paddingRight: "10px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "bold",
                          fontSize: "1.2rem",
                          color: "#212125",
                        }}
                      >
                        {taskCount ? taskCount.termineCount : 0}
                      </span>
                      <p style={{ color: "#a0a0ab", margin: "5px 0 0" }}>
                        Tâches complétées
                      </p>
                    </div>
                  </div>
                  <Action onClick={() => alert(`Sprint: ${sprint.name}`)}>
                    Voir détails
                  </Action>
                </Event>
              </div>
            );
          })}

          {/* Fin du projet */}
          <Event color="#F44336" icon={FaProjectDiagram}>
            <Title>Fin du projet</Title>
            <Subtitle>Date fin : {endDateProject}</Subtitle>
          </Event>
        </Timeline>
      </div>
      {/* <div className="pt-3" style={{ display: "flex", flexDirection: "row" }}>
        <div className="mr-5">
          <div
            style={{
              margin: "20px",
              marginTop: "0px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                borderRadius: "5px",
                background: "#f3f3f4",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingRight: "30px",
                paddingLeft: "30px",
              }}
            >
              <span
                style={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                Project name
              </span>
              <h3 style={{ fontFamily: "Lora, Roboto", fontSize: "2rem" }}>
                {nameProject}
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                background: "#f3f3f4",
                boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                borderRadius: "5px",
                paddingTop: "10px",
                paddingBottom: "10px",
                paddingRight: "30px",
                paddingLeft: "30px",
              }}
            >
              <div
                style={{
                  borderRight: "3px solid #2e74ff",
                  paddingRight: "10px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  Project startDate
                </span>
                <h3 style={{ fontFamily: "Lora, Roboto", fontSize: "1.75rem" }}>
                  {startDateProject}
                </h3>
              </div>
              <div style={{ paddingLeft: "10px" }}>
                <span
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  Project endDate
                </span>
                <h3 style={{ fontFamily: "Lora, Roboto", fontSize: "1.75rem" }}>
                  {endDateProject}
                </h3>
              </div>
            </div>

            
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
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
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    paddingRight: "40px",
                    paddingLeft: "40px",
                    marginLeft: "20px",
                    boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
                    borderRadius: "5px",
                    background: "#f3f3f4",
                  }}
                >
                
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
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
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
        </div>
        <div className="ml-5">
          <div
            style={{
              margin: "auto",
              background: "#f3f3f4",
              boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
              borderRadius: "5px",
            }}
          >
            <DoughnutChart
              taskCounts={
                totalTaskCountsForProject
                  ? totalTaskCountsForProject
                  : {
                      totalInProgressCount: 10,
                      totalTermineCount: 20,
                      totalOverdueCount: 70,
                    }
              }
            />
          </div>
        </div>
      </div> */}
      <div
        className="ml-3"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div
          style={{
            width: "600px",
            marginTop: "-130px",
            background: "#f3f3f4",
            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
            borderRadius: "5px",
            padding: "10px",
          }}
        >
          <BarChart data={staticBarChartData} />
        </div>
        <div style={{ width: "600px" }}>
          {" "}
          <LineChart data={upcomingTasks} />
        </div>
      </div>
    </div>
  );
};

export default DashboardScrum;
