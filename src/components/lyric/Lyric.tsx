import "./lyric.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import { MyButton } from "../MyButton";
import { useCallback, useEffect, useState } from "react";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL } from "../../Constant";
import { useNavigate } from "react-router-dom";

export function Lyric() {
  const navigate = useNavigate();
  const [lyricDataList, setLyricDataList] = useState([]);
  useEffect(() => {
    fetchLyricApi();
  }, []);

  const clickedEdit = useCallback((row: any) => {
    navigate("/lyric/edit", { state: { lyricData: row } });
  }, []);

  const fetchLyricApi = async () => {
    let formData = new FormData();
    formData.append("name", "lyric");
    formData.append("page", "0");
    formData.append("size", "100");
    await ApiFetchService(API_URL + `user/lyric/home-navigate`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: "ApiKey f90f76d2-f70d-11ed-b67e-0242ac120002",
    }).then((response: any) => {
      if (response.code === 200) {
        setLyricDataList(response.data.content);
      }
    });
  };

  const column = [
    { name: "No", selector: (row: any) => row.id },
    {
      name: "Lyric Name",
      selector: (row: any) => (
        <p className="fontsize12pt">
          <b> {row.name}</b>
        </p>
      ),
    },
    {
      name: "Image",
      selector: (row: any) => (
        <img
          style={{ width: 60, height: 60, margin: 5, borderRadius: 10 }}
          src={`${API_URL}${row.imgPath}`}
          alt=""
        />
      ),
    },
    {
      name: "",
      selector: (row: any) => (
        <div className="actions_container">
          <MyButton
            style={{
              marginRight: "16px",
              borderRadius: "20px",
            }}
            textColor="white"
            backgroundColor="#e44848"
            hover_backgroundColor="#c83232"
          >
            <DeleteIcon fontSize="small" className="icon" />
          </MyButton>
          <MyButton
            onClick={() => clickedEdit(row)}
            style={{
              marginRight: "16px",
              borderRadius: "20px",
            }}
            textColor="white"
            backgroundColor="#488ce4"
            hover_backgroundColor="#3577cc"
          >
            <EditIcon fontSize="small" className="icon" />
          </MyButton>
        </div>
      ),
    },
  ];

  const AlbumList = () => {
    return <DataTable columns={column} data={lyricDataList} />;
  };

  const clickedCreateLyric = useCallback(() => {
    navigate("/lyric/create");
  }, []);

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <h3 className="text_header">Lyric List</h3>
          <MyButton
            onClick={clickedCreateLyric}
            style={{
              marginLeft: "16px",
              borderRadius: "20px",
            }}
            textColor="white"
            backgroundColor="#39bf39"
            hover_backgroundColor="#2fb02f"
          >
            <div className="create_text">Create</div>
            <ControlPointIcon className="icon" />
          </MyButton>
        </div>
        <div className="header_container">
          <input
            className="author_search_input"
            type="text"
            id="name"
            name="name"
            required
            placeholder="Search"
            size={10}
          />
          <SearchIcon fontSize="medium" className="search_icon" />
        </div>
      </div>
      <AlbumList />
    </div>
  );
}
