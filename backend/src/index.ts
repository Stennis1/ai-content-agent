import "dotenv/config"
import { app } from "./app";
import { adminRouter } from "./routes/admin";
import { contentRouter } from "./routes/content";
import { healthRouter } from "./routes/health";
import { mediaRouter } from "./routes/media";
import { start } from "repl";
import { startScheduler } from "./services/scheduler";

const PORT = process.env.PORT || 4000;

// startScheduler();

app.use("/health", healthRouter);
app.use("/content", contentRouter);
app.use("/admin", adminRouter);
app.use("/media", mediaRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} - http://localhost:4000/`);
});