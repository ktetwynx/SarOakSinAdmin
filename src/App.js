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

function App() {
  return (
    <BrowserRouter>
      <div>
        <TopBar />
        <div className="body">
          <SideBar />

          <Routes>
            <Route exact path="/" element={<Navigate to="/category" />} />
            <Route exact path="/category" element={<Category />} />
            <Route exact path="/author" element={<Author />} />
            <Route exact path="/book" element={<Book />} />
            <Route exact path="/singer" element={<Singer />} />
            <Route exact path="/album" element={<Album />} />
            <Route exact path="/lyric" element={<Lyric />} />
            <Route exact path="/lyric/create" element={<CreatetLyric />} />
            <Route exact path="/author/create" element={<CreateAuthor />} />
            <Route exact path="/author/edit" element={<CreateAuthor />} />
            <Route exact path="/category/create" element={<CreateCategory />} />
            <Route exact path="/category/edit" element={<CreateCategory />} />
            <Route exact path="/singer/create" element={<CreateSinger />} />
            <Route exact path="/singer/edit" element={<CreateSinger />} />
            <Route exact path="/album/edit" element={<CreateAlbum />} />
            <Route exact path="/album/create" element={<CreateAlbum />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
