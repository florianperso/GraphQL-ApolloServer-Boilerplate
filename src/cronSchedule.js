
import cron from "node-cron";
import { Op } from "sequelize";
import moment from "moment";

export default (models) => {
  cron.schedule("* * * * *", async () => {
    console.log("running a task every minute");
    if (models) {
      await models.Session.destroy({
        where: { idleAt: { [Op.lt]: moment() } },
      });
    }
  });
};
