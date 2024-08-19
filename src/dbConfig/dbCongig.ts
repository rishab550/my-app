import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    const connection = mongoose.connection;

    connection.on("MongoDB connected", () => {
      status: 200;
      console.log("MongodDB successfully connected");
    });

    connection.on("MongoDB not connected", (error) => {
      status: 500;
      console.log("MongoDB has not been connected successfully");
      console.error(error);
      process.exit();
    });
  } catch (error) {
    console.log(
      error,
      "Something went wrong while establishing the connection with the databases"
    );
    console.error(error);
  }
};
