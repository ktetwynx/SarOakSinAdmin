import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

interface Props {
  isVisible: boolean;
  clickedOnClose: () => void;
  clickedOnDelete: (row: any) => void;
  data: any;
}
export function DeleteDialog(props: Props) {
  return (
    <Modal open={props.isVisible} onClose={props.clickedOnClose}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
      >
        <span style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
          Confirmation
        </span>
        <Divider />
        <span
          style={{ fontSize: 14, padding: 10 }}
        >{`Are you sure you want to delete ${
          props?.data?.name ? props.data.name : ""
        }?`}</span>
        <Box
          sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}
        >
          <Button
            variant="plain"
            color="neutral"
            onClick={props.clickedOnClose}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={() => props.clickedOnDelete(props.data)}
          >
            Delete
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
