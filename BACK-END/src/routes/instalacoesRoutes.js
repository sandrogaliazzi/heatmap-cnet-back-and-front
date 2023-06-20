import express  from "express";
import InstalacoesController from "../controllers/instalacoesController.js";
import UploadController from "../controllers/uploadController.js";
import multer from "multer";
const upload = multer({ dest: '/./CAMERAS/uploads/' });



const router = express.Router();

router
 .post("/instalacoes", InstalacoesController.SaveInstalacao) // salva no banco os dados da instalação.
 .get("/instalacoesget", InstalacoesController.FetchInstalacao)// requisita do banco os dados
 .post("/uploadimg", upload.single('image'), UploadController.uploadImg)
 .get("/getcameraimg/:id", UploadController.sendImg)
 .get("/getallcameras", UploadController.getCamerasimgs)
 
 export default router;