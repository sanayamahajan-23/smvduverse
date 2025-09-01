import { useMap } from "react-leaflet";

const ChangeView = ({ center }) => {
  const map = useMap();
  map.setView(center, 17, { animate: true });
  return null;
};

export default ChangeView;
