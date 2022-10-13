import ecommerceDb from "./ecommerceDb";
import clientDb from "./clientDb";
export const connectDatabase = async () => {
  ecommerceDb
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err: any) => {
      console.error("Error during Data Source initialization:", err);
    });

  clientDb
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err: any) => {
      console.error("Error during Data Source initialization:", err);
    });
};
