const express = require('express');
const app = express();
app.use(express.json());

let leaves = [
  { id: 701, employeeName: 'Ananya Singh', employeeCode: 'EMP101', leaveType: 'Casual', days: 2, status: 'Pending' },
  { id: 702, employeeName: 'Rahul Verma',  employeeCode: 'EMP102', leaveType: 'Sick',   days: 1, status: 'Approved' },
  { id: 703, employeeName: 'Simran Kaur',  employeeCode: 'EMP103', leaveType: 'Earned', days: 3, status: 'Rejected' }
];

const LEAVE_TYPES = ['Casual', 'Sick', 'Earned'];
const STATUSES = ['Pending', 'Approved', 'Rejected'];

// Returns an error message, or null if the body is valid
function validate(body) {
  const { employeeName, employeeCode, leaveType, days, status } = body || {};

  if (!employeeName || typeof employeeName !== 'string' || !employeeName.trim())
    return 'employeeName is required and must be a non-empty string';
  if (!employeeCode || typeof employeeCode !== 'string' || !employeeCode.trim())
    return 'employeeCode is required and must be a non-empty string';
  if (!LEAVE_TYPES.includes(leaveType))
    return 'leaveType must be one of: Casual, Sick, Earned';
  if (!Number.isInteger(days) || days <= 0)
    return 'days must be a positive integer';
  if (!STATUSES.includes(status))
    return 'status must be one of: Pending, Approved, Rejected';

  return null;
}

// 1. GET all
app.get('/api/leaves', (req, res) => {
  res.status(200).json(leaves);
});

// 6. Filter by status (case-insensitive) - must be before /:id
app.get('/api/leaves/filter', (req, res) => {
  const status = (req.query.status || '').toLowerCase();
  const result = leaves.filter(l => l.status.toLowerCase() === status);
  res.status(200).json(result);
});

// 7. Pending requests - must be before /:id
app.get('/api/leaves/pending', (req, res) => {
  res.status(200).json(leaves.filter(l => l.status === 'Pending'));
});

// 3. GET by ID
app.get('/api/leaves/:id', (req, res) => {
  const leave = leaves.find(l => l.id === Number(req.params.id));
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });
  res.status(200).json(leave);
});

// 2. POST
app.post('/api/leaves', (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  const { employeeName, employeeCode, leaveType, days, status } = req.body;
  const newId = leaves.length ? Math.max(...leaves.map(l => l.id)) + 1 : 701;
  const newLeave = { id: newId, employeeName, employeeCode, leaveType, days, status };

  leaves.push(newLeave);
  res.status(201).json(newLeave);
});

// 4. PUT
app.put('/api/leaves/:id', (req, res) => {
  const leave = leaves.find(l => l.id === Number(req.params.id));
  if (!leave) return res.status(404).json({ message: 'Leave request not found' });

  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  const { employeeName, employeeCode, leaveType, days, status } = req.body;
  Object.assign(leave, { employeeName, employeeCode, leaveType, days, status });
  res.status(200).json(leave);
});

// 5. DELETE
app.delete('/api/leaves/:id', (req, res) => {
  const index = leaves.findIndex(l => l.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Leave request not found' });

  leaves.splice(index, 1);
  res.status(200).json({ message: 'Leave request deleted successfully' });
});

app.listen(3000, () => console.log('Server running on port 3000'));