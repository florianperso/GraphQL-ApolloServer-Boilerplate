import pick from 'lodash/pick';
import errorCodes from '../constants/errorCodes';

export default (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => pick(x, ['path', 'message', 'code']))
  }
  
  return [{ path: 'name', ...errorCodes.ERROR_OCCURED }];
};

export const generateBusinessErrorWithErrorConstant =  (e, models, error, path) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => {return {...error, path, ...pick(x, ['path', 'message', 'code'])}})
  }
  console.log('###ERR', e)
  return [{ path: 'name', ...errorCodes.ERROR_OCCURED }];
};
