import "./create_singer.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button, IconButton, TextField } from "@mui/material";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CachedIcon from "@mui/icons-material/Cached";
import { MyButton } from "../MyButton";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL, token } from "../../Constant";

interface File {
  file: any;
  fileImage: string;
}

export function CreateSinger() {
  const navigate = useNavigate();
  const [singerName, setSingerName] = useState("");
  const [selectedSingerPhoto, setSelectedSingerPhoto] = useState<File>({
    file: null,
    fileImage: "",
  });
  const [errorMessage, setErrorMessage] = useState(" ");
  const clickedGoBack = useCallback(() => {
    navigate(-1);
  }, []);

  const clickedCreateSinger = useCallback(() => {
    if (!onValidate()) {
      return;
    } else {
      fetchCreateSingerApi();
    }
  }, [singerName, selectedSingerPhoto]);

  const onValidate = (): boolean => {
    let singerName1 = true;
    let singerPhoto = true;
    switch (true) {
      case !singerName.trim():
        singerName1 = false;
        setErrorMessage("Please fill singer name");
        break;
      case selectedSingerPhoto.file == null:
        singerPhoto = false;
        setErrorMessage("Please upload singer photo");
        break;
      default:
        setErrorMessage(" ");
        break;
    }

    return singerName1 && singerPhoto;
  };

  const fetchCreateSingerApi = useCallback(async () => {
    let formData = new FormData();
    formData.append("name", singerName);
    formData.append("authorType", "2");
    formData.append("profile", selectedSingerPhoto.file);
    await ApiFetchService(API_URL + `admin/author/save`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: token,
    }).then((response: any) => {
      // if (response.code === 201) {
      // }
      navigate(-1);
    });
  }, [singerName, selectedSingerPhoto]);

  const changeSingerName = (event: any) => {
    setSingerName(event.target.value);
  };
  const onSingerPhotoChange = (event: any) => {
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
    setSelectedSingerPhoto((prevState) => ({
      file: imageFile ? imageFile : prevState.file,
      fileImage: imageFile
        ? URL.createObjectURL(imageFile)
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
          <h3 className="text_header">Create Singer</h3>
        </div>
      </div>
      <div className="body_container">
        <div className="singerPhoto_container">
          {selectedSingerPhoto.file == null ? (
            <div className="singerPlacehorderPhoto_container">
              <AccountCircleIcon
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
                <input onChange={onSingerPhotoChange} type="file" hidden />
              </Button>
            </div>
          ) : (
            <div className="singerUploadPhoto_container">
              <img
                style={{ width: 200, height: 200 }}
                alt="preview image"
                src={selectedSingerPhoto.fileImage}
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
                <input onChange={onSingerPhotoChange} type="file" hidden />
              </Button>
            </div>
          )}
        </div>

        <div className="singerPhoto_container">
          <TextField
            type="text"
            onChange={changeSingerName}
            style={{ width: "100%", marginTop: 32 }}
            id="outlined-basic"
            label="Singer name"
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
            onClick={clickedCreateSinger}
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
    </div>
  );
}
