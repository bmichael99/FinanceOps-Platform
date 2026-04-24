import path from 'path';

//TODO: move similar variables here, and import from here
export const config = {
  UPLOADS_DIR: process.env.UPLOADS_DIR
    ?? path.resolve(process.cwd(), 'uploads'),
};