import { ObjectSchema } from 'joi';

const validate = (type: 'body' | 'query' | 'params', schema: ObjectSchema) => (req, res, next) => {
  console.log('validation payload: ', type, req[type]);
  const { error } = schema.validate(req[type]);
  if (error) return res.status(400).send({ message: error.message });
  next();
};

export default validate;
