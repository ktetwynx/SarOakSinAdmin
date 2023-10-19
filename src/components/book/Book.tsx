import "./book.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { Button } from "@mui/material";
import DataTable from "react-data-table-component";
import { MyButton } from "../MyButton";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_KEY_PRODUCTION, API_URL } from "../../Constant";
import { useLocation, useNavigate } from "react-router-dom";
import { reverseDataArray } from "../../service/Utility";
import { ConnectedProps, connect } from "react-redux";
import { DeleteDialog } from "../DeleteDialog";
import { STORAGE_KEY } from "../..";

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

const Book = (props: Props) => {
  const navigate = useNavigate();
  const [selectedDeleteRow, setSelectedDeleteRow] = useState();
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState<boolean>(false);
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    fetchBookListApi();
  }, []);

  function restoreScrollPosition() {
    const y: any = sessionStorage.getItem(STORAGE_KEY) || 0;
    console.log("getItem", y, "E<W<WE<");
    setTimeout(() => {
      window.scrollBy(0, y);
    }, 500);
  }

  const clickedCreateBook = useCallback(() => {
    navigate("/book/create");
  }, []);

  const clickedOnDelete = useCallback(
    async (row: any) => {
      let formData = new FormData();
      formData.append("id", row.id);
      formData.append("name", "book");
      await ApiFetchService(API_URL + `admin/delete`, formData, {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${props.token}`,
      }).then((response: any) => {
        if (response.code == 200) {
          const deletedFilterList = bookList.filter(
            (value: any, index: number) => value.id !== row.id
          );
          setIsShowDeleteDialog(false);
          setBookList(deletedFilterList);
        }
      });
    },
    [bookList]
  );

  const clickedDelete = useCallback(
    async (row: any) => {
      if (!isShowDeleteDialog) {
        setIsShowDeleteDialog(true);
        setSelectedDeleteRow(row);
      } else {
        setIsShowDeleteDialog(false);
      }
    },
    [isShowDeleteDialog]
  );

  const clickedEdit = (row: any) => {
    navigate("/book/edit", { state: { bookData: row } });
  };

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
    { name: "Author Name", selector: (row: any) => row.myAuthor?.name },
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
            onClick={() => clickedDelete(row)}
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
    let formData = new FormData();
    formData.append("page", "0");
    formData.append("size", "500");
    await ApiFetchService(API_URL + `user/book/list`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: API_KEY_PRODUCTION,
    }).then((response: any) => {
      const reverseData = reverseDataArray(response.content);
      setBookList(reverseData);
      restoreScrollPosition();
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

      <DeleteDialog
        data={selectedDeleteRow}
        isVisible={isShowDeleteDialog}
        clickedOnClose={() => setIsShowDeleteDialog(false)}
        clickedOnDelete={(row) => clickedOnDelete(row)}
      />
    </div>
  );
};

export default connectToStore(Book);
