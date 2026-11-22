import app from "./app"
import config from "./config";
import { prisma } from "./lib/prisma";
import "dotenv/config"

const PORT = Number(process.env.PORT) || config.port || 5000;
const HOST = "0.0.0.0";

async function main() {
    try {
        await prisma.$connect();
        console.log("CONNECT DATABASE SUCCESSFULLY")
        app.listen(PORT, HOST, () => {
            console.log(`SERVER IS RUNNING ON ${HOST}:${PORT}`);
        })
    } catch (error) {
        console.log("error starting the server:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

main()