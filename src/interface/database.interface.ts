import mongoose from 'mongoose';

export interface db_function {
  [key: string]: any;
  collection: string;
  query?: any;
  options?: any;
  project?: any;
  limit?: number;
  skip?: number;
  populate?: any;
  sort?: any;
  time?: any;
  value?: any;
  id?: any;
  update?: any;
  document?: any;
  documents?: any;
  pipeline?: any;
}

export interface Schema {
  [key: string]: mongoose.Model<any & mongoose.PaginateModel<any>, any & mongoose.PaginateModel<any>>;
}
