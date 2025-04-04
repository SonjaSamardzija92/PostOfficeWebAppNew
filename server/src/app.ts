import express, { Application, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get("/api/hello", (req: Request, res: Response) => {
  res.json({ message: "Hello from the TypeScript backend!" });
});

app.post("/api/echo", (req: Request, res: Response) => {
  res.json({ received: req.body });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
