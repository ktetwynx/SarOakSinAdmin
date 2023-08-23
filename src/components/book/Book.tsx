import "./book.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import DataTable from "react-data-table-component";
import { MyButton } from "../MyButton";
import { useCallback, useEffect, useState } from "react";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL } from "../../Constant";
import { useNavigate } from "react-router-dom";

export function Book() {
  const navigate = useNavigate();
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    fetchBookListApi();
  }, []);

  const clickedCreateBook = useCallback(() => {
    navigate("/book/create");
  }, []);

  const clickedEdit = useCallback((row: any) => {
    navigate("/book/edit", { state: { bookData: row } });
  }, []);

  const column = [
    { name: "No", selector: (row: any) => row.id },
    {
      name: "Book Name",
      selector: (row: any) => (
        <div className="book_name">
          <span>
            <b> {row.name}</b>
          </span>
        </div>
      ),
    },
    { name: "Author Name", selector: (row: any) => row.myAuthor.name },
    {
      name: "Category List",
      selector: (row: any) =>
        row.categories.map((value: any) => {
          return (
            <ul className="category_list">
              <label
                style={{ fontSize: "small", background: "gainsboro" }}
                className="category_text"
              >
                {value.name}
              </label>
            </ul>
          );
        }),
    },
    {
      name: "Image",
      selector: (row: any) => (
        <img
          style={{
            width: 60,
            height: 60,
            margin: 5,
            borderRadius: 10,
            resize: "block",
          }}
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

  const BookList = () => {
    return <DataTable columns={column} data={bookList} />;
  };

  const fetchBookListApi = useCallback(async () => {
    await ApiFetchService(API_URL + `user/book/list`, null, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: "ApiKey f90f76d2-f70d-11ed-b67e-0242ac120002",
    }).then((response: any) => {
      console.log(response.content);
      // setCategoryDataList(response.content);
      setBookList(response.content);
    });
  }, []);

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <h3 className="text_header">Book List</h3>
          <MyButton
            onClick={() => clickedCreateBook()}
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
            className="book_search_input"
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
      <BookList />
    </div>
  );
}
