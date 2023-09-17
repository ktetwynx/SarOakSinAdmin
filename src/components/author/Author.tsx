import "./author.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import { MyButton } from "../MyButton";
import { useCallback, useEffect, useState } from "react";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_KEY_PRODUCTION, API_URL } from "../../Constant";
import { useNavigate } from "react-router-dom";
import { reverseDataArray } from "../../service/Utility";
import { ConnectedProps, connect } from "react-redux";
import { DeleteDialog } from "../DeleteDialog";

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

const Author = (props: Props) => {
  const navigate = useNavigate();
  const [selectedDeleteRow, setSelectedDeleteRow] = useState();
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState<boolean>(false);
  const [authorDataList, setAuthtorDataList] = useState([]);
  useEffect(() => {
    fetchAuthorApi();
  }, []);

  const fetchAuthorApi = async () => {
    console.log("fetchAuthorApi");
    let formData = new FormData();
    formData.append("name", "authorBook");
    formData.append("page", "0");
    formData.append("size", "20");
    await ApiFetchService(API_URL + `user/lyric/home-navigate`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: API_KEY_PRODUCTION,
    }).then((response: any) => {
      console.log("response");
      if (response.code === 200) {
        const reverseData = reverseDataArray(response.data.content);
        setAuthtorDataList(reverseData);
      }
    });
  };

  const clickedOnDelete = useCallback(
    async (row: any) => {
      let formData = new FormData();
      formData.append("id", row.id);
      formData.append("name", "author");
      await ApiFetchService(API_URL + `admin/delete`, formData, {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${props.token}`,
      }).then((response: any) => {
        if (response.code == 200) {
          const deletedFilterList = authorDataList.filter(
            (value: any, index: number) => value.id !== row.id
          );
          setIsShowDeleteDialog(false);
          setAuthtorDataList(deletedFilterList);
        }
      });
    },
    [authorDataList]
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

  const clickedEdit = useCallback((row: any) => {
    navigate("/author/edit", { state: { authorData: row } });
  }, []);

  const clickedCreateAuthor = useCallback(() => {
    navigate("/author/create");
  }, []);

  const column = [
    { name: "No", selector: (row: any) => row.id },
    {
      name: "Author Name",
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
          style={{
            width: 60,
            height: 60,
            margin: 5,
            borderRadius: 10,
            resize: "block",
          }}
          src={`${API_URL}${row.profile}`}
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

  const AuthorList = () => {
    return <DataTable columns={column} data={authorDataList} />;
  };

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <h3 className="text_header">Author List</h3>
          <MyButton
            onClick={() => clickedCreateAuthor()}
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
      <AuthorList />

      <DeleteDialog
        data={selectedDeleteRow}
        isVisible={isShowDeleteDialog}
        clickedOnClose={() => setIsShowDeleteDialog(false)}
        clickedOnDelete={(row) => clickedOnDelete(row)}
      />
    </div>
  );
};
export default connectToStore(Author);
