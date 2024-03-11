import aws from 'aws-sdk';
import multer from 'multer';
import config from '../utils/config';
import path from 'path';
import fs from 'fs';

// Remove AWS SDK v2 deprecation message
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

// Initialize AWS S3 SDK with your AWS credentials
const s3bucket = new aws.S3({
  accessKeyId: config.AWS.ACCESS_KEY,
  secretAccessKey: config.AWS.SECRET_KEY,
  region: config.AWS.REGION,
});

const isValidExtension = async (mimetype: string, allowedExtension: string[]): Promise<boolean> => {
  if (allowedExtension.includes(mimetype)) {
    return true;
  } else {
    return false;
  }
};

const isValidFileSize = async (fileSize: number, maxSize: number): Promise<boolean> => {
  if (fileSize <= maxSize) {
    return true;
  } else {
    return false;
  }
};

function insertSpacesBetweenWords(fieldName: any) {
  // Use regular expression to insert spaces between capital letters that divide two words
  const field = fieldName.replace(/([a-z])([A-Z])/g, '$1 $2');
  return field.toLowerCase();
}

const validateFile = async (
  responseObj: any,
  file: any,
  fieldName: string,
  allowedExtension: string[],
  maxSizeInMb?: number
) => {
  let error = '';
  let isValidFile = true;
  responseObj.statusCode = 400;

  const field = insertSpacesBetweenWords(fieldName);

  if (!file) {
    isValidFile = false;
    error = `The ${field} field is required.`;
  } else if (file.fieldname != fieldName) {
    isValidFile = false;
    error = `The ${field} field is required.`;
  } else {
    // Validate extension
    if (allowedExtension.length > 0) {
      let extension = path.extname(file.originalname).toLowerCase();
      if (extension.length === 1) {
        const fileNameParts = file.mimetype.split('/');
        extension = `.${fileNameParts[1]}`;
      }
      const isValidExt = await isValidExtension(extension, allowedExtension);

      if (!isValidExt) {
        isValidFile = false;
        error = `The type of ${field} must be ${allowedExtension.join('/')}.`;
      }
    }

    // Validate file size
    console.log("maxSizeInMb",maxSizeInMb);
    if (maxSizeInMb) {
      
      const isValidSize = await isValidFileSize(file.size, maxSizeInMb * 1024 * 1024);

      if (!isValidSize) {
        isValidFile = false;
        error = `Please select a ${field} which has a size upto ${maxSizeInMb.toString()} MB.`;
      }
    }
  }

  if (!isValidFile) {
    return error;
  }
};

const uploadToS3 = async (file: any, folderName: string, isLocalFile?: boolean) => {
  const uniqueIdentifier = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_').replace(/\.[^.]+$/, '');
  const extension = file.mimetype.split('/')[1]?.toLowerCase();

  let bodyData = file.buffer;

  if (isLocalFile) {
    bodyData = fs.readFileSync(file.path);
  }

  const params: any = {
    Bucket: config.AWS.S3_BUCKET_URL,
    Key: 'CanConnect/' + file?.role + '/' + file?.id + '/' + folderName + '/' + `${sanitizedFilename}_${uniqueIdentifier}.${extension}`,
    Body: bodyData,
    acl: 'public-read',
    contentType: file.mimetype,
  };
  console.log('Params================>', params);

  return new Promise((resolve, reject) => {
    s3bucket.upload(params, function (err: any, data: any) {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};

const deleteUploadedS3URL = async (req: any) => {
  const payload = req.objectKey;
  console.log(payload);

  if (payload !== '' && payload !== null && payload !== undefined) {
    const urlParts = payload.split('/');
    const objectKey = urlParts.slice(3).join('/');

    // Define parameters for deleting the object
    const params: any = {
      Bucket: config.AWS.S3_BUCKET_URL,
      Key: objectKey,
    };

    // Delete the object from the S3 bucket
    s3bucket.deleteObject(params, (err: any, data: any) => {
      if (err) {
        console.error('Error deleting object:', err);
      } else {
        console.log('Object deleted successfully:', data);
      }
    });
  } else {
    console.log('Object value is empty:', {});
  }
};

const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    const baseDirectory = './uploads';
    if (!fs.existsSync(baseDirectory)) {
      fs.mkdirSync(baseDirectory);
    }
    const subDirectory = `${baseDirectory}/${file.fieldname}`;
    if (!fs.existsSync(subDirectory)) {
      fs.mkdirSync(subDirectory);
    }
    cb(null, subDirectory);
  },
  filename: function (req: any, file: any, cb: any) {
      cb(null, file.fieldname + '_' + Date.now());
  },
});
const upload = multer({ storage: storage });

const uploadDocs = multer({ storage: multer.memoryStorage() });

export { validateFile, uploadToS3, deleteUploadedS3URL, upload, uploadDocs };
