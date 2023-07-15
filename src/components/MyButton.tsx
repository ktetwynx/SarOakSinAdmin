import * as React from "react";
import { StyledComponentProps, styled } from "@mui/material/styles";
import Button, { ButtonProps } from "@mui/material/Button";

interface props {
  backgroundColor: string;
  hover_backgroundColor: string;
  textColor: string;
  style: StyledComponentProps;
}

export const MyButton = styled(Button)<ButtonProps & props>((props) => ({
  color: props.textColor,
  backgroundColor: props.backgroundColor,
  "&:hover": {
    backgroundColor: props.hover_backgroundColor,
  },
}));
