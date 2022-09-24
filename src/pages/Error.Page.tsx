import { useRouteError } from "react-router-dom";

export default function Error() {
  const error: any = useRouteError();

  return (
    <div className="h-screen w-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">♔ Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </div>
    </div>
  );
}
