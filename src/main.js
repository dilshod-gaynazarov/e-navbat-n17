import express from 'express';
import { config } from 'dotenv';
import { connectDB } from './db/index.js';
import { createSuperAdmin } from './db/create-superadmin.js';
import adminRouter from './routes/admin.route.js';
import doctorRouter from './routes/doctor.route.js';
config();

const app = express();
const PORT = Number(process.env.PORT);

app.use(express.json());
await connectDB();
await createSuperAdmin();
app.use('/admin', adminRouter);
app.use('/doctor', doctorRouter);

app.listen(PORT, () => console.log('server running on port', PORT));
