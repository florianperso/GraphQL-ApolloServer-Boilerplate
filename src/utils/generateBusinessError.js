import pick from 'lodash/pick';
import errorCodes from '../constants/errorCodes';

export default (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => pick(x, ['location', 'message', 'code']))
  }
  
  return [{ location: 'name', ...errorCodes.ERROR_OCCURED }];
};

export const generateBusinessErrorWithLocation =  (e, models, error, location) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => {return {...error, location, ...pick(x, ['message', 'code'])}})
  }
  
  return [{ location: 'name', ...errorCodes.ERROR_OCCURED }];
};
