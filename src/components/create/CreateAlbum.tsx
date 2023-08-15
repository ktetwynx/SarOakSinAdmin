import "./create_album.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button, IconButton, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import CachedIcon from "@mui/icons-material/Cached";
import { MyButton } from "../MyButton";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL, token } from "../../Constant";

interface File {
  file: any;
  fileImage: any;
}

export function CreateAlbum() {
  const navigate = useNavigate();
  const [albumName, setAlbumName] = useState("");
  const [selectedAlbumPhoto, setSelectedAlbumPhoto] = useState<File>({
    file: null,
    fileImage: "",
  });
  const [errorMessage, setErrorMessage] = useState(" ");
  const [lyricDataList, setLyricDataList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [selectedLyricIdArray, setSelectedLyricIdArray] = useState<any>();
  const albumTableRef = useGridApiRef();

  useEffect(() => {
    fetchLyricApi();
  }, []);

  const fetchLyricApi = async () => {
    await ApiFetchService(API_URL + `admin/lyric/list`, null, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: "ApiKey f90f76d2-f70d-11ed-b67e-0242ac120002",
    }).then((response: any) => {
      setLyricDataList(response);
    });
  };

  const clickedGoBack = useCallback(() => {
    navigate(-1);
  }, []);

  const clickedCreateAlbum = useCallback(() => {
    if (!onValidate()) {
      return;
    } else {
      fetchCreateAlbumApi();
    }
  }, [albumName, selectedAlbumPhoto, selectedLyricIdArray]);

  const onValidate = (): boolean => {
    let albumName1 = true;
    let albumPhoto = true;
    let lyricSelected = true;
    switch (true) {
      case !albumName.trim():
        albumName1 = false;
        setErrorMessage("Please fill album name");
        break;
      case selectedAlbumPhoto.file == null:
        albumPhoto = false;
        setErrorMessage("Please upload album photo");
        break;
      case selectedLyricIdArray.length == 0:
        lyricSelected = false;
        setErrorMessage("Please select lyric");
        break;
      default:
        setErrorMessage(" ");
        break;
    }

    return albumName1 && albumPhoto && lyricSelected;
  };

  const fetchCreateAlbumApi = async () => {
    let formData = new FormData();
    formData.append("lyrics", selectedLyricIdArray);
    formData.append("name", albumName);
    formData.append("file", selectedAlbumPhoto.file);
    await ApiFetchService(API_URL + `admin/album/save`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: token,
    }).then((response: any) => {
      // if (response.code === 200) {
      //   setSingerDataList(response.data.content);
      // }
      navigate(-1);
    });
  };

  const changeAlbumName = (event: any) => {
    setAlbumName(event.target.value);
  };
  const onAlbumPhotoChange = (event: any) => {
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
    setSelectedAlbumPhoto((prevState) => ({
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
          <h3 className="text_header">Create Album</h3>
        </div>
      </div>
      <div className="body_wrapper_container">
        <div className="body_container1">
          <div className="albumPhoto_container">
            {selectedAlbumPhoto.file == null ? (
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
                  Upload Photo
                  <input onChange={onAlbumPhotoChange} type="file" hidden />
                </Button>
              </div>
            ) : (
              <div className="albumUploadPhoto_container">
                <img
                  style={{ width: 200, height: 200 }}
                  alt="preview image"
                  src={selectedAlbumPhoto.fileImage}
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
                  <input onChange={onAlbumPhotoChange} type="file" hidden />
                </Button>
              </div>
            )}
          </div>

          <div className="albumPhoto_container">
            <TextField
              type="text"
              onChange={changeAlbumName}
              style={{ width: "100%", marginTop: 32 }}
              id="outlined-basic"
              label="Album name"
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
              onClick={clickedCreateAlbum}
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
            apiRef={albumTableRef}
            // style={{ flex: 1 }}
            onRowSelectionModelChange={() => {
              let selectedLyricIdArray: any[] = [];
              albumTableRef.current.getSelectedRows().forEach((value, id) => {
                selectedLyricIdArray.push(value.id);
              });
              console.log(selectedLyricIdArray);
              setSelectedLyricIdArray(selectedLyricIdArray);
            }}
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
                renderCell: (params) => {
                  return (
                    <img
                      style={{
                        width: 60,
                        height: 60,
                        marginTop: 12,
                        marginBottom: 12,
                        borderRadius: 10,
                      }}
                      src={`${API_URL}${params.formattedValue}`}
                      alt=""
                    />
                  );
                },
              },
            ]}
            autoPageSize={true}
            rowHeight={80}
            rows={lyricDataList}
            checkboxSelection
          />
        </div>
      </div>
    </div>
  );
}
