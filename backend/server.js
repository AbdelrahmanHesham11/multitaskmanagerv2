const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const supabase = require('./supabase');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


app.get('/tasks', async (req, res) => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/tasks', async (req, res) => {
    const { title, description, user } = req.body;
    const { data, error } = await supabase.from('tasks').insert([{ title, description, user }]);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});


app.put('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});


app.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/', (req, res) => {
    res.send('Server is running! Try visiting /tasks');
});

app.listen(port, () => {
    console.log(`Backend running at http://localhost:${port}`);
});
