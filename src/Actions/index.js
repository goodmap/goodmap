import clientActions  from "./client";
import serverActions  from "./server";

module.exports = {
  ...clientActions,
  ...serverActions
}

export default module.exports
