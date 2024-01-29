import { Response, Request } from "express";
import path from "path";

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const createMulterStorage = (fileDirectory: string) => {
  return multer.diskStorage({
    destination: `./uploads/${fileDirectory}`,
    filename: function (req: Request, file: any, cb: any) {
      const name = file.originalname.trim();
      const splitName = name.split(".");
      cb(
        null,
        splitName[0] +
          "-" +
          new Date().getTime() +
          path.extname(file.originalname)
      );
    },
  });
};
interface MulterRequest extends Request {
  file: any;
}

export default class UploadFileController {
  uploadFile = (req: Request, res: Response) => {
    try {
      const storage = createMulterStorage(req.params.path);
      const uploadStorage = multer({ storage: storage });

      uploadStorage.single("file")(req, res, () => {
        return res.status(200).send((req as MulterRequest).file);
      });
    } catch (e: any) {
      console.log("error:::::", e);
    }
  };
}
