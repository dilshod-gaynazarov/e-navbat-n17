import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import { createSuperAdmin } from './db/create-superadmin.js';
import adminRouter from './routes/admin.route.js';
import doctorRouter from './routes/doctor.route.js';
import graphRouter from './routes/graph.route.js';
import patientRouter from './routes/patient.route.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());

await connectDB();
await createSuperAdmin();

app.use(cookieParser());

app.use('/admin', adminRouter);
app.use('/doctor', doctorRouter);
app.use('/graph', graphRouter);
app.use('/patient', patientRouter);

app.listen(config.PORT, () => console.log('server running on port', +config.PORT));
