import { Request, Response } from "express";
import { Sprint } from "../entity/Sprint";
import { Column } from "../entity/Column";
import { defaultColumn } from "../constant/utils";
import moment from "moment";
import { TCard } from "../types/card";


export default class sprintController {
  createSprint = async (req: Request, res: Response) => {
    try {
      const { data } = req.body;
      const { idProject } = req.params;
      delete data._v;
      delete data._id;
      const createdColumn = await Column.insertMany(defaultColumn);
      await Sprint.create({
        id:req.body.data.id,
        idProject: req.body.data.idProject,
        name: req.body.data.name,
        startDate : req.body.data.startDate,
        endDate : req.body.data.endDate,
        column: createdColumn,
      });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
   getAllSprint = async (req: Request, res: Response) => {
    try {
      const { idProject } = req.params; 

      const result = await Sprint.find({ idProject: idProject });
     
      res.status(200).send({
        result,
      });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

   updateSprint = async (req: Request, res: Response) => {
    try {
      const data = req.body.data;
      console.log(data);
      const id = data._id;
      delete data._v;
      delete data._id;
      const update = await Sprint.updateOne({ _id: id }, { ...data });
      console.log("update", update);
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  static deleteSprint = async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await Sprint.deleteOne({ _id: id });
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  getCardCountsForSprints = async (req: Request, res: Response) => {
    try {
      const { idProject } = req.params;

      // Find sprints and populate columns
      const sprints = await Sprint.find({ idProject: idProject }).populate(
        "column"
      );

      // Map over each sprint to count cards in specific columns
      const result = sprints.map((sprint :any) => {
        const aFaireColumn = sprint.column.find(
          (col:any) => col.name === "A faire"
        );
        const termineColumn = sprint.column.find(
          (col :any) => col.name === "Terminé"
        );

        const aFaireCount = aFaireColumn ? aFaireColumn.cards.length : 0;
        const termineCount = termineColumn ? termineColumn.cards.length : 0;

        return {
          sprintId: sprint._id,
          sprintName: sprint.name,
          aFaireCount,
          termineCount,
        };
      });

      res.status(200).send({ result });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  getUpcomingTasks = async (req: Request, res: Response) => {
    try {
      const { idProject } = req.params;
  
      // Définir la période à vérifier (7 jours à venir)
      const now = moment().startOf('day');
      const endDate = moment().add(7, 'days').endOf('day');
  
      // Trouver les sprints et peupler les colonnes et les cartes
      const sprints = await Sprint.find({ idProject })
        .populate({
          path: "column",
          populate: {
            path: "cards",
            model: "Card",
            populate: {
              path: "assignee",
              model: "User", // Assurez-vous que cela correspond au modèle que vous utilisez pour les utilisateurs
              select: "firstname", // Sélectionnez les champs que vous souhaitez récupérer
            },
          }
        });
  
      // Préparer les résultats
      const result = sprints.map((sprint: any) => {
        const aFaireColumn = sprint.column.find((col: any) => col.name === "A faire");
  
        if (!aFaireColumn) return { sprintId: sprint._id, sprintName: sprint.name, tasks: [] };
  
        // Filtrer les cartes dont la date de fin est dans les 7 jours à venir
        const upcomingTasks = aFaireColumn.cards.filter((card: TCard) => {
          const cardEndDate = moment(card.dueDate);
  
          console.log(`Task: ${card.title || 'No Title'}, Due Date: ${cardEndDate.format()}`);  // Vérifiez ici
  
          return cardEndDate.isBetween(now, endDate);
        });
  
        return {
          sprintId: sprint._id,
          sprintName: sprint.name,
          tasks: upcomingTasks.map((task: TCard | any) => ({
            taskId: task._id,
            taskName: task.title || 'No Title',  // Si title est undefined, affichez "No Title"
            endDate: task.dueDate,
            assignee: task.assignee ? task.assignee.firstname : 'Unassigned', 
          })),
        };
      });
  
      console.log("Resulting tasks:", result);
  
      res.status(200).send({ result });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };
}
