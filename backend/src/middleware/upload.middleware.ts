import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Assurer que le dossier d'upload existe
const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = file.fieldname + '-' + uniqueSuffix + ext;
    cb(null, name);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Vérifier le type MIME
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées !'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 1024 * 1024 * 5, // 5MB par image
    files: 5 // Maximum 5 fichiers
  }
});

// Middleware pour gérer les erreurs d'upload
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        error: 'Fichier trop volumineux. Taille maximum: 5MB' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        error: 'Trop de fichiers. Maximum: 5 images' 
      });
    }
  }
  
  if (error.message === 'Seules les images sont autorisées !') {
    return res.status(400).json({ error: error.message });
  }
  
  next(error);
};