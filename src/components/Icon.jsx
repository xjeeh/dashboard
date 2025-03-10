import * as Icons from "@mui/icons-material";

export const Icon = ({ name, onClick, title, color = "#000000" }) => {
  const CustomIcon = Icons[name];
  return <CustomIcon sx={{ color }} title={title} onClick={onClick} />;
};
