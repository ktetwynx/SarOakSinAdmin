import "./create_lyric.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button, IconButton, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import CachedIcon from "@mui/icons-material/Cached";
import { MyButton } from "../MyButton";
import { DataGrid, GridRowId, useGridApiRef } from "@mui/x-data-grid";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_KEY_PRODUCTION, API_URL } from "../../Constant";
import { ConnectedProps, connect } from "react-redux";

interface File {
  file: any;
  fileImage: any;
}

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

const CreatetLyric = (props: Props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [lyricName, setLyricName] = useState("");
  const [lyricText, setLyricText] = useState("");
  const [selectedLyricPhoto, setSelectedLyricPhoto] = useState<File>({
    file: null,
    fileImage: null,
  });
  const [errorMessage, setErrorMessage] = useState(" ");
  const [singerDataList, setSingerDataList] = useState<any>([]);
  const [selectedSingerIdArray, setSelectedSingerIdArray] = useState<any>([]);
  const [totalPage, setTotalPage] = useState(0);
  const lyricTableRef = useGridApiRef();
  let rowIds: GridRowId[] = [];

  useEffect(() => {
    fetchSingerApi();
  }, []);

  useEffect(() => {
    if (state?.lyricData) {
      setLyricName(state.lyricData.name);
      setLyricText(state.lyricData.lyricText);
      console.log(state.lyricData.lyricText);
      state.lyricData.authors.forEach((value: any, id: any) => {
        rowIds.push(value.id);
      });
      lyricTableRef.current.setRowSelectionModel(rowIds);
      setSelectedLyricPhoto({
        file: null,
        fileImage: API_URL + state.lyricData.imgPath,
      });
    }
  }, [state]);

  const fetchSingerApi = async () => {
    let formData = new FormData();
    formData.append("name", "author");
    formData.append("page", "0");
    formData.append("size", "20");
    await ApiFetchService(API_URL + `user/lyric/home-navigate`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: API_KEY_PRODUCTION,
    }).then((response: any) => {
      if (response.code === 200) {
        if (state?.lyricData) {
          let array1 = response.data.content;
          let array2 = state.lyricData.authors;
          let array = [...array2, ...array1];
          let uniqueIds: any[] = [];
          // console.log(array);
          let unique = array.filter((data: any) => {
            const isDuplicate = uniqueIds.includes(data.id);
            console.log(isDuplicate);
            if (!isDuplicate) {
              uniqueIds.push(data.id);

              return true;
            }
            return false;
          });
          setSingerDataList(unique);
        } else {
          setSingerDataList(response.data.content);
        }
      }
    });
  };

  const clickedGoBack = useCallback(() => {
    navigate(-1);
  }, []);

  const clickedCreateLyric = useCallback(() => {
    if (!onValidate()) {
      return;
    } else {
      fetchCreateLyricApi();
    }
  }, [lyricName, selectedLyricPhoto, selectedSingerIdArray, lyricText]);

  const onValidate = (): boolean => {
    let lyricName1 = true;
    let lyricPhoto = true;
    let singerSelected = true;
    // let lyricText1 = true;

    switch (true) {
      case !lyricName.trim():
        lyricName1 = false;
        setErrorMessage("Please fill title");
        break;
      case selectedLyricPhoto.fileImage == null:
        lyricPhoto = false;
        setErrorMessage("Please upload lyric photo");
        break;
      case selectedSingerIdArray.length == 0:
        singerSelected = false;
        setErrorMessage("Please select singer");
        break;
      // case !lyricText.trim():
      //   lyricText1 = false;
      //   setErrorMessage("Please fill lyric text");
      //   break;
      default:
        setErrorMessage(" ");
        break;
    }

    return lyricName1 && lyricPhoto && singerSelected;
  };

  const fetchCreateLyricApi = async () => {
    let formData = new FormData();
    if (state?.lyricData) {
      formData.append("lyricId", state.lyricData.id);
    }
    formData.append("authors", selectedSingerIdArray);
    formData.append("name", lyricName);
    formData.append("file", selectedLyricPhoto.file);
    formData.append("lyricText", lyricText);

    await ApiFetchService(API_URL + `admin/lyric/save`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${props.token}`,
    }).then((response: any) => {
      navigate(-1);
    });
  };

  const changeLyricName = (event: any) => {
    setLyricName(event.target.value);
  };
  const changeLyricText = (event: any) => {
    console.log(event.target.value);
    setLyricText(event.target.value);
  };
  const onLyricPhotoChange = (event: any) => {
    const imageFile = event.target.files[0];
    if (!imageFile) {
      setErrorMessage("Please select image.");
      return false;
    }

    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
      setErrorMessage("Wrong Format");
      return false;
    }

    setErrorMessage(" ");
    setSelectedLyricPhoto((prevState) => ({
      file:
        event.target.files[0] != null ? event.target.files[0] : prevState.file,
      fileImage:
        event.target.files[0] != null
          ? URL.createObjectURL(event.target.files[0])
          : prevState.fileImage,
    }));
  };

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <IconButton onClick={clickedGoBack} style={{ marginRight: "10px" }}>
            <ArrowBackRoundedIcon className="back_icon" />
          </IconButton>
          <h3 className="text_header">
            {state?.lyricData ? "Edit Lyric" : "Create Lyric"}
          </h3>
        </div>
      </div>
      <div className="body_wrapper_container">
        <div className="lyric_body_container1">
          <div className="lyric_container1">
            {selectedLyricPhoto.fileImage == null ? (
              <div className="lyricPlacehorderPhoto_container">
                <WallpaperIcon
                  style={{
                    width: 120,
                    height: 120,
                    alignSelf: "center",
                    marginBottom: 12,
                  }}
                  fontSize="inherit"
                  className="profileIcon"
                />
                <Button
                  style={{
                    width: 140,
                    marginTop: 12,
                    fontSize: 12,
                    alignSelf: "center",
                  }}
                  variant="contained"
                  component="label"
                >
                  Upload Lyric
                  <input onChange={onLyricPhotoChange} type="file" hidden />
                </Button>
              </div>
            ) : (
              <div className="lyricPlacehorderPhoto_container1">
                <img
                  style={{ width: 250, height: 400, resize: "inline" }}
                  alt="preview image"
                  src={selectedLyricPhoto.fileImage}
                />
                <Button
                  style={{
                    height: 30,
                    margin: 0,
                    position: "absolute",
                    top: -10,
                    right: -30,
                    background: "red",
                    borderRadius: 30,
                  }}
                  variant="contained"
                  component="label"
                >
                  <CachedIcon
                    style={{
                      width: 30,
                      height: 30,
                    }}
                    fontSize="inherit"
                    className="reloadIcon"
                  />
                  <input onChange={onLyricPhotoChange} type="file" hidden />
                </Button>
              </div>
            )}
          </div>

          <div className="lyric_container1">
            <TextField
              type="text"
              value={lyricName}
              onChange={changeLyricName}
              style={{ width: "100%", marginTop: 12 }}
              id="outlined-basic"
              label="Title"
              variant="outlined"
            />

            <label
              style={{
                color: "red",
                margin: 16,
                fontSize: 12,
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              {errorMessage}
            </label>

            <MyButton
              onClick={clickedCreateLyric}
              style={{
                width: 120,
                borderRadius: "20px",
                marginTop: 6,
                alignSelf: "center",
              }}
              textColor="white"
              backgroundColor="#39bf39"
              hover_backgroundColor="#2fb02f"
            >
              <div className="create_text">
                {state?.lyricData ? "Update" : "Create"}
              </div>
            </MyButton>
          </div>
        </div>

        <div className="lyric_body_container2">
          <DataGrid
            apiRef={lyricTableRef}
            onRowSelectionModelChange={(rowSelectionModel) => {
              let selectedSingerIdArray: any[] = [];
              rowSelectionModel.forEach((value, id) => {
                selectedSingerIdArray.push(value);
              });
              setSelectedSingerIdArray(selectedSingerIdArray);
            }}
            style={{ width: 400 }}
            columns={[
              { field: "id", minWidth: 100, headerName: "Id" },
              {
                field: "name",
                minWidth: 160,
                flex: 2,
                headerName: "Singer Name",
              },
              {
                field: "imgPath",
                headerName: "Image",
                minWidth: 100,
                flex: 1,
                renderCell: ({ row: { profile } }) => {
                  return (
                    <img
                      style={{
                        width: 60,
                        height: 60,
                        marginTop: 12,
                        marginBottom: 12,
                        borderRadius: 10,
                      }}
                      src={`${API_URL}${profile}`}
                      alt=""
                    />
                  );
                },
              },
            ]}
            autoPageSize={true}
            rowHeight={80}
            rows={singerDataList}
            checkboxSelection
          />
        </div>
        <div className="lyric_container">
          <TextField
            id="outlined-multiline-static"
            label="Lyric Text"
            multiline
            value={lyricText}
            onChange={changeLyricText}
            maxRows={1}
            style={{
              width: "95%",
              alignSelf: "center",
            }}
            inputProps={{
              style: {
                height: "680px",
                textRendering: "auto",
                resize: "both",
                paddingRight: 32,
                width: "90%",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default connectToStore(CreatetLyric);
