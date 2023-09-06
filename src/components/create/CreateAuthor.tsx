import "./create_singer.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Button, IconButton, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CachedIcon from "@mui/icons-material/Cached";
import { MyButton } from "../MyButton";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL } from "../../Constant";
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

const CreateAuthor = (props: Props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [authorName, setAuthorName] = useState("");
  const [selectedAuthorPhoto, setSelectedAuthorPhoto] = useState<File>({
    file: null,
    fileImage: null,
  });
  const [errorMessage, setErrorMessage] = useState(" ");

  useEffect(() => {
    if (state?.authorData) {
      setAuthorName(state?.authorData.name);
      setSelectedAuthorPhoto({
        file: null,
        fileImage: state ? API_URL + state?.authorData.profile : null,
      });
    }
  }, [state]);

  const clickedGoBack = useCallback(() => {
    navigate(-1);
  }, []);

  const clickedCreateAuthor = useCallback(() => {
    if (!onValidate()) {
      return;
    } else {
      fetchCreateAuthorApi();
    }
  }, [authorName, selectedAuthorPhoto]);

  const onValidate = (): boolean => {
    let authorName1 = true;
    let authorPhoto = true;
    switch (true) {
      case !authorName.trim():
        authorName1 = false;
        setErrorMessage("Please fill author name");
        break;
      case selectedAuthorPhoto.fileImage == null:
        authorPhoto = false;
        setErrorMessage("Please upload singer photo");
        break;
      default:
        setErrorMessage(" ");
        break;
    }

    return authorName1 && authorPhoto;
  };

  const fetchCreateAuthorApi = useCallback(async () => {
    let formData = new FormData();
    if (state?.authorData) {
      formData.append("authorId", state.authorData.id);
    }
    formData.append("name", authorName);
    formData.append("authorType", "1");
    formData.append("profile", selectedAuthorPhoto.file);
    await ApiFetchService(API_URL + `admin/author/save`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${props.token}`,
    }).then((response: any) => {
      // if (response.code === 201) {
      // }
      navigate(-1);
    });
  }, [authorName, selectedAuthorPhoto]);

  const changeAuthorName = (event: any) => {
    setAuthorName(event.target.value);
  };
  const onAuthorPhotoChange = (event: any) => {
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
    setSelectedAuthorPhoto((prevState) => ({
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
          <h3 className="text_header">
            {state?.authorData ? "Edit Author" : "Create Author"}
          </h3>
        </div>
      </div>
      <div className="body_container">
        <div className="singerPhoto_container">
          {selectedAuthorPhoto.fileImage == null ? (
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
                <input onChange={onAuthorPhotoChange} type="file" hidden />
              </Button>
            </div>
          ) : (
            <div className="singerUploadPhoto_container">
              <img
                style={{ width: 200, height: 200 }}
                alt="preview image"
                src={selectedAuthorPhoto.fileImage}
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
                <input onChange={onAuthorPhotoChange} type="file" hidden />
              </Button>
            </div>
          )}
        </div>

        <div className="singerPhoto_container">
          <TextField
            type="text"
            value={authorName}
            onChange={changeAuthorName}
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
            onClick={clickedCreateAuthor}
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
            <div className="create_text">
              {state?.authorData ? "Update" : "Create"}
            </div>
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default connectToStore(CreateAuthor);
