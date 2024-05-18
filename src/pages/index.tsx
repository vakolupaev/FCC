import NavbarComponent from "@/components/navbar";
import usePageStore from "@/store/page.store";
import MapPage from "./map";
import CameraPage from "./camera";


const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

function Main() {

  const { page, setPage }: any = usePageStore();

  const pageSelector = () => {
    console.log(page);
    switch (page) {
      case "map": return <MapPage />
      case "camera": return <CameraPage />
    }
  }

  return (
    <div className="window" >
      <NavbarComponent />
      {pageSelector()}
    </div>
  )
}

export default Main