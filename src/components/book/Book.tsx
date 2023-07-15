import "./book.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import DataTable from "react-data-table-component";
import { MyButton } from "../MyButton";

export function Book() {
  const column = [
    { name: "No", selector: (row: any) => row.id },
    {
      name: "Book Name",
      selector: (row: any) => (
        <p className="fontsize12pt">
          <b> {row.book_name}</b>
        </p>
      ),
    },
    { name: "Author Name", selector: (row: any) => row.author_name },
    {
      name: "Category Name",
      selector: (row: any) => (
        <p className="fontsize12pt">{row.category_name}</p>
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
  const book_data_list = [
    {
      id: 1,
      category_name: "yatha",
      book_name: "mg kyaw",
      author_name: "kyaw kyaw",
    },
    {
      id: 2,
      category_name: "yatha",
      book_name: "mg mg",
      author_name: "kyaw kyaw",
    },
    {
      id: 3,
      category_name: "yatha",
      book_name: "kyaw kyaw",
      author_name: "kyaw kyaw",
    },
    {
      id: 4,
      category_name: "yatha",
      book_name: "thi thi",
      author_name: "kyaw kyaw",
    },
    {
      id: 5,
      category_name: "yatha",
      book_name: "hla hla",
      author_name: "kyaw kyaw",
    },
  ];
  const BookList = () => {
    return <DataTable columns={column} data={book_data_list} />;
  };

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <h3 className="text_header">Book List</h3>
          <MyButton
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
