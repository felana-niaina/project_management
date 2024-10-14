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
        id: req.body.data.id,
        idProject: req.body.data.idProject,
        name: req.body.data.name,
        startDate: req.body.data.startDate,
        endDate: req.body.data.endDate,
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
      const data = req.body;
      console.log(data);
      const id = data._id;
      delete data._v;
      const update = await Sprint.updateOne({ _id: id }, { ...data });
      console.log("update", update);
      res.status(200).send("success");
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  deleteSprint = async (req: Request, res: Response) => {
    try {
      const { idProject } = req.params; // Retrieve idProject from URL parameters
      const { sprintId } = req.query; // Retrieve sprintId from query parameters

      // Add logic here if you want to use idProject for validation or additional checks
      if (!sprintId) {
        return res.status(400).send("Missing sprintId");
      }

      // Assuming sprintId is used for deletion
      await Sprint.deleteOne({ _id: sprintId });
      console.log("sprint delete", await Sprint.deleteOne({ _id: sprintId }));

      res.status(200).send("Sprint deleted successfully");
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
      const result = sprints.map((sprint: any) => {
        const aFaireColumn = sprint.column.find(
          (col: any) => col.name === "A faire"
        );
        const termineColumn = sprint.column.find(
          (col: any) => col.name === "Terminé"
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
      const now = moment().startOf("day");
      const endDate = moment().add(7, "days").endOf("day");

      // Trouver les sprints et peupler les colonnes et les cartes
      const sprints = await Sprint.find({ idProject }).populate({
        path: "column",
        populate: {
          path: "cards",
          model: "Card",
          populate: {
            path: "assignee",
            model: "User", // Assurez-vous que cela correspond au modèle que vous utilisez pour les utilisateurs
            select: "firstname", // Sélectionnez les champs que vous souhaitez récupérer
          },
        },
      });

      // Préparer les résultats
      const result = sprints.map((sprint: any) => {
        const aFaireColumn = sprint.column.find(
          (col: any) => col.name === "A faire"
        );

        if (!aFaireColumn)
          return { sprintId: sprint._id, sprintName: sprint.name, tasks: [] };

        // Filtrer les cartes dont la date de fin est dans les 7 jours à venir
        const upcomingTasks = aFaireColumn.cards.filter((card: TCard) => {
          const cardEndDate = moment(card.dueDate);

          console.log(
            `Task: ${
              card.title || "No Title"
            }, Due Date: ${cardEndDate.format()}`
          ); // Vérifiez ici

          return cardEndDate.isBetween(now, endDate);
        });

        return {
          sprintId: sprint._id,
          sprintName: sprint.name,
          tasks: upcomingTasks.map((task: TCard | any) => ({
            taskId: task._id,
            taskName: task.title || "No Title", // Si title est undefined, affichez "No Title"
            endDate: task.dueDate,
            assignee: task.assignee ? task.assignee.firstname : "Unassigned",
          })),
        };
      });

      console.log("Resulting tasks:", result);

      res.status(200).send({ result });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  getTotalTaskCountsForProject = async (req: Request, res: Response) => {
    try {
      const { idProject } = req.params;

      // Find sprints and populate columns
      const sprints = await Sprint.find({ idProject: idProject }).populate(
        "column"
      );

      // Initialize total counters for all sprints
      let totalInProgressCount = 0;
      let totalTermineCount = 0;
      let totalOverdueCount = 0;

      // Get the current date to compare overdue tasks
      const currentDate = moment();

      // Iterate over each sprint and sum up the task counts
      sprints.forEach((sprint: any) => {
        const inProgressColumn = sprint.column.find(
          (col: any) => col.name === "En cours"
        );
        const enRetardColumn = sprint.column.find(
          (col: any) => col.name === "En retard"
        );
        console.log("enRetardColumn", enRetardColumn);

        const termineColumn = sprint.column.find(
          (col: any) => col.name === "Terminé"
        );

        const inProgressCount = inProgressColumn
          ? inProgressColumn.cards.length
          : 0;
        const termineCount = termineColumn ? termineColumn.cards.length : 0;
        const overdueCount = enRetardColumn ? enRetardColumn.cards.length : 0;

        // Sum up task counts across all sprints
        totalInProgressCount += inProgressCount;
        totalTermineCount += termineCount;
        totalOverdueCount += overdueCount;
      });

      // Return the total counts
      res.status(200).send({
        totalTermineCount,
        totalInProgressCount,
        totalOverdueCount,
      });
    } catch (e: any) {
      res.status(500).send("Internal server error");
    }
  };

  // getTaskCountsForChart = async (req: Request, res: Response) => {
  //   try {
  //     const { idProject } = req.params;

  //     // Trouver les sprints liés au projet et peupler leurs colonnes et les tâches (cartes) avec l'assignee
  //     const sprints = await Sprint.find({ idProject: idProject }).populate({
  //       path: "column", // Peupler les colonnes
  //       populate: {
  //         path: "cards", // Peupler les cartes des colonnes
  //         populate: {
  //           path: "assignee", // Peupler l'assignee des cartes
  //           model: "User", // Spécifiez le modèle User
  //           select: "email", // Sélectionner uniquement l'email de l'assignee
  //         },
  //       },
  //     });
  //     console.log('sprints',sprints)
  //     const chartData = sprints.map((sprint: any) => {
  //       // Trouver la colonne "En retard"
  //       const overdueColumn = sprint.column.find((col: any) => col.name === "En retard");
  //       console.log('overdueColumnChart',overdueColumn)
  //       // Nombre de tâches en retard
  //       const tachesEnRetard = overdueColumn ? overdueColumn.cards.length : 0;

  //       // Obtenir les détails des tâches en retard
  //       const tachesDetails = overdueColumn
  //         ? overdueColumn.cards.map((card: any) => ({
  //             taskName: card.title, // Nom de la tâche
  //             deadline: moment(card.dueDate).format("YYYY-MM-DD"), // Date limite formatée
  //             assignee: card.assignee ? card.assignee.email : "Non assigné", // Nom de l'assignee
  //           }))
  //         : [];

  //       return {
  //         sprintName: sprint.name,  // Nom du sprint
  //         tachesEnRetard,           // Nombre de tâches en retard
  //         tachesDetails,            // Détails des tâches en retard
  //       };
  //     });

  //     // Retourner les données pour le graphique
  //     res.status(200).send({ chartData });
  //   } catch (e: any) {
  //     res.status(500).send("Internal server error");
  //   }
  // };

  getTaskCountsForChart = async (req: Request, res: Response) => {
    // try {
    //   const { idProject } = req.params;

    //   // Find sprints related to the project and populate their columns
    //   const sprints = await Sprint.find({ idProject: idProject }).populate({
    //     path: "column", // Peupler les colonnes
    //     populate: {
    //       path: "cards", // Peupler les cartes des colonnes
    //       populate: {
    //         path: "assignee", // Peupler l'assignee des cartes
    //         model: "User", // Spécifiez le modèle User
    //         select: "email", // Sélectionner uniquement l'email de l'assignee
    //       },
    //     },
    //   });
    //   // Prepare the chart data array
    //   const chartData = sprints.map((sprint: any) => {
    //     const aFaireColumn = sprint.column.find(
    //       (col: any) => col.name === "A faire"
    //     );
    //     const overdueColumn = sprint.column.find(
    //       (col: any) => col.name === "En retard"
    //     );

    //     // Count tasks in each status
    //     const tachesRestantes = aFaireColumn ? aFaireColumn.cards.length : 0;
    //     const tachesEnRetard = overdueColumn ? overdueColumn.cards.length : 0;

    //     // Calculate sprint duration using startDate and endDate
    //     const sprintStartDate = moment(sprint.startDate).format("YYYY-MM-DD");
    //     const sprintEndDate = moment(sprint.endDate).format("YYYY-MM-DD");
    //     const heuresTravaillees = moment(sprint.endDate).diff(
    //       moment(sprint.startDate),
    //       "hours"
    //     );

    //     return {
    //       sprintName: sprint.name,
    //       heuresTravaillees, // Sprint duration in days
    //       tachesRestantes,
    //       tachesEnRetard,
    //     };
    //   });

    //   // Return the data for the bar chart
    //   res.status(200).send({ chartData });
    // } catch (e: any) {
    //   res.status(500).send("Internal server error");
    // }
    try {
      const { idProject } = req.params;
  
      const sprints = await Sprint.find({ idProject })
        .populate({
          path: 'column',
          match: { name: { $in: ['En cours', 'En retard'] } }, // Filtrer uniquement les colonnes 'En cours' et 'En retard'
          populate: {
            path: 'cards',
            populate: {
              path: 'assignee', // Récupérer les informations de l'assigné
              select: 'name email', // Sélectionner les champs pertinents
            },
          },
        })
        .exec();
  
        const formattedData = sprints.map((sprint: any) => {
          const tasks = sprint.column.flatMap((col: any) =>
            col.cards.map((card: any) => {
              const startDate = card.startDate ? new Date(card.startDate) : null;
              const dueDate :any = card.dueDate ? new Date(card.dueDate) : null;
        
              let durationEstimate = 0;
              if (startDate && dueDate) {
                durationEstimate = Math.abs((dueDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)); // Durée estimée en jours
              }
        
              const today = new Date();
              let durationActual = 0;
              let durationLate = 0; // Durée de retard
              if (startDate) {
                const endDate = card.actualEndDate ? new Date(card.actualEndDate) : today;
                // durationActual = Math.abs((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)); // Durée réelle en jours
                durationActual = Math.abs((dueDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)); // Durée réelle en jours
                
                // Calculer la durée de retard si `actualEndDate` est après `dueDate`
                if (endDate > dueDate) {
                  durationLate = Math.abs((endDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
                }
              }
              console.log(card.assignee.email)
              return {
                title: card.title,
                progress: card.progress,
                assignee: card.assignee ? card.assignee.email : "Unassigned",
                startDate: card.startDate,
                dueDate: card.dueDate,
                actualEndDate: card.actualEndDate,
                columnName: col.name,
                sprintName: sprint.name,
                durationEstimate,
                durationActual,
                durationLate, // Ajout de la durée de retard
              };
            })
          );
        
          return {
            sprintName: sprint.name,
            tasks,
          };
        });
        
  
      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  updateSprintStatus = async (req: Request, res: Response) => {
    try {
      const { sprintId, action } = req.body; // sprintId est l'ID du sprint, action = "next" ou "previous"

      // Récupérer le sprint en question
      const sprint = await Sprint.findById(sprintId);

      if (!sprint) {
        return res.status(404).json({ message: "Sprint not found" });
      }

      // Logique de mise à jour selon l'action
      if (action === "completed") {
        sprint.status = "completed"; // Le sprint actuel devient "completed"
      } else if (action === "in-progress") {
        sprint.status = "in-progress"; // Le sprint suivant devient "in-progress"
      }

      await sprint.save();

      return res.status(200).json({ message: "Sprint status updated", sprint });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating sprint status", error });
    }
  };
}
