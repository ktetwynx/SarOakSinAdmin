import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { Album } from "./components/album/Album";
import { Author } from "./components/author/Author";
import { Book } from "./components/book/Book";
import { Category } from "./components/category/Category";
import { Lyric } from "./components/lyric/Lyric";
import { SideBar } from "./components/side_bar/SideBar";
import { Singer } from "./components/singer/Singer";
import { TopBar } from "./components/top_bar/TopBar";
import { CreateCategory } from "./components/create/CreateCategory";
import { CreateSinger } from "./components/create/CreateSinger";
import { CreateAlbum } from "./components/create/CreateAlbum";
import { CreatetLyric } from "./components/create/CreateLyric";
import { CreateAuthor } from "./components/create/CreateAuthor";
import { CreateBook } from "./components/create/CreateBook";
import AuthForm from "./components/authentication/AuthForm";

function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <div>
        <TopBar />
        <div className="body">
          {token && <SideBar />}

          <Routes>
            {/* <Route exact path="/" element={token ? <Navigate to="/category" /> : <Navigate to="/login" />} /> */}
            <Route exact path="/" element={<Navigate to="/category" />} />
            {/* <Route exact path="/category" element={token ? <Category /> : <Navigate to="/login" />} /> */}
            <Route exact path="/category" element={<Category />} />
            <Route exact path="/author" element={token ? <Author /> : <Navigate to="/login" />} />
            <Route exact path="/book" element={token ? <Book /> : <Navigate to="/login" />} />
            <Route exact path="/singer" element={token ? <Singer /> : <Navigate to="/login" />} />
            <Route exact path="/album" element={token ? <Album /> : <Navigate to="/login" />} />
            <Route exact path="/lyric" element={token ? <Lyric /> : <Navigate to="/login" />} />
            <Route exact path="/lyric/create" element={token ? <CreatetLyric /> : <Navigate to="/login" />} />
            <Route exact path="/book/create" element={token ? <CreateBook /> : <Navigate to="/login" />} />
            <Route exact path="/book/edit" element={token ? <CreateBook /> : <Navigate to="/login" />} />
            <Route exact path="/author/create" element={token ? <CreateAuthor /> : <Navigate to="/login" />} />
            <Route exact path="/author/edit" element={token ? <CreateAuthor /> : <Navigate to="/login" />} />
            {/* <Route exact path="/category/create" element={token ? <CreateCategory /> : <Navigate to="/login" />} /> */}
            <Route exact path="/category/create" element={<CreateCategory />} />
            <Route exact path="/category/edit" element={token ? <CreateCategory /> : <Navigate to="/login" />} />
            <Route exact path="/singer/create" element={token ? <CreateSinger /> : <Navigate to="/login" />} />
            <Route exact path="/singer/edit" element={token ? <CreateSinger /> : <Navigate to="/login" />} />
            <Route exact path="/album/edit" element= {token ? <CreateAlbum /> : <Navigate to="/login" />}/>
            <Route exact path="/album/create" element={token ? <CreateAlbum /> : <Navigate to="/login" />} />
            <Route exact path="/login" element={<AuthForm />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
