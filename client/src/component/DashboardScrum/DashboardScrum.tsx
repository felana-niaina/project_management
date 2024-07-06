import React, { useState } from "react";
import { TSprint } from "../../types/Sprint";
import { getAllSprint } from "../../api/sprint-api";
import SprintStore from "../../store/SprintStore";
import { useParams } from "react-router-dom";

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
  return (
    <div>
      {(sprintList as any).result.map((sprint: any) => (
        <div>
          <div>
            <h3>{sprint.name}</h3>
          </div>
          <div>
            <h4>Start date</h4>
            <span>{sprint.startDate}</span>
          </div>
          <div><h4>End date</h4>
            <span>{sprint.endDate}</span></div>
        </div>
      ))}

      <div></div>
    </div>
  );
};

export default DashboardScrum;
