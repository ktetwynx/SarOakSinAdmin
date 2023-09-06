import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Album } from "./components/album/Album";
import { Author } from "./components/author/Author";
import { Book } from "./components/book/Book";
import { Category } from "./components/category/Category";
import { Lyric } from "./components/lyric/Lyric";
import { SideBar } from "./components/side_bar/SideBar";
import { Singer } from "./components/singer/Singer";
import { ConnectedProps, connect } from "react-redux";
import { setToken } from "./redux/reducer";
import TopBar from "./components/top_bar/TopBar";
import CreateBook from "./components/create/CreateBook";
import CreateAuthor from "./components/create/CreateAuthor";
import CreateCategory from "./components/create/CreateCategory";
import CreateSinger from "./components/create/CreateSinger";
import CreateAlbum from "./components/create/CreateAlbum";
import AuthForm from "./components/authentication/AuthForm";
import CreateLyric from "./components/create/CreateLyric";

const mapstateToProps = (state: { token: any }) => {
  return {
    token: state.token,
  };
};

const mapDispatchToProps = (dispatch: (arg0: any) => void) => {
  return {};
};

const connectToStore = connect(mapstateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connectToStore>;

const RouteScreen = (props: Props) => {
  return (
    <>
      {props?.token ? (
        <BrowserRouter>
          <div>
            <TopBar />
            <div className="body">
              <SideBar />
              <Routes>
                <Route path="/" element={<Navigate to="/category" />} />
                <Route path="/category" element={<Category />} />
                <Route path="/author" element={<Author />} />
                <Route path="/book" element={<Book />} />
                <Route path="/singer" element={<Singer />} />
                <Route path="/album" element={<Album />} />
                <Route path="/lyric" element={<Lyric />} />
                <Route path="/lyric/create" element={<CreateLyric />} />
                <Route path="/lyric/edit" element={<CreateLyric />} />
                <Route path="/book/create" element={<CreateBook />} />
                <Route path="/book/edit" element={<CreateBook />} />
                <Route path="/author/create" element={<CreateAuthor />} />
                <Route path="/author/edit" element={<CreateAuthor />} />
                <Route path="/category/create" element={<CreateCategory />} />
                <Route path="/category/edit" element={<CreateCategory />} />
                <Route path="/singer/create" element={<CreateSinger />} />
                <Route path="/singer/edit" element={<CreateSinger />} />
                <Route path="/album/edit" element={<CreateAlbum />} />
                <Route path="/album/create" element={<CreateAlbum />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<AuthForm />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};

export default connectToStore(RouteScreen);
