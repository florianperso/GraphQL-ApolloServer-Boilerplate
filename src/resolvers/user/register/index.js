import { generateBusinessErrorWithErrorConstant } from "../../../utils/generateBusinessError";
import errorCodes from '../../../constants/errorCodes';

export default async (args, models) => {
  try {
    const transac = await models.sequelize.transaction(async transaction => {
      const user = await models.User.create(args, { transaction });
      await models.Password.create(
        {
          userId: user.id,
          password: args.password,
        },
        { transaction },
      );

      return user;
    });

    return {
      ok: true,
      user: transac,
    };
  } catch (error) {
    return {
      ok: false,
      businessError: generateBusinessErrorWithErrorConstant(error, models, errorCodes.ERROR_REGISTRATION, 'register'),
    };
  }
};
