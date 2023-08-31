import { Grid } from "react-loader-spinner";
import "./Loader.scss";

const LoaderComponent = () => {
  return (
    <>
      <Grid
        height="80"
        width="80"
        color="#319795"
        ariaLabel="grid-loading"
        radius="12.5"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
    </>
  );
};

export default function Loader() {
  return (
    <div className="loader--container">
      <LoaderComponent />
    </div>
  );
}
