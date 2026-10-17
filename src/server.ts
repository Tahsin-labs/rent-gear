import app from "./app"
import config from "./config";
import { prisma } from "./lib/prisma";
import "dotenv/config"

const PORT = config.port


async function main() {
    try {

        // await prisma.$connect();
        console.log("CONNECT DATABASE SUCCESSFULLY")
        app.listen(PORT, () => {
            console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
        })
    } catch (error) {
        console.log("error starting the server:", error);
        // await prisma.$disconnect();
        process.exit(1);
    }
}

main()