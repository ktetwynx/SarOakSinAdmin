import "./create_lyric.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button, IconButton, TextField } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import CachedIcon from "@mui/icons-material/Cached";
import { MyButton } from "../MyButton";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL } from "../../Constant";

interface File {
  file: any;
  fileImage: any;
}

export function CreatetLyric() {
  const navigate = useNavigate();
  const [lyricName, setLyricName] = useState("");
  const [selectedLyricPhoto, setSelectedLyricPhoto] = useState({
    file: null,
    fileImage: "",
  });
  const [errorMessage, setErrorMessage] = useState(" ");
  const [singerDataList, setSingerDataList] = useState([]);
  const [selectedSingerId, setSelectedSingerId] = useState<number>(0);
  const [totalPage, setTotalPage] = useState(0);
  const lyricTableRef = useGridApiRef();

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
        setSingerDataList(response.data.content);
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
  }, [lyricName, selectedLyricPhoto, selectedSingerId]);

  const onValidate = (): boolean => {
    let lyricName1 = true;
    let lyricPhoto = true;
    let singerSelected = true;

    switch (true) {
      case !lyricName.trim():
        lyricName1 = false;
        setErrorMessage("Please fill title");
        break;
      case selectedLyricPhoto.file == null:
        lyricPhoto = false;
        setErrorMessage("Please upload lyric photo");
        break;
      case selectedSingerId == 0:
        singerSelected = false;
        setErrorMessage("Please select singer");
        break;
      default:
        setErrorMessage(" ");
        break;
    }

    return lyricName1 && lyricPhoto && singerSelected;
  };

  const fetchCreateLyricApi = async () => {
    let formData = new FormData();
    formData.append("name", "author");
    formData.append("page", "0");
    formData.append("size", "20");
    // await ApiFetchService(API_URL + `user/lyric/home-navigate`, formData, {
    //   "Content-Type": "multipart/form-data",
    //   Accept: "application/json",
    //   Authorization: "ApiKey f90f76d2-f70d-11ed-b67e-0242ac120002",
    // }).then((response: any) => {
    //   if (response.code === 200) {
    //     setSingerDataList(response.data.content);
    //   }
    // });
  };

  const changeLyricName = (event: any) => {
    setLyricName(event.target.value);
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
          <h3 className="text_header">Create Lyric</h3>
        </div>
      </div>
      <div className="body_wrapper_container">
        <div className="body_container1">
          <div className="albumPhoto_container">
            {selectedLyricPhoto.file == null ? (
              <div className="albumPlacehorderPhoto_container">
                <WallpaperIcon
                  style={{ width: 120, height: 120 }}
                  fontSize="inherit"
                  className="profileIcon"
                />
                <Button
                  style={{ width: 140, marginTop: 12, fontSize: 12 }}
                  variant="contained"
                  component="label"
                >
                  Upload Lyric
                  <input onChange={onLyricPhotoChange} type="file" hidden />
                </Button>
              </div>
            ) : (
              <div className="albumUploadPhoto_container">
                <img
                  style={{ width: 200, height: 200 }}
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

          <div className="albumPhoto_container">
            <TextField
              type="text"
              onChange={changeLyricName}
              style={{ width: "100%", marginTop: 32 }}
              id="outlined-basic"
              label="Title"
              variant="outlined"
            />

            <label
              style={{
                color: "red",
                margin: 16,
                fontSize: 12,
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
                marginTop: 28,
                alignSelf: "center",
              }}
              textColor="white"
              backgroundColor="#39bf39"
              hover_backgroundColor="#2fb02f"
            >
              <div className="create_text">Create</div>
            </MyButton>
          </div>
        </div>
        <div className="body_container2">
          <DataGrid
            apiRef={lyricTableRef}
            onRowSelectionModelChange={() => {
              lyricTableRef.current.getSelectedRows().forEach((value, id) => {
                setSelectedSingerId(value.id);
              });
            }}
            // style={{ flex: 1 }}
            columns={[
              { field: "id", minWidth: 100, headerName: "Id" },
              {
                field: "name",
                minWidth: 300,
                flex: 2,
                headerName: "Lyric Name",
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
      </div>
    </div>
  );
}
