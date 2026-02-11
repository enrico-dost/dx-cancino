import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mock agency data matching the user story requirements
const mockAgencyData = {
  data: [
    {
      org_unit_id: 101,
      org_unit_name: "Sectoral Planning Councils",
      agencies: [
        {
          org_unit_id: 102,
          org_unit_name: "PCAARRD",
          parent_org_unit_id: "101"
        },
        {
          org_unit_id: 103,
          org_unit_name: "PCHRD",
          parent_org_unit_id: "101"
        },
        {
          org_unit_id: 104,
          org_unit_name: "PCIEERD",
          parent_org_unit_id: "101"
        }
      ]
    },
    {
      org_unit_id: 153,
      org_unit_name: "Research And Development Institutes",
      agencies: [
        {
          org_unit_id: 139,
          org_unit_name: "ASTI",
          parent_org_unit_id: "153"
        },
        {
          org_unit_id: 140,
          org_unit_name: "FNRI",
          parent_org_unit_id: "153"
        },
        {
          org_unit_id: 141,
          org_unit_name: "FPRDI",
          parent_org_unit_id: "153"
        },
        {
          org_unit_id: 142,
          org_unit_name: "ITDI",
          parent_org_unit_id: "153"
        },
        {
          org_unit_id: 143,
          org_unit_name: "MIRDC",
          parent_org_unit_id: "153"
        },
        {
          org_unit_id: 144,
          org_unit_name: "PNRI",
          parent_org_unit_id: "153"
        },
        {
          org_unit_id: 145,
          org_unit_name: "PTRI",
          parent_org_unit_id: "153"
        }
      ]
    },
    {
      org_unit_id: 155,
      org_unit_name: "S&T Service Institutes",
      agencies: [
        {
          org_unit_id: 146,
          org_unit_name: "PAGASA",
          parent_org_unit_id: "155"
        },
        {
          org_unit_id: 147,
          org_unit_name: "PHIVOLCS",
          parent_org_unit_id: "155"
        },
        {
          org_unit_id: 154,
          org_unit_name: "SEI",
          parent_org_unit_id: "155"
        },
        {
          org_unit_id: 150,
          org_unit_name: "PSHS",
          parent_org_unit_id: "155"
        },
        {
          org_unit_id: 148,
          org_unit_name: "STII",
          parent_org_unit_id: "155"
        },
        {
          org_unit_id: 152,
          org_unit_name: "TAPI",
          parent_org_unit_id: "155"
        }
      ]
    },
    {
      org_unit_id: 157,
      org_unit_name: "Advisory Body",
      agencies: [
        {
          org_unit_id: 156,
          org_unit_name: "NAST",
          parent_org_unit_id: "157"
        },
        {
          org_unit_id: 149,
          org_unit_name: "NRCP",
          parent_org_unit_id: "157"
        }
      ]
    }
  ]
};

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      message: 'unauthorized',
      data: {}
    });
  }

  // For testing purposes, accept any token
  // In production, verify with JWT
  next();
};

// Agency endpoint
app.get('/api/agencies/by-sector/list', authenticateToken, (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'success',
    data: mockAgencyData.data
  });
});

// Health check
app.get('/', (req, res) => {
  res.send('Agency API Server is running!');
});

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access it at: http://${HOST}:${PORT}`);
  console.log(`Agency endpoint: http://${HOST}:${PORT}/api/agencies/by-sector/list`);
});

export { app };
