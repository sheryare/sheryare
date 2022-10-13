import { Clients } from "../models/client.model";
import { ClientSettings } from "../models/clientsettings.model";

const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: "mysql",
  host: "45.200.120.78",
  port: 3306,
  username: "clientuser",
  password: "8hRE+zpyLk",
  database: "Client",
  entities: [ClientSettings, Clients],
  logging: true,
  // synchronize: true,
});
export default myDataSource;
