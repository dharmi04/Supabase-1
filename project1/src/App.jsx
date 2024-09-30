import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Pages/Login';
import Home from './Pages/Home';

import Introduction from './Pages/Introduction';
import TriviaGame from './Pages/TriviaGame';
import AddHabit from './Pages/AddHabit';
import Feed from './Pages/Feed';
import AddPost from './Pages/AddPost';
import YourPosts from './Pages/YourPosts';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Introduction />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/landing" element={<Landing />} />
       <Route path="/game" element={<TriviaGame />} />
       <Route path="/addhabit" element={<AddHabit />} />
       <Route path="/feed" element={<Feed />} />
       <Route path="/addpost" element={<AddPost />} />
       <Route path="/allpost" element={<YourPosts />} />
      </Routes>
    </Router>
  );
};

export default App;
