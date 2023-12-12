import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Login from './Login';
import Register from './Register';
import Header from './Header';
import Footer from './Footer';
import Note from './Note';
import Createnote from './Createnote';

function App() {
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const API_BASE_URL = 'https://my-note-taker-52uh.onrender.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchNotes(currentUser.uid);
      } else {
        setNotes([]);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const fetchNotes = (userId) => {
    axios.get(`${API_BASE_URL}/notes?userId=${userId}`)
      .then(response => {
        console.log(response.data); //TESTTTTTTT
        setNotes(response.data);
      })
      .catch(error => {
        console.error('Error fetching notes', error);
      });
  };

  const addNote = (note) => {
    const newNote = { ...note, userId: user.uid };
    axios.post(`${API_BASE_URL}/notes`, newNote)
      .then((response) => {
        setNotes(prevNotes => [...prevNotes, response.data]);
      })
      .catch((error) => {
        console.error('Error adding new note', error);
      });
  };

  const deleteNote = (noteId) => {
    axios.delete(`${API_BASE_URL}/notes/${noteId}?userId=${user.uid}`)
      .then(() => {
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      })
      .catch((error) => {
        console.error('Error deleting note', error);
      });
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setNotes([]);
    }).catch(error => {
      console.error('Error logging out', error);
    });
  };

  return (
    <div>
      {!user ? (
        <>
          <Login onLogin={setUser} />
          <Register onRegister={setUser} />
        </>
      ) : (
        <>
          <Header />
          <Createnote onAdd={addNote} />
          {notes && notes.length > 0 && notes.map((noteItem) => (
            <Note
              key={noteItem._id}
              id={noteItem._id}
              title={noteItem.title}
              content={noteItem.content}
              onDelete={deleteNote}
            />
          ))}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
