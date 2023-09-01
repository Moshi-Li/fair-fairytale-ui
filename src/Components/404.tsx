import "./404.scss";
import Button from "@mui/joy/Button";

export default function PageNotFound() {
  return (
    <div className="page--404">
      <h1>Opss Story not found</h1>

      <a href="/fair-fairytale-ui">
        <Button>Go back to home page </Button>
      </a>
    </div>
  );
}
