import "./create_screen.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { IconButton, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MyButton } from "../MyButton";
import { ApiFetchService } from "../../service/ApiFetchService";
import { API_URL, token } from "../../Constant";

export function CreateCategory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [categoryName, setCategoryName] = useState("");
  const [errorMessage, setErrorMessage] = useState(" ");

  useEffect(() => {
    if (state?.categoryData) {
      setCategoryName(state.categoryData.name);
    }
  }, [state]);

  const clickedGoBack = useCallback(() => {
    navigate(-1);
  }, []);

  const changeCategoryName = (event: any) => {
    setCategoryName(event.target.value);
  };

  const clickedCreateCategory = useCallback(() => {
    if (!onValidate()) {
      return;
    } else {
      fetchCreateCategoryApi();
    }
  }, [categoryName]);

  const onValidate = (): boolean => {
    let categoryName1 = true;
    switch (true) {
      case !categoryName.trim():
        categoryName1 = false;
        setErrorMessage("Please fill category name");
        break;
      default:
        setErrorMessage(" ");
        break;
    }

    return categoryName1;
  };

  const fetchCreateCategoryApi = async () => {
    let formData = new FormData();
    if (state?.categoryData) {
      formData.append("categoryId", state.categoryData.id);
    }
    formData.append("name", categoryName);
    await ApiFetchService(API_URL + `admin/category/save`, formData, {
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

  return (
    <div className="container">
      <div className="header_container">
        <IconButton onClick={clickedGoBack} style={{ marginRight: "10px" }}>
          <ArrowBackRoundedIcon className="back_icon" />
        </IconButton>
        <h3 className="text_header">
          {state?.categoryData ? "Edit Category" : "Create Category"}
        </h3>
      </div>
      <div className="category_body_container">
        <TextField
          type="text"
          value={categoryName}
          onChange={changeCategoryName}
          style={{
            width: "100%",
            marginTop: 32,
          }}
          id="outlined-basic"
          label="Category name"
          variant="outlined"
        />

        <label
          style={{
            color: "red",
            alignSelf: "center",
            marginTop: 24,
            fontSize: 12,
            fontWeight: "bold",
          }}
        >
          {errorMessage}
        </label>

        <MyButton
          onClick={clickedCreateCategory}
          style={{
            width: 120,
            borderRadius: "20px",
            alignSelf: "center",
            marginTop: 20,
          }}
          textColor="white"
          backgroundColor="#39bf39"
          hover_backgroundColor="#2fb02f"
        >
          <div className="create_text">
            {state?.categoryData ? "Update" : "Create"}
          </div>
        </MyButton>
      </div>
    </div>
  );
}
