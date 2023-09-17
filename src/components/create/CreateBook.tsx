import "./create_book.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Autocomplete, Button, IconButton, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CachedIcon from "@mui/icons-material/Cached";
import { MyButton } from "../MyButton";
import { DataGrid, GridRowId, useGridApiRef } from "@mui/x-data-grid";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_KEY_PRODUCTION, API_URL } from "../../Constant";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { RenderCurrentPageLabelProps } from "@react-pdf-viewer/page-navigation";
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

const CreateBook = (props: Props) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [bookName, setBookName] = useState("");
  const [selectedBookPhoto, setSelectedBookPhoto] = useState<File>({
    file: null,
    fileImage: null,
  });
  const [errorMessage, setErrorMessage] = useState(" ");
  const [categoryDataList, setCategoryDataList] = useState<any>([]);
  const [totalPage, setTotalPage] = useState(0);
  const [pdfTotalPage, setPdfTotalPage] = useState<any>();
  const [selectedCategoriesId, setSelectedCategoriesId] = useState<any>();

  const [selectedAuthor, setSelectedAuthor] = useState<any>({
    id: null,
    label: null,
  });
  const [authors, setAuthors] = useState<any>([]);
  const [bookPdfFileView, setBookPdfFileView] = useState<any>(null);
  const [bookPdfFile, setBookPdfFile] = useState<any>(null);
  const bookTableRef = useGridApiRef();
  const bookPlugin = defaultLayoutPlugin();

  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { CurrentPageLabel } = pageNavigationPluginInstance;

  let rowIds: GridRowId[] = [];
  useEffect(() => {
    fetchCategoriesApi();
    fetchAuthorApi();
  }, []);

  useEffect(() => {
    if (state?.bookData) {
      setBookName(state.bookData.name);
      setPdfTotalPage(state.bookData.page);
      setSelectedAuthor({
        id: state.bookData.myAuthor?.id,
        label: state.bookData.myAuthor?.name,
      });
      setBookPdfFileView(API_URL + state.bookData.path);
      // setCategoryDataList(state.bookData.categories);
      state.bookData.categories.forEach((value: any, id: any) => {
        rowIds.push(value.id);
      });
      bookTableRef.current.setRowSelectionModel(rowIds);
      setSelectedBookPhoto({
        file: null,
        fileImage: state ? API_URL + state?.bookData.imgPath : null,
      });
    }
  }, [state]);

  const fetchAuthorApi = async () => {
    let formData = new FormData();
    formData.append("name", "authorBook");
    formData.append("page", "0");
    formData.append("size", "20");
    await ApiFetchService(API_URL + `user/lyric/home-navigate`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: API_KEY_PRODUCTION,
    }).then((response: any) => {
      if (response.code === 200) {
        let authorList: any[] = [];
        response.data.content.forEach((value: any, id: any) => {
          authorList.push({ label: value.name, id: value.id });
        });
        setAuthors(authorList);
      }
    });
  };

  const fetchCategoriesApi = async () => {
    await ApiFetchService(API_URL + `admin/category/list`, null, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: API_KEY_PRODUCTION,
    }).then((response: any) => {
      setCategoryDataList((prev: any) => [...prev, ...response.content]);
    });
  };

  const clickedGoBack = useCallback(() => {
    navigate(-1);
  }, []);

  const clickedCreateBook = useCallback(() => {
    if (!onValidate()) {
      return;
    } else {
      fetchCreateBookApi();
    }
  }, [
    bookName,
    selectedBookPhoto,
    selectedCategoriesId,
    selectedAuthor,
    bookPdfFileView,
    bookPdfFile,
  ]);

  const onValidate = (): boolean => {
    let bookName1 = true;
    let bookPhoto = true;
    let categorySelected = true;
    let authorSelected = true;
    let bookPdfFile1 = true;

    switch (true) {
      case !bookName.trim():
        bookName1 = false;
        setErrorMessage("Please fill book name");
        break;
      case selectedBookPhoto.fileImage == null:
        bookPhoto = false;
        setErrorMessage("Please upload book photo");
        break;
      case selectedCategoriesId.length == 0:
        categorySelected = false;
        setErrorMessage("Please select category");
        break;
      case selectedAuthor.id == null:
        authorSelected = false;
        setErrorMessage("Please select author");
        break;
      case bookPdfFileView == null:
        bookPdfFile1 = false;
        setErrorMessage("Please upload book pdf");
        break;
      default:
        setErrorMessage(" ");
        break;
    }

    return (
      bookName1 &&
      bookPhoto &&
      categorySelected &&
      bookPdfFile1 &&
      authorSelected
    );
  };

  const fetchCreateBookApi = async () => {
    let formData = new FormData();
    if (state?.bookData) {
      formData.append("bookId", state.bookData.id);
    }
    formData.append("categories", selectedCategoriesId);
    formData.append("myAuthor", selectedAuthor.id);
    formData.append("name", bookName);
    formData.append("imgFile", selectedBookPhoto.file);
    formData.append("file", bookPdfFile);
    formData.append("page", pdfTotalPage);
    await ApiFetchService(API_URL + `admin/book/save`, formData, {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${props.token}`,
    }).then((response: any) => {
      // if (response.code === 200) {
      // }
      console.log(response);
      navigate(-1);
    });
  };

  const changeBookName = (event: any) => {
    setBookName(event.target.value);
  };

  const changeAuthorName = (event: any) => {
    setSelectedAuthor({ label: event.target.value });
  };

  const onBookPdfChange = (event: any) => {
    const pdfFile = event.target.files[0];
    if (!pdfFile?.name.match(/\.(pdf)$/)) {
      setErrorMessage("Wrong Format");
      return false;
    }

    if (!pdfFile) {
      setErrorMessage("Please upload pdf.");
      return false;
    } else {
      let reader = new FileReader();
      reader.readAsDataURL(pdfFile);
      reader.onload = (e: any) => {
        setBookPdfFileView(e.target.result);
        setBookPdfFile(pdfFile);
      };
    }
    setErrorMessage(" ");
  };

  const onBookPhotoChange = (event: any) => {
    const imageFile = event.target.files[0];
    if (!imageFile) {
      setErrorMessage("Please upload image.");
      return false;
    }

    if (!imageFile.name.match(/\.(jpg|jpeg|png)$/)) {
      setErrorMessage("Wrong Format");
      return false;
    }

    setErrorMessage(" ");
    setSelectedBookPhoto((prevState) => ({
      file:
        event.target.files[0] != null ? event.target.files[0] : prevState.file,
      fileImage:
        event.target.files[0] != null
          ? URL.createObjectURL(event.target.files[0])
          : prevState.fileImage,
    }));
  };

  const pdfTotalNumberView = useCallback(() => {
    return (
      <CurrentPageLabel>
        {(props: RenderCurrentPageLabelProps) => (
          <span>{`${props.currentPage + 1} of ${props.numberOfPages}`}</span>
        )}
      </CurrentPageLabel>
    );
  }, []);

  return (
    <div className="container">
      <div className="text_container">
        <div className="header_container">
          <IconButton onClick={clickedGoBack} style={{ marginRight: "10px" }}>
            <ArrowBackRoundedIcon className="back_icon" />
          </IconButton>
          <h3 className="text_header">
            {state?.bookData ? "Edit Book" : "Create Book"}
          </h3>
        </div>
      </div>
      <div className="body_wrapper_container">
        <div className="body_container1">
          <div className="albumPhoto_container">
            {selectedBookPhoto.fileImage == null ? (
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
                  <input onChange={onBookPhotoChange} type="file" hidden />
                </Button>
              </div>
            ) : (
              <div className="bookUploadPhoto_container">
                <img
                  style={{ width: 200, height: 200 }}
                  alt="preview image"
                  src={selectedBookPhoto.fileImage}
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
                  <input onChange={onBookPhotoChange} type="file" hidden />
                </Button>
              </div>
            )}
          </div>

          <div className="albumPhoto_container">
            <TextField
              type="text"
              value={bookName}
              onChange={changeBookName}
              style={{ width: "100%", marginTop: 32 }}
              id="outlined-basic"
              label="Book name"
              variant="outlined"
            />

            <Autocomplete
              value={selectedAuthor.id ? selectedAuthor : ""}
              disableClearable={true}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(event: any, value: any) => {
                setSelectedAuthor({ id: value.id, label: value.label });
              }}
              id="combo-box-demo"
              options={authors}
              sx={{ width: "100%", marginTop: 3 }}
              renderInput={(params) => (
                <TextField
                  onChange={changeAuthorName}
                  {...params}
                  label="Author"
                />
              )}
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
              onClick={clickedCreateBook}
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
                {state?.bookData ? "Update" : "Create"}
              </div>
            </MyButton>
          </div>
        </div>

        {/* UPLOAD PDF VIEW */}
        <div className="upload_pdf_container">
          {bookPdfFileView == null ? (
            <div
              style={{
                border: "0.5px solid grey",
                borderRadius: 40,
                height: "100%",
                justifyContent: "center",
              }}
              className="albumPlacehorderPhoto_container"
            >
              <UploadFileIcon
                style={{ width: 120, height: 120 }}
                fontSize="inherit"
                className="profileIcon"
              />
              <Button
                style={{ width: 140, marginTop: 40, fontSize: 12 }}
                variant="contained"
                component="label"
              >
                Upload PDF
                <input onChange={onBookPdfChange} type="file" hidden />
              </Button>
            </div>
          ) : (
            <div className="bookUploadPdf_container">
              <div
                style={{
                  border: "1px solid rgba(0, 0, 0, 0.3)",
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    alignItems: "center",
                    backgroundColor: "#eeeeee",
                    borderBottom: "1px solid rgba(0, 0, 0, 0.3)",
                    display: "flex",
                    justifyContent: "center",
                    padding: "8px",
                  }}
                >
                  {pdfTotalNumberView()}
                </div>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <Viewer
                      onDocumentLoad={(e: any) => {
                        setPdfTotalPage(e.doc.numPages);
                      }}
                      fileUrl={bookPdfFileView}
                      plugins={[pageNavigationPluginInstance]}
                    />
                  </Worker>
                </div>
              </div>

              <Button
                style={{
                  height: 30,
                  margin: 0,
                  position: "absolute",
                  top: -10,
                  right: 0,
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
                <input onChange={onBookPdfChange} type="file" hidden />
              </Button>
            </div>
          )}
        </div>
        <div className="body_container2">
          <DataGrid
            apiRef={bookTableRef}
            onRowSelectionModelChange={(rowSelectionModel) => {
              let selectedCategoriesIdArray: any[] = [];
              rowSelectionModel.forEach((value, id) => {
                selectedCategoriesIdArray.push(value);
              });
              setSelectedCategoriesId(selectedCategoriesIdArray);
            }}
            columns={[
              { field: "id", minWidth: 100, headerName: "Id" },
              {
                field: "name",
                minWidth: 300,
                flex: 2,
                headerName: "Cateogory Name",
              },
            ]}
            autoPageSize={true}
            rowHeight={80}
            rows={categoryDataList}
            checkboxSelection
          />
        </div>
      </div>
    </div>
  );
};
export default connectToStore(CreateBook);
