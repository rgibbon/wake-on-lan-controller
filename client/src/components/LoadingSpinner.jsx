import ScaleLoader from "react-spinners/ScaleLoader";

export default function (style = {}) {
  return (
    <ScaleLoader
      color="green"
      height={70}
      margin={10}
      radius={100}
      speedMultiplier={0.75}
      width={35}
      style={style}
    />
  );
}
