
const express = require('express');
const app = express();
const PORT = 3001;

let notes = [{ id: 1, text: "Welcome! Click here to edit." }]; // In-memory data

app.use(express.json());

// Serve the UI
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family:sans-serif; max-width:500px; margin:auto; padding:20px;">
            <h2>📝 Instant Notes</h2>
            <div id="list"></div>
            <button onclick="add()" style="margin-top:10px; width:100%; cursor:pointer;">+ New Note</button>
            <script>
                const load = () => fetch('/notes').then(r => r.json()).then(data => {
                    document.getElementById('list').innerHTML = data.map(n => 
                        \`<textarea onchange="save(\${n.id}, this.value)" style="width:100%; height:60px; margin-bottom:10px;">\${n.text}</textarea>\`
                    ).join('');
                });
                const add = () => fetch('/notes', { method: 'POST' }).then(load);
                const save = (id, text) => fetch('/notes/'+id, {
                    method: 'PUT', headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ text })
                });
                load();
            </script>
        </div>
    `);
});

// API Routes
app.get('/notes', (req, res) => res.json(notes));

app.post('/notes', (req, res) => {
    const newNote = { id: Date.now(), text: "" };
    notes.push(newNote);
    res.json(newNote);
});

app.put('/notes/:id', (req, res) => {
    const note = notes.find(n => n.id == req.params.id);
    if (note) note.text = req.body.text;
    res.json({ success: true });
});

app.listen(PORT, () => console.log(\`Running: http://localhost:\${PORT}\`));
