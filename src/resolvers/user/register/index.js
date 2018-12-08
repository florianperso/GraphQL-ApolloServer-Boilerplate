import { generateBusinessErrorWithLocation } from "../../../utils/generateBusinessError";
import errorCodes from '../../../constants/errorCodes';

export default async (args, models) => {
  // const u = models.sequelize
  //   .transaction(function(t) {
  //     return models.User.create(args, { transaction: t }).then(function(user) {
  //       return models.Password.create(
  //         {
  //           userId: user.id,
  //           password: args.password,
  //         },
  //         { transaction: t },
  //       );
  //     });
  //   })
  //   .then(function(result) {
  //     console.log("RR");
  //     // t.commit()
  //   })
  //   .catch(function(error) {
  //     console.log("ERR PWD");
  //     // t.rollback()
  //     const businessError = generateBusinessErrorWithLocation(error, models, 'register');
  //     console.log('be', {businessError});
  //     return {
  //       ok: false,
  //       businessError,
  //     };
  //   });

  // console.log("T RES", u);

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
      businessError: generateBusinessErrorWithLocation(error, models, errorCodes.ERROR_REGISTRATION, 'register'),
    };
  }
};
