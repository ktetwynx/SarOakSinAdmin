import "./singer.css";
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

const Singer = (props: Props) => {
  const navigate = useNavigate();
  const [selectedDeleteRow, setSelectedDeleteRow] = useState();
  const [isShowDeleteDialog, setIsShowDeleteDialog] = useState<boolean>(false);
  const [singerDataList, setSingerDataList] = useState([]);
  useEffect(() => {
    fetchSingerApi();
  }, []);

  const fetchSingerApi = async () => {
    let formData = new FormData();
    formData.append("name", "author");
    formData.append("page", "0");
    formData.append("size", "20");
    await ApiFetchService(API_URL + `user/lyric/home-navigate`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: "ApiKey f90f76d2-f70d-11ed-b67e-0242ac120002",
    }).then((response: any) => {
      if (response.code === 200) {
        const reverseData = reverseDataArray(response.data.content);
        setSingerDataList(reverseData);
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
          const deletedFilterList = singerDataList.filter(
            (value: any, index: number) => value.id !== row.id
          );
          setIsShowDeleteDialog(false);
          setSingerDataList(deletedFilterList);
        }
      });
    },
    [singerDataList]
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
    navigate("/singer/edit", { state: { singerData: row } });
  }, []);

  const column = [
    { name: "No", selector: (row: any) => row.id },
    {
      name: "Singer Name",
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

  const clickedCreateSinger = useCallback(() => {
    navigate("/singer/create");
  }, []);

  const SingerList = () => {
    return <DataTable columns={column} data={singerDataList} />;
  };

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <h3 className="text_header">Singer List</h3>
          <MyButton
            onClick={clickedCreateSinger}
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
      <SingerList />

      <DeleteDialog
        data={selectedDeleteRow}
        isVisible={isShowDeleteDialog}
        clickedOnClose={() => setIsShowDeleteDialog(false)}
        clickedOnDelete={(row) => clickedOnDelete(row)}
      />
    </div>
  );
};

export default connectToStore(Singer);
