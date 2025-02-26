import * as Icons from "@mui/icons-material";

export type IconNames = keyof typeof Icons;

interface IGenericIconProps {
  name: IconNames;
  color?: string;
}

export const Icon = ({ name, color = "#000000" }: IGenericIconProps): JSX.Element => {
  const CustomIcon = Icons[name];
  return <CustomIcon sx={{ color }} />;
};
