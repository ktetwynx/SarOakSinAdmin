import "./category.css";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import DataTable from "react-data-table-component";
import { MyButton } from "../MyButton";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL } from "../../Constant";
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

const Category = (props: Props) => {
  const navigate = useNavigate();
  const [selectedDeleteRow, setSelectedDeleteRow] = useState();
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState<boolean>(false);
  const [categoryDataList, setCategoryDataList] = useState([]);
  const column = [
    { name: "No", selector: (row: any) => row.id },
    {
      name: "Category Name",
      selector: (row: any) => (
        <div className="fontsize12pt">
          <p>
            <b> {row.name}</b>
          </p>
        </div>
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

  const clickedOnDelete = useCallback(
    async (row: any) => {
      let formData = new FormData();
      formData.append("id", row.id);
      formData.append("name", "category");
      await ApiFetchService(API_URL + `admin/delete`, formData, {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${props.token}`,
      }).then((response: any) => {
        if (response.code == 200) {
          const deletedFilterList = categoryDataList.filter(
            (value: any, index: number) => value.id !== row.id
          );
          setIsShowDeleteDialog(false);
          setCategoryDataList(deletedFilterList);
        }
      });
    },
    [categoryDataList]
  );

  const clickedEdit = useCallback((row: any) => {
    navigate("/category/edit", { state: { categoryData: row } });
  }, []);

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

  const CategoryList = () => {
    return <DataTable columns={column} data={categoryDataList} />;
  };

  const clickedCreateCategory = useCallback(() => {
    navigate("/category/create");
  }, []);

  useEffect(() => {
    fetchCategoryApi();
  }, []);

  const fetchCategoryApi = async () => {
    await ApiFetchService(API_URL + `admin/category/list`, null, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: "ApiKey f90f76d2-f70d-11ed-b67e-0242ac120002",
    }).then((response: any) => {
      const reverseData = reverseDataArray(response.content);
      setCategoryDataList(reverseData);
    });
  };

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <h3 className="text_header">Category List</h3>
          <MyButton
            onClick={clickedCreateCategory}
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
            className="category_search_input"
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
      <CategoryList />

      <DeleteDialog
        data={selectedDeleteRow}
        isVisible={isShowDeleteDialog}
        clickedOnClose={() => setIsShowDeleteDialog(false)}
        clickedOnDelete={(row) => clickedOnDelete(row)}
      />
    </div>
  );
};

export default connectToStore(Category);
