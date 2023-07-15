import { useEffect, useState } from "react";
import "./sidebar.css";
import { useNavigate } from "react-router-dom";

const sideBarData = [
  {
    title: "Book Set Up",
    categories: ["Category", "Author", "Book"],
  },
  {
    title: "Lyric Set Up",
    categories: ["Singer", "Album", "Lyric"],
  },
];
export function SideBar() {
  const navigate = useNavigate();
  const [isCategorySelected, setIsCategorySelected] = useState({
    titleSelected: 0,
    categorySelected: 0,
  });

  // useEffect(() => {
  //   navigate("/category");
  // }, []);

  return (
    <div className="sideBar">
      {sideBarData.map((value: any, index: number) => {
        return (
          <div>
            <div className="title">
              {isCategorySelected.titleSelected == index ? (
                <div className="title_marker_active" />
              ) : (
                <div className="title_marker_unactive" />
              )}

              <span className="title_text">{value.title}</span>
            </div>
            <div className="category">
              {value.categories.map((value1: string, index1: number) => {
                return (
                  <span
                    className={
                      isCategorySelected.categorySelected == index1 &&
                      isCategorySelected.titleSelected == index
                        ? "category_text active"
                        : "category_text"
                    }
                    onClick={() => {
                      navigate(`/${value1.toLowerCase()}`);
                      setIsCategorySelected({
                        titleSelected: index,
                        categorySelected: index1,
                      });
                    }}
                  >
                    {value1}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
